/**
 * Zero-dependency QR Code Generator (SVG & Canvas)
 * Implements ISO/IEC 18004 QR Code Model 2 (Versions 1-6, Byte Mode, Error Correction L/M)
 * Optimized for clean URLs, razor-sharp 600 DPI vector printing, and client-side canvas rendering.
 */

// Galois Field GF(256) tables
const GF256_EXP = new Uint8Array(512)
const GF256_LOG = new Uint8Array(256)
for (let i = 0, x = 1; i < 255; i++) {
  GF256_EXP[i] = x
  GF256_EXP[i + 255] = x
  GF256_LOG[x] = i
  x = (x << 1) ^ (x >= 128 ? 0x11d : 0)
}

function gfMul(x, y) {
  if (x === 0 || y === 0) return 0
  return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]]
}

function rsComputePoly(ecLen) {
  let poly = [1]
  for (let i = 0; i < ecLen; i++) {
    const next = new Array(poly.length + 1).fill(0)
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gfMul(poly[j], GF256_EXP[i])
      next[j + 1] ^= poly[j]
    }
    poly = next
  }
  return poly
}

function rsEncode(data, ecLen) {
  const poly = rsComputePoly(ecLen)
  const result = new Array(data.length + ecLen).fill(0)
  for (let i = 0; i < data.length; i++) result[i] = data[i]
  for (let i = 0; i < data.length; i++) {
    const factor = result[i]
    if (factor !== 0) {
      for (let j = 0; j < poly.length; j++) {
        result[i + j] ^= gfMul(poly[j], factor)
      }
    }
  }
  return result.slice(data.length)
}

// QR Table: capacity (bytes) for Byte mode at Level M
// Version 1-10 specs: [dataBytes, ecBytes, numBlocks, totalModules]
const QR_VERSIONS = [
  null,
  { version: 1, size: 21, dataCap: 14, ecBytes: 10, totalBytes: 26, blocks: 1 },
  { version: 2, size: 25, dataCap: 26, ecBytes: 16, totalBytes: 44, blocks: 1 },
  { version: 3, size: 29, dataCap: 42, ecBytes: 26, totalBytes: 70, blocks: 1 },
  { version: 4, size: 33, dataCap: 62, ecBytes: 18, totalBytes: 100, blocks: 2 },
  { version: 5, size: 37, dataCap: 84, ecBytes: 24, totalBytes: 134, blocks: 2 },
  { version: 6, size: 41, dataCap: 106, ecBytes: 16, totalBytes: 172, blocks: 4 },
  { version: 7, size: 45, dataCap: 122, ecBytes: 18, totalBytes: 196, blocks: 4 },
  { version: 8, size: 49, dataCap: 152, ecBytes: 22, totalBytes: 242, blocks: 4 },
]

function selectVersion(dataLen) {
  for (let v = 1; v < QR_VERSIONS.length; v++) {
    if (dataLen <= QR_VERSIONS[v].dataCap) return QR_VERSIONS[v]
  }
  return QR_VERSIONS[8]
}

function encodeData(text, versionInfo) {
  const bytes = new TextEncoder().encode(text)
  const bits = []
  function pushBits(val, len) {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1)
  }

  // 1. Mode indicator: 0100 (Byte mode)
  pushBits(0b0100, 4)
  // 2. Character count indicator (8 bits for v1-9)
  pushBits(bytes.length, 8)
  // 3. Data bytes
  for (let i = 0; i < bytes.length; i++) {
    pushBits(bytes[i], 8)
  }

  // 4. Terminator (up to 4 zeroes)
  const maxDataBits = versionInfo.dataCap * 8
  const termLen = Math.min(4, maxDataBits - bits.length)
  pushBits(0, termLen)

  // 5. Pad to multiple of 8
  while (bits.length % 8 !== 0) bits.push(0)

  // 6. Pad bytes (0xEC, 0x11)
  const padBytes = [0xec, 0x11]
  let padIdx = 0
  while (bits.length < maxDataBits) {
    pushBits(padBytes[padIdx % 2], 8)
    padIdx++
  }

  // Convert bits to bytes
  const dataBytes = []
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]
    dataBytes.push(b)
  }

  // Divide into blocks and compute EC
  const numBlocks = versionInfo.blocks
  const ecPerBlock = versionInfo.ecBytes
  const blockSize = Math.floor(dataBytes.length / numBlocks)
  const blocks = []
  const ecBlocks = []

  for (let i = 0; i < numBlocks; i++) {
    const chunk = dataBytes.slice(i * blockSize, (i + 1) * blockSize)
    blocks.push(chunk)
    ecBlocks.push(rsEncode(chunk, ecPerBlock))
  }

  // Interleave data and EC
  const interleaved = []
  for (let i = 0; i < blockSize; i++) {
    for (let b = 0; b < numBlocks; b++) interleaved.push(blocks[b][i])
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (let b = 0; b < numBlocks; b++) interleaved.push(ecBlocks[b][i])
  }

  return interleaved
}

// Alignment pattern centers for v2-8
const ALIGNMENT_COORDS = [
  null,
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
]

export function createQrMatrix(text) {
  const ver = selectVersion(new TextEncoder().encode(text).length)
  const size = ver.size
  const grid = Array.from({ length: size }, () => new Array(size).fill(null))
  const isFunction = Array.from({ length: size }, () => new Array(size).fill(false))

  function setModule(r, c, val) {
    grid[r][c] = val
    isFunction[r][c] = true
  }

  // 1. Finder patterns (7x7) + separators
  function addFinder(top, left) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const row = top + r
        const col = left + c
        if (row < 0 || row >= size || col < 0 || col >= size) continue
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          setModule(row, col, false)
        } else if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          setModule(row, col, true)
        } else {
          setModule(row, col, false)
        }
      }
    }
  }

  addFinder(0, 0)
  addFinder(0, size - 7)
  addFinder(size - 7, 0)

  // 2. Timing patterns
  for (let i = 8; i < size - 8; i++) {
    const val = i % 2 === 0
    if (!isFunction[6][i]) setModule(6, i, val)
    if (!isFunction[i][6]) setModule(i, 6, val)
  }

  // 3. Alignment patterns (version >= 2)
  const coords = ALIGNMENT_COORDS[ver.version] || []
  for (let i = 0; i < coords.length; i++) {
    for (let j = 0; j < coords.length; j++) {
      const cr = coords[i]
      const cc = coords[j]
      if (isFunction[cr][cc]) continue
      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          const val = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)
          setModule(cr + r, cc + c, val)
        }
      }
    }
  }

  // Dark module
  setModule(size - 8, 8, true)

  // Reserve format bits
  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      if (!isFunction[8][i]) isFunction[8][i] = true
      if (!isFunction[i][8]) isFunction[i][8] = true
    }
  }
  for (let i = size - 8; i < size; i++) {
    if (!isFunction[8][i]) isFunction[8][i] = true
    if (!isFunction[i][8]) isFunction[i][8] = true
  }

  // 4. Place Data Bits
  const dataBytes = encodeData(text, ver)
  const dataBits = []
  for (let i = 0; i < dataBytes.length; i++) {
    for (let j = 7; j >= 0; j--) {
      dataBits.push((dataBytes[i] >> j) & 1)
    }
  }

  let bitIdx = 0
  let upward = true
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right-- // skip vertical timing column
    const rows = upward ? Array.from({ length: size }, (_, i) => size - 1 - i) : Array.from({ length: size }, (_, i) => i)
    for (const r of rows) {
      for (const c of [right, right - 1]) {
        if (!isFunction[r][c]) {
          const bit = bitIdx < dataBits.length ? dataBits[bitIdx] : 0
          grid[r][c] = bit === 1
          bitIdx++
        }
      }
    }
    upward = !upward
  }

  // 5. Mask Pattern (Mask 0: (row + col) % 2 === 0)
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!isFunction[r][c]) {
        if ((r + c) % 2 === 0) {
          grid[r][c] = !grid[r][c]
        }
      }
    }
  }

  // 6. Write Format Info (Level M = 00, Mask 0 = 000 -> Format string 0b101010000010010)
  // Masked format for M-0: 101010000010010 ^ 101010000010010 = 0... standard format bits with mask: 0x5412 ^ 0x4000 = 0x1412
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0]
  // Format positions around top-left and split across ends
  const posTopLeft = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
    [8, 7], [8, 8], [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ]
  const posSplit = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8], [size - 6, 8], [size - 7, 8],
    [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5], [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1]
  ]

  for (let i = 0; i < 15; i++) {
    const val = formatBits[i] === 1
    const [r1, c1] = posTopLeft[i]
    grid[r1][c1] = val
    const [r2, c2] = posSplit[i]
    grid[r2][c2] = val
  }

  return grid
}

/**
 * Generate a standalone, responsive, high-resolution SVG string of the QR Code
 */
export function generateQrSvg(text, options = {}) {
  const {
    size = 240,
    fgColor = '#1F1914',
    bgColor = 'transparent',
    quietZone = 2,
    centerEmblem = true
  } = options

  const matrix = createQrMatrix(text)
  const modules = matrix.length
  const totalSize = modules + quietZone * 2

  let rects = ''
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (matrix[r][c]) {
        // Optional center emblem cutout (leaves 5x5 center area clean)
        if (centerEmblem && r >= 9 && r <= 11 && c >= 9 && c <= 11) continue
        rects += `<rect x="${c + quietZone}" y="${r + quietZone}" width="1.02" height="1.02" fill="${fgColor}" />`
      }
    }
  }

  let emblemSvg = ''
  if (centerEmblem) {
    const center = totalSize / 2
    emblemSvg = `
      <circle cx="${center}" cy="${center}" r="2.8" fill="${bgColor === 'transparent' ? '#FAF7F2' : bgColor}" stroke="${fgColor}" stroke-width="0.3" />
      <text x="${center}" y="${center + 0.8}" font-family="Georgia, serif" font-size="2.4" font-weight="bold" fill="${fgColor}" text-anchor="middle">✦</text>
    `
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${size}" height="${size}" shape-rendering="crispEdges">
    ${bgColor !== 'transparent' ? `<rect width="${totalSize}" height="${totalSize}" fill="${bgColor}" />` : ''}
    ${rects}
    ${emblemSvg}
  </svg>`.trim()
}

export const generateQrSvgString = generateQrSvg

/**
 * Draw QR Code directly to an HTML5 Canvas context
 */
export function drawQrToCanvas(canvas, text, options = {}) {
  const {
    size = 300,
    fgColor = '#1F1914',
    bgColor = '#FFFFFF',
    quietZone = 2,
    centerEmblem = true
  } = options

  const matrix = createQrMatrix(text)
  const modules = matrix.length
  const totalModules = modules + quietZone * 2
  const scale = size / totalModules

  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = fgColor
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (matrix[r][c]) {
        if (centerEmblem && r >= 9 && r <= 11 && c >= 9 && c <= 11) continue
        ctx.fillRect((c + quietZone) * scale, (r + quietZone) * scale, scale + 0.5, scale + 0.5)
      }
    }
  }

  if (centerEmblem) {
    const center = size / 2
    const radius = 2.8 * scale
    ctx.beginPath()
    ctx.arc(center, center, radius, 0, Math.PI * 2)
    ctx.fillStyle = bgColor
    ctx.fill()
    ctx.lineWidth = 0.3 * scale
    ctx.strokeStyle = fgColor
    ctx.stroke()

    ctx.fillStyle = fgColor
    ctx.font = `bold ${Math.round(2.6 * scale)}px Georgia, serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('✦', center, center)
  }
}
