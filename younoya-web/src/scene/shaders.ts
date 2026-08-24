export const VERT = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const FRAG = /* glsl */ `
precision highp float;

uniform sampler2D uTex;
uniform sampler2D uDepth;
uniform float uFade;      // 0 = black, 1 = fully visible (dip-to-black cuts)
uniform float uZoom;      // per-scene monotonic push
uniform float uArc;       // per-scene vertical drift (resets hidden in black)
uniform vec2  uMouse;     // smoothed -1..1
uniform float uTime;
uniform float uPlaneAspect;
uniform float uImageAspect;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 coverUv(vec2 uv) {
  if (uPlaneAspect < uImageAspect) {
    uv.x = (uv.x - 0.5) * (uPlaneAspect / uImageAspect) + 0.5;
  } else {
    uv.y = (uv.y - 0.5) * (uImageAspect / uPlaneAspect) + 0.5;
  }
  return uv;
}

vec2 parallaxUv(vec2 baseUv, vec2 offset) {
  float d = texture2D(uDepth, clamp(baseUv, 0.001, 0.999)).r;
  return clamp(baseUv + offset * (d - 0.42), 0.001, 0.999);
}

void main() {
  vec2 uv = coverUv(vUv);
  vec2 zoomed = (uv - 0.5) / uZoom + 0.5;

  // camera offset: mouse micro-parallax + gentle drift — nothing else
  vec2 offset = uMouse * 0.02 + vec2(0.0, uArc);

  float d = texture2D(uDepth, clamp(zoomed, 0.001, 0.999)).r;

  vec3 color = texture2D(uTex, parallaxUv(zoomed, offset)).rgb;

  // depth fog: far pixels sit darker -> cheap depth-of-field read
  color *= 0.93 + 0.09 * d;

  // cinematic vignette
  float vig = smoothstep(1.12, 0.32, length(vUv - vec2(0.5, 0.46)));
  color *= mix(0.78, 1.0, vig);

  // constant film grain
  color += (hash(vUv * 913.7 + fract(uTime)) - 0.5) * 0.013;

  // exposure cut: dip through black between scenes, never blend two frames
  color *= pow(clamp(uFade, 0.0, 1.0), 1.35);

  gl_FragColor = vec4(color, 1.0);
}
`
