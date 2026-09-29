import React, { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link2,
  Unlink,
  Undo,
  Redo,
  Sparkles,
  ExternalLink,
  Check,
  X,
  Compass,
  ShoppingBag,
  Sparkle
} from 'lucide-react'
import '../styles/editor.css'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

/**
 * Lightweight converter for legacy markdown articles so existing posts open seamlessly in TipTap
 */
function convertLegacyMarkdownToHtml(raw: string): string {
  if (!raw) return ''
  const trimmed = raw.trim()
  if (trimmed.startsWith('<p>') || trimmed.startsWith('<div') || trimmed.startsWith('<h') || trimmed.startsWith('<article')) {
    return raw // Already HTML
  }

  const lines = raw.split(/\r?\n/)
  const htmlParts: string[] = []
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (!line) {
      if (inList) {
        htmlParts.push('</ul>')
        inList = false
      }
      continue
    }

    if (line.startsWith('## ')) {
      if (inList) { htmlParts.push('</ul>'); inList = false }
      htmlParts.push(`<h2>${parseInlineMd(line.slice(3))}</h2>`)
      continue
    }

    if (line.startsWith('### ')) {
      if (inList) { htmlParts.push('</ul>'); inList = false }
      htmlParts.push(`<h3>${parseInlineMd(line.slice(4))}</h3>`)
      continue
    }

    if (line.startsWith('> ')) {
      if (inList) { htmlParts.push('</ul>'); inList = false }
      htmlParts.push(`<blockquote><p>${parseInlineMd(line.slice(2))}</p></blockquote>`)
      continue
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        htmlParts.push('<ul>')
        inList = true
      }
      htmlParts.push(`<li>${parseInlineMd(line.slice(2))}</li>`)
      continue
    }

    if (inList) {
      htmlParts.push('</ul>')
      inList = false
    }

    htmlParts.push(`<p>${parseInlineMd(line)}</p>`)
  }

  if (inList) htmlParts.push('</ul>')
  return htmlParts.join('\n')
}

function parseInlineMd(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="article-backlink">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [isExternal, setIsExternal] = useState(false)
  const linkInputRef = useRef<HTMLInputElement>(null)

  const initialHtml = React.useMemo(() => convertLegacyMarkdownToHtml(content), [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        code: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'article-backlink',
        },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: 'article-inline-img',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Compose your chapter with celestial depth. Select text to add backlinks or press Ctrl+K...',
      }),
    ],
    content: initialHtml,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
  })

  // Keyboard shortcut Ctrl+K / Cmd+K for opening link popover
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        handleOpenLinkModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editor])

  if (!editor) {
    return <div className="tiptap-skeleton">Warming the quill of the atelier...</div>
  }

  function handleOpenLinkModal() {
    if (!editor) return
    const { from, to } = editor.state.selection
    const selected = editor.state.doc.textBetween(from, to, ' ')
    const existingHref = editor.getAttributes('link').href || ''

    setLinkText(selected)
    setLinkUrl(existingHref)
    setIsExternal(existingHref.startsWith('http'))
    setIsLinkModalOpen(true)

    setTimeout(() => {
      linkInputRef.current?.focus()
      linkInputRef.current?.select()
    }, 50)
  }

  function handleApplyLink(urlToApply?: string) {
    if (!editor) return
    const finalUrl = (urlToApply || linkUrl).trim()

    if (!finalUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setIsLinkModalOpen(false)
      return
    }

    // Ensure valid protocol for external links
    let safeUrl = finalUrl
    if (!safeUrl.startsWith('/') && !safeUrl.startsWith('http://') && !safeUrl.startsWith('https://') && !safeUrl.startsWith('#')) {
      safeUrl = `https://${safeUrl}`
    }

    const isExt = safeUrl.startsWith('http') && !safeUrl.includes('younoya.com')

    if (linkText && editor.state.selection.empty) {
      // Insert new link text with link
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: linkText,
          marks: [
            {
              type: 'link',
              attrs: {
                href: safeUrl,
                class: 'article-backlink',
                target: isExt ? '_blank' : null,
                rel: isExt ? 'noopener noreferrer' : null,
              },
            },
          ],
        })
        .run()
    } else {
      // Update mark on active selection
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({
          href: safeUrl,
          target: isExt ? '_blank' : null,
          rel: isExt ? 'noopener noreferrer' : null,
        })
        .run()
    }

    setIsLinkModalOpen(false)
    setLinkUrl('')
    setLinkText('')
  }

  function handleRemoveLink() {
    if (!editor) return
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setIsLinkModalOpen(false)
  }

  const isLinkActive = editor.isActive('link')

  return (
    <div className="tiptap-wrap">
      {/* Editorial Luxury Toolbar */}
      <div className="tiptap-toolbar">
        <div className="tiptap-toolbar__group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`tiptap-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
            title="Bold (Ctrl+B)"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`tiptap-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
            title="Italic (Ctrl+I)"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`tiptap-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
            title="Strikethrough"
          >
            <Strikethrough size={14} />
          </button>
        </div>

        <div className="tiptap-toolbar__divider" />

        <div className="tiptap-toolbar__group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`tiptap-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
            title="Heading 2"
          >
            <Heading2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`tiptap-btn ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
            title="Heading 3"
          >
            <Heading3 size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`tiptap-btn ${editor.isActive('paragraph') ? 'is-active' : ''}`}
            title="Regular Paragraph"
          >
            <Pilcrow size={14} />
          </button>
        </div>

        <div className="tiptap-toolbar__divider" />

        <div className="tiptap-toolbar__group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`tiptap-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
            title="Bullet List"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`tiptap-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
            title="Numbered List"
          >
            <ListOrdered size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`tiptap-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
            title="Blockquote"
          >
            <Quote size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="tiptap-btn"
            title="Divider Line"
          >
            <Minus size={14} />
          </button>
        </div>

        <div className="tiptap-toolbar__divider" />

        {/* Backlinks Engine Controls */}
        <div className="tiptap-toolbar__group tiptap-toolbar__group--link">
          <button
            type="button"
            onClick={handleOpenLinkModal}
            className={`tiptap-btn tiptap-btn--highlight ${isLinkActive ? 'is-active' : ''}`}
            title="Add or Edit Backlink (Ctrl+K)"
          >
            <Link2 size={14} />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>Link</span>
          </button>

          {isLinkActive && (
            <button
              type="button"
              onClick={handleRemoveLink}
              className="tiptap-btn tiptap-btn--danger"
              title="Remove Link"
            >
              <Unlink size={13} />
            </button>
          )}

          {/* Quick Preset Shortcuts */}
          <button
            type="button"
            onClick={() => handleApplyLink('/shop')}
            className="tiptap-btn tiptap-btn--pill"
            title="Link selected text to Collection (/shop)"
          >
            <ShoppingBag size={12} />
            <span>Shop</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyLink('/find-a-gift')}
            className="tiptap-btn tiptap-btn--pill"
            title="Link selected text to Gift Finder (/find-a-gift)"
          >
            <Compass size={12} />
            <span>Finder</span>
          </button>
        </div>

        <div className="tiptap-toolbar__spacer" />

        <div className="tiptap-toolbar__group">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="tiptap-btn"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={13} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="tiptap-btn"
            title="Redo (Ctrl+Y)"
          >
            <Redo size={13} />
          </button>
        </div>
      </div>

      {/* Interactive Floating Link Modal */}
      {isLinkModalOpen && (
        <div className="tiptap-link-overlay" onClick={() => setIsLinkModalOpen(false)}>
          <div className="tiptap-link-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tiptap-link-modal__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Link2 size={14} color="#D6B06A" />
                <strong>Insert / Edit Backlink</strong>
              </div>
              <button
                type="button"
                className="tiptap-link-modal__close"
                onClick={() => setIsLinkModalOpen(false)}
              >
                <X size={14} />
              </button>
            </div>

            <div className="tiptap-link-modal__body">
              {linkText !== undefined && (
                <div className="tiptap-modal-field">
                  <label>Anchor Text</label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="e.g. Growthspare or Astrological Gifting"
                    className="tiptap-modal-input"
                  />
                </div>
              )}

              <div className="tiptap-modal-field">
                <label>Destination URL</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    ref={linkInputRef}
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleApplyLink()
                      }
                    }}
                    placeholder="https://example.com or /shop or /find-a-gift"
                    className="tiptap-modal-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyLink()}
                    className="tiptap-modal-submit"
                  >
                    <Check size={14} /> Apply
                  </button>
                </div>
              </div>

              {/* Quick Preset Route Chips */}
              <div className="tiptap-modal-presets">
                <span className="tiptap-modal-presets__title">Quick Presets:</span>
                <div className="tiptap-modal-presets__chips">
                  <button
                    type="button"
                    onClick={() => setLinkUrl('/shop')}
                    className="tiptap-chip"
                  >
                    ✦ The Collection (/shop)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkUrl('/find-a-gift')}
                    className="tiptap-chip"
                  >
                    ✦ Gift Finder (/find-a-gift)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkUrl('/blog')}
                    className="tiptap-chip"
                  >
                    ✦ The Journal (/blog)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkUrl('/product/flamingo-grace')}
                    className="tiptap-chip"
                  >
                    ✦ Flamingo Grace Brooch
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkUrl('/product/solar-embrace')}
                    className="tiptap-chip"
                  >
                    ✦ Solar Embrace Brooch
                  </button>
                </div>
              </div>

              {isLinkActive && (
                <div style={{ marginTop: '12px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={handleRemoveLink}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#b91c1c',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Remove link from text
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="tiptap-content-box">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
