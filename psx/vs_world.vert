const bool distort = true;

const int dist_amount1 = 160;
const int dist_amount2 = 120;

layout (location = 0) out vec4 color;

void main() {
  gl_TexCoord[0] = gl_TextureMatrix[0] * gl_MultiTexCoord0;
  gl_TexCoord[1] = gl_TextureMatrix[1] * gl_MultiTexCoord1;
  gl_TexCoord[2] = gl_TextureMatrix[2] * gl_MultiTexCoord2;
  color = gl_Color;

  vec4 eyePos = gl_ModelViewMatrix * gl_Vertex;

  vec4 pos = ftransform();
  if (distort) {
    pos.xyz = pos.xyz / pos.w;
    pos.x = floor(dist_amount1 * pos.x) / dist_amount1;
    pos.y = floor(dist_amount2 * pos.y) / dist_amount2;
    pos.xyz *= pos.w;
  }
  gl_Position = pos;
  gl_FogFragCoord = abs(eyePos.z / eyePos.w);
}
