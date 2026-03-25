// Topographic - animated contour map with elevation coloring

vec3 topographicShader(vec2 st, float time) {
    vec2 p = st * u_topoScale;
    float t = time * u_topoSpeed;
    
    // Generate animated terrain elevation
    float elevation = 0.0;
    
    // Large-scale terrain features
    elevation += fbm(p * 0.5 + vec2(t * 0.05, t * 0.03), 6.0) * 1.0;
    
    // Medium features
    elevation += fbm(p * 1.0 + vec2(sin(t * 0.1) * 0.5, cos(t * 0.08) * 0.5), 4.0) * 0.4;
    
    // Fine detail
    elevation += noise(p * 3.0 + t * 0.1) * 0.15;
    
    // Contour lines
    float levels = u_topoLevels;
    float contourValue = elevation * levels;
    float contourLine = abs(fract(contourValue) - 0.5) * 2.0;
    
    // Sharp contour lines
    float thickness = u_topoThickness;
    float contour = smoothstep(thickness, thickness + 0.05, contourLine);
    
    // Major contour lines (every 5th line is thicker)
    float majorContourValue = elevation * levels / 5.0;
    float majorContourLine = abs(fract(majorContourValue) - 0.5) * 2.0;
    float majorContour = smoothstep(thickness * 2.0, thickness * 2.0 + 0.05, majorContourLine);
    
    // Index contours (label lines) - thickest
    float indexValue = elevation * levels / 10.0;
    float indexLine = abs(fract(indexValue) - 0.5) * 2.0;
    float indexContour = smoothstep(thickness * 3.0, thickness * 3.0 + 0.05, indexLine);
    
    // Combine contours
    float allContours = min(contour, min(majorContour, indexContour));
    
    // Elevation-based coloring (hypsometric tinting)
    vec3 color;
    float elev = clamp(elevation, 0.0, 1.0);
    
    // Color ramp: deep blue -> green -> yellow -> brown -> white (snow)
    if (elev < 0.2) {
        color = mix(vec3(0.1, 0.2, 0.5), vec3(0.15, 0.5, 0.3), elev / 0.2);
    } else if (elev < 0.4) {
        color = mix(vec3(0.15, 0.5, 0.3), vec3(0.3, 0.6, 0.2), (elev - 0.2) / 0.2);
    } else if (elev < 0.6) {
        color = mix(vec3(0.3, 0.6, 0.2), vec3(0.8, 0.7, 0.3), (elev - 0.4) / 0.2);
    } else if (elev < 0.8) {
        color = mix(vec3(0.8, 0.7, 0.3), vec3(0.5, 0.35, 0.2), (elev - 0.6) / 0.2);
    } else {
        color = mix(vec3(0.5, 0.35, 0.2), vec3(0.95, 0.95, 1.0), (elev - 0.8) / 0.2);
    }
    
    // Hillshade - directional lighting
    float dx = fbm((p + vec2(0.01, 0.0)) * 0.5 + vec2(t * 0.05, t * 0.03), 6.0) - 
               fbm((p - vec2(0.01, 0.0)) * 0.5 + vec2(t * 0.05, t * 0.03), 6.0);
    float dy = fbm((p + vec2(0.0, 0.01)) * 0.5 + vec2(t * 0.05, t * 0.03), 6.0) - 
               fbm((p - vec2(0.0, 0.01)) * 0.5 + vec2(t * 0.05, t * 0.03), 6.0);
    
    vec2 lightDir = normalize(vec2(cos(t * 0.2), sin(t * 0.2)));
    float hillshade = dot(normalize(vec2(-dx, -dy)), lightDir) * 0.5 + 0.5;
    hillshade = 0.4 + 0.6 * hillshade;
    
    color *= hillshade;
    
    // Apply contour lines
    vec3 contourColor = vec3(0.15, 0.1, 0.08); // Dark brown contour lines
    vec3 majorColor = vec3(0.1, 0.07, 0.05); // Darker for major
    
    color = mix(majorColor, color, allContours);
    
    // Subtle paper texture
    float paperTex = noise(st * 50.0) * 0.05;
    color += vec3(paperTex);
    
    return clamp(color, 0.0, 1.0);
}
