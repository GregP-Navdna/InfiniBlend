// Kaleidoscope shader

vec3 kaleidoShader(vec2 st, float time) {
    vec2 p = st;
    
    // Center and scale
    p *= u_kaleidoZoom;
    
    // Convert to polar coordinates
    float radius = length(p);
    float angle = atan(p.y, p.x);
    
    // Rotate over time
    angle += time * u_kaleidoRotation;
    
    // Create kaleidoscope effect
    float segments = u_kaleidoSegments;
    angle = mod(angle, 2.0 * 3.14159 / segments);
    angle = abs(angle - 3.14159 / segments);
    
    // Convert back to cartesian
    p = vec2(cos(angle), sin(angle)) * radius;
    
    // Apply offset
    p += u_kaleidoOffset;
    
    // Create pattern
    float pattern = 0.0;
    
    // Layer 1: Flowing noise
    vec2 p1 = p * 2.0 + time * 0.1;
    pattern += fbm(p1, 4.0) * 0.5;
    
    // Layer 2: Circular waves
    float waves = sin(radius * 10.0 - time * 2.0) * 0.5 + 0.5;
    pattern += waves * 0.3;
    
    // Layer 3: Star pattern
    float star = 0.0;
    for(float i = 0.0; i < 5.0; i++) {
        vec2 starP = p * rot2(i * 1.256 + time * 0.1);
        star += 1.0 / (1.0 + length(starP * 5.0));
    }
    pattern += star * 0.2;
    
    // Layer 4: Geometric shapes
    vec2 grid = fract(p * 4.0) - 0.5;
    float shapes = 1.0 - smoothstep(0.1, 0.15, length(grid));
    pattern += shapes * 0.2;
    
    // Color mapping
    vec3 color;
    
    // Create vibrant colors based on angle and pattern
    float hue = angle / (3.14159 / segments) + pattern * 0.3 + time * 0.05;
    float saturation = 0.6 + 0.4 * sin(pattern * 3.14159);
    float value = 0.3 + 0.7 * pattern;
    
    color = hsv2rgb(vec3(hue, saturation, value));
    
    // Add some sparkle
    float sparkle = pow(star, 3.0) * 0.5;
    color += vec3(sparkle);
    
    // Radial gradient fade
    float fade = 1.0 - smoothstep(0.5, 2.0, radius / u_kaleidoZoom);
    color *= fade;
    
    return color;
}
