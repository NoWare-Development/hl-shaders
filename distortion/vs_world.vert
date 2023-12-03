
const bool distort = false;
const int dist_type = 0;

const int dist_amount1 = 10;
const int dist_amount2 = 15;

layout(location = 0) out vec4 color;

void main()
{
	gl_TexCoord[0]  = gl_TextureMatrix[0] * gl_MultiTexCoord0;	//Albedo
	gl_TexCoord[1]  = gl_TextureMatrix[1] * gl_MultiTexCoord1;	//Lighmap
	gl_TexCoord[2]  = gl_TextureMatrix[2] * gl_MultiTexCoord2;	//Detail
	color = gl_Color;

  vec4 eyePos = gl_ModelViewMatrix * gl_Vertex;

  vec4 pos = ftransform();
  if (distort) {
    if (dist_type == 0) {
      vec2 uv1 = gl_TexCoord[0].xy;
      vec2 uv2 = gl_TexCoord[1].xy;

      vec2 dist = vec2(uv1.x + uv2.y, uv2.x - uv1.y);

      pos.x += sin(length(dist.x + dist.y) * cos(dist.y + dist.x) * dist_amount1) * dist_amount2;
    }
    else if (dist_type == 1) {
      vec2 uv1 = gl_TexCoord[0].xy;

      vec2 dist = vec2(uv1.x + uv1.y, uv1.x - uv1.y);
      dist = normalize(dist) + (eyePos.xy * 0.0001);

      pos.x += sin(length(dist.x + dist.y) * cos(dist.y + dist.x) * dist_amount1) * dist_amount2;
    }
  }
  gl_Position = pos;
	gl_FogFragCoord = abs( eyePos.z / eyePos.w );
}
