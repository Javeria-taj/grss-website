// Atmospheric glow fragment shader
uniform float intensity;
uniform vec3 glowColor;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Fresnel-based rim glow
  vec3 viewDir = normalize(-vPosition);
  float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
  float glow = pow(rim, 2.8) * intensity;
  gl_FragColor = vec4(glowColor * glow, glow * 0.85);
}
