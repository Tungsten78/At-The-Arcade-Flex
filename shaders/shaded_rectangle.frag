#version 120
//------------------------------------------------------------------
// Public Domain Rectangle Shader
//
// By tsaylor, for AttractMode layout "At-The-Arcade Multi-Cab"
//
// Draw a shaded rectangle with the specified color and alpha value,
// at position shadePosition with size shadeSize.
//------------------------------------------------------------------

uniform vec2 screenResolution;
uniform vec2 fragmentOffset; // defines position of gl_FragCoord relative to AM surface

uniform vec2 shadeSize; // size to draw, width/height
uniform vec2 shadePosition; // position to draw, x/y
uniform vec3 shadeColor; // r/g/b of section to draw
uniform float shadeAlpha; // alpha of section to draw

void main()
{
	// Determine position within screen fragment, translated to AM-style coordinates
	vec2 pos = vec2(gl_FragCoord.x + fragmentOffset.x, screenResolution.y - gl_FragCoord.y + fragmentOffset.y);

    vec2 shaper = vec2(step(shadePosition.x, pos.x), step(shadePosition.y, pos.y)) *
				  vec2(step(pos.x, shadePosition.x + shadeSize.x), step(pos.y, shadePosition.y + shadeSize.y));
    float alpha = shaper.x * shaper.y;

    if (alpha < 0.01 || shadeAlpha < 0.01)
	{
        discard;  // ignore pixels that are not shaded (or lightly shaded)
	}

	gl_FragColor = vec4(shadeColor.r / 255., shadeColor.g / 255., shadeColor.b / 255., alpha * (shadeAlpha / 255.));
}
