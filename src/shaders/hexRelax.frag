// Lloyd-relaxed hex tiling

// Hexagonal grid coordinates
vec2 hexGrid(vec2 p) {
    vec2 q = vec2(p.x * 2.0 / sqrt(3.0), p.y);
    vec2 r = floor(q);
    vec2 f = fract(q);
    
    if (f.x + f.y > 1.0) {
        r += vec2(1.0);
    }
    
    return r;
}

// Get hexagon center from grid coordinates
vec2 hexCenter(vec2 hex) {
    return vec2(hex.x * sqrt(3.0) / 2.0, hex.y + hex.x * 0.5);
}

// Lloyd relaxation step
vec2 lloydRelax(vec2 p, vec2 center, float time) {
    vec2 offset = vec2(
        sin(time + center.x * 3.17 + center.y * 2.13),
        cos(time * 0.7 + center.x * 2.71 - center.y * 1.43)
    ) * u_jitter;
    
    return center + offset;
}

vec3 hexRelaxShader(vec2 st, float time) {
    vec2 p = st * u_hexScale;
    
    // Find nearest hex centers
    vec2 hexCoord = hexGrid(p);
    float minDist = 1000.0;
    vec2 nearestCenter = vec2(0.0);
    vec3 cellColor = vec3(0.0);
    
    // Check surrounding hexagons
    for (float dx = -2.0; dx <= 2.0; dx++) {
        for (float dy = -2.0; dy <= 2.0; dy++) {
            vec2 hex = hexCoord + vec2(dx, dy);
            vec2 center = hexCenter(hex);
            
            // Apply Lloyd relaxation
            for (float i = 0.0; i < 5.0; i++) {
                if (i >= u_relaxSteps) break;
                center = lloydRelax(p, center, time * 0.2 + i * 0.1);
            }
            
            float dist = length(p - center);
            if (dist < minDist) {
                minDist = dist;
                nearestCenter = center;
                
                // Cell color based on position
                float hue = dot(hex, vec2(0.1, 0.15)) + time * 0.02;
                cellColor = hsv2rgb(vec3(hue, 0.6, 0.8));
            }
        }
    }
    
    // Create cell boundaries
    float edge = 1.0 - smoothstep(0.0, 0.1 / u_blendSharpness, minDist);
    
    // Add gradient within cells
    float gradient = 1.0 - minDist * 0.5;
    cellColor *= gradient;
    
    // Morphing animation
    float morph = sin(time * 0.3 + length(nearestCenter) * 0.5) * 0.5 + 0.5;
    cellColor = mix(cellColor, cellColor.zyx, morph * 0.3);
    
    // Edge highlighting
    vec3 edgeColor = vec3(1.0, 0.9, 0.8);
    cellColor = mix(cellColor, edgeColor, edge * 0.3);
    
    return cellColor;
}
