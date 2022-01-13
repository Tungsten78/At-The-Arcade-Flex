#version 120
//----------------------------------------------------------------------------------------------
// Masked Color Sample Shader
//
// By tsaylor, for AttractMode layout "At-The-Arcade Multi-Cab"
//
// Given a "mask" texture and a texture to sample, output the combined
// result. This is used to color a cabinet "topper" based on the color
// of the cabinet (by sampling a particular point), combined with the alpha
// values of both textures (including additional sample points for alpha).
//
// Summary of what is happening here:
//  - Copy the left/right edges of the cabint up into the topper (copyRect/copyRect2)
//  - Color the rest of the topper based on samplePoint (merging alpha values)
//  - Check alpha values from two other samplePoints to conditionally hide the topper
//----------------------------------------------------------------------------------------------

uniform sampler2D maskTexture; // texture of mask image
uniform vec2 maskDimensions; // width/height of mask texture
uniform vec2 surfaceDimensions; // width/height of containing surface

uniform vec4 copyRect;
uniform vec4 copyRect2;

uniform sampler2D sampleTexture; // texture of image to sample
uniform vec2 sampleDimensions; // width/height of sample texture
uniform vec2 samplePoint; // pixel to sample for color, to apply to output
uniform vec2 samplePoint2; // pixel to sample for transparency, to hide output
uniform vec2 samplePoint3; // pixel to sample for transparency, to hide output

// Returns true if the specified point is within the described rectangle
// (x, y, width, height), inclusive.
bool pointWithinRect(vec2 pt, vec4 rect)
{
	vec2 size = rect.zw;
	
	return pt.x >= rect.x
		&& pt.y >= rect.y
		&& pt.x < rect.x + size.x
		&& pt.y < rect.y + size.y;
}

void main()
{
	// Determine position within screen fragment, translated to AM-style coordinates
	vec2 maskPos = vec2(gl_FragCoord.x, surfaceDimensions.y - gl_FragCoord.y);

	// Sample the texture and the mask (first pixel for color/alpha, additional pixels used for alpha only)
	vec4 maskPixel = texture2D(maskTexture, maskPos / maskDimensions);
	vec4 samplePixel = texture2D(sampleTexture, samplePoint / sampleDimensions);
	vec4 samplePixel2 = texture2D(sampleTexture, samplePoint2 / sampleDimensions);
	vec4 samplePixel3 = texture2D(sampleTexture, samplePoint3 / sampleDimensions);

	float alpha = samplePixel.a * maskPixel.a;
	
	// For specified regions, copy the sample pixels to the output
	if (pointWithinRect(maskPos, copyRect) || pointWithinRect(maskPos, copyRect2))
	{
		// The corresponding pixel in the sample texture. If we always used this location,
		// the cabinet top image would become a copy of the upper cabinet section.
		samplePixel = texture2D(sampleTexture, maskPos / sampleDimensions);
		alpha = samplePixel.a * maskPixel.a;
		if (samplePixel.a < 0.7)
		{
			discard; // hide mask (topper) areas that are mostly transparent in sample image (cabinet edge)
		}
	}

	// Combine the mask with the sample texture color
	float alphaSamples = samplePixel2.a * samplePixel3.a;
	if (alpha < 0.1 || alphaSamples < 0.2)
	{
		discard;
	}

	gl_FragColor = vec4(vec3(samplePixel.xyz), alpha);
}
