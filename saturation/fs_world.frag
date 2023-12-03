const float vibrance_amount = -1.0;
const float brightness = 1.0;
const bool fullbright = false;

#extension GL_ARB_explicit_uniform_location : require

layout(location = 0) in vec4 inColor;
layout(location = 0) out vec4 color;

//There doesn't seem to be a way for us to get at the fixed-function GL_FOG enabled state, so use a manual uniform
uniform bool fogEnabled;
uniform uint fogMode;	// 0: Linear, 1: Exp, 2: Exp2

#define TEXTURE_ALBEDO 0
#define TEXTURE_ALBEDO_MASK (1 << TEXTURE_ALBEDO)

#define TEXTURE_LIGHTMAP 1
#define TEXTURE_LIGHTMAP_MASK (1 << TEXTURE_LIGHTMAP)

#define TEXTURE_DETAIL 2
#define TEXTURE_DETAIL_MASK (1 << TEXTURE_DETAIL)

#if (TEXTURE_MASK & TEXTURE_ALBEDO_MASK)
layout(binding = 0) uniform sampler2D albedoSampler;
#endif

#if (TEXTURE_MASK & TEXTURE_LIGHTMAP_MASK)
layout(binding = 1) uniform sampler2D lightmapSampler;
#endif

#if (TEXTURE_MASK & TEXTURE_DETAIL_MASK)
layout(binding = 2) uniform sampler2D detailSampler;
#endif

void main()
{
#if (TEXTURE_MASK & TEXTURE_ALBEDO_MASK)
    vec4 albedo = texture2D(albedoSampler, gl_TexCoord[0].xy);
#endif

#if (TEXTURE_MASK & TEXTURE_LIGHTMAP_MASK)
    // Josh:
    // Magic number from the original overbright code.
    vec3 lightmap = texture2D(lightmapSampler, gl_TexCoord[1].xy).rgb * (128.0f / 192.0f);
#endif

#if ( ( TEXTURE_MASK & TEXTURE_ALBEDO_MASK ) && ( TEXTURE_MASK & TEXTURE_LIGHTMAP_MASK ) )
    // Josh:
    // From the original blend eqn for overbrights.
    vec3 diffuse = albedo.rgb * lightmap.rgb + lightmap.rgb * albedo.rgb;
    color = vec4(diffuse.rgb, albedo.a);
#elif ( TEXTURE_MASK & TEXTURE_LIGHTMAP_MASK )
    color = vec4(lightmap.rgb, 1.0f);
#elif ( TEXTURE_MASK & TEXTURE_ALBEDO_MASK )
    color = vec4(albedo.rgb, albedo.a);
#else
    color = vec4(1.0f);
#endif

#if (TEXTURE_MASK & TEXTURE_DETAIL_MASK)
    // Josh:
    // From DetailTexture.cpp -> MODULATE and SCALE * 2
    vec3 detail = texture2D(detailSampler, gl_TexCoord[2].xy).rgb;
    color.rgb = color.rgb * detail * 2.0f;
#endif

    color *= inColor;
	
    if ( fogEnabled )
    {
        float fogFactor;
        if ( fogMode == 2 ) // Exp2
        {
            fogFactor = exp( -pow( gl_Fog.density * gl_FogFragCoord, 2.0 ) );
        }
        else if ( fogMode == 1 )	// Exp
        {
            fogFactor = exp( -gl_Fog.density * gl_FogFragCoord );
        }
        else	// Linear
        {
            fogFactor = ( gl_Fog.end - gl_FogFragCoord ) * gl_Fog.scale;
        }
		
        fogFactor = clamp( fogFactor, 0, 1 );
        color.xyz = mix( gl_Fog.color.xyz, color.xyz, fogFactor );
    }

#if (TEXTURE_MASK & TEXTURE_ALBEDO_MASK)
    if (fullbright)
      color = albedo;
#endif

    vec4 coeff = vec4(0.299, 0.587, 0.114, 0.0);
    float lum = dot(color, coeff);
    vec4 mask = (color - vec4(lum));
    mask = clamp(mask, 0.0, 1.0);
    float lumMask = dot(coeff, mask);
    lumMask = 1.0 - lumMask;
    const vec4 colorBuf = color;
    color = vec4(mix(vec4(lum), color, 1.0 + vibrance_amount + lumMask).rgb, color.a);
}
