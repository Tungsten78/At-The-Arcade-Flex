#version 120
//------------------------------------------------------------------
// Public Domain Arc Shader
//
// By tsaylor, for AttractMode layout "At-The-Arcade Multi-Cab", with thanks to Oomek.
//
// Draw a shaded arc with the specified color and alpha value, at
// center position shadeCenter as an ellipse with x/y "radius" of shadeRadius.
// The center/radius values describe the outer ellipse, and the arcWidth is
// subtracted to define the inner ellipse (and the area between the two is shaded).
//------------------------------------------------------------------

uniform vec2 screenResolution;
uniform vec2 fragmentOffset; // defines position of gl_FragCoord relative to AM surface

uniform vec2 shadeRadius; // x/y radius for an ellipse
uniform vec2 shadeCenter; // center point for the ellipse
uniform float arcWidth; // width of arc being shaded
uniform vec3 shadeColor; // r/g/b of section to draw
uniform float shadeAlpha; // alpha of section to draw
uniform float shadeEdge; // level of anti-aliasing applied to the edge

// Linear step function
float lstep(float e1, float e2, float d)
{
    return clamp((d - e1) / (e2 - e1), 0.0, 1.0);
}

void main()
{
	// Determine position within screen fragment, translated to AM-style coordinates
	vec2 pos = vec2(gl_FragCoord.x + fragmentOffset.x, screenResolution.y - gl_FragCoord.y + fragmentOffset.y);
	pos = shadeCenter - pos;

	// Determine whether the current point is within the inner and outer curves of the ellipse
	// Formula for points on an ellipse: (x^2)/(a^2) + (y^2)(b^2) = 1
    float inner = ((pos.x * pos.x) / ((shadeRadius.x - arcWidth) * (shadeRadius.x - arcWidth))) + ((pos.y * pos.y) / ((shadeRadius.y - arcWidth) * (shadeRadius.y - arcWidth)));
    float outer = ((pos.x * pos.x) / (shadeRadius.x * shadeRadius.x)) + ((pos.y * pos.y) / (shadeRadius.y * shadeRadius.y));

	// Set an alpha multiplier based on whether the value is between the innner/outer regions
	float edge = 1. + shadeEdge * (1. / screenResolution.x);
	float outerStep = lstep(edge, 1., outer);
	float innerStep = lstep(1., edge, inner);
	float alpha = outerStep * innerStep;
	
    if (alpha < 0.01 || shadeAlpha < 0.01)
	{
        discard;  // ignore pixels that are not shaded (or lightly shaded)
	}
		
	gl_FragColor = vec4(shadeColor.r / 255., shadeColor.g / 255., shadeColor.b / 255., alpha * shadeAlpha / 255.);
}
