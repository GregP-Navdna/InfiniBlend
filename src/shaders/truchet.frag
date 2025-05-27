// Truchet tile patterns

float truchetPattern(vec2 p, float rotation) {
    // Rotate the coordinate
    float c = cos(rotation);
    float s = sin(rotation);
    p = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
    
    // Create arc pattern
    float d1 = length(p - vec2(-0.5, -0.5)) - 0.5;
    float d2 = length(p - vec2(0.5, 0.5)) - 0.5;
    
    return min(abs(d1), abs(d2));
}

vec3 truchetShader(vec2 st, float time) {
    vec2 p = st * u_tileScale;
    vec2 cell = floor(p);
    vec2 f = fract(p) - 0.5;
    
    // Get rotation for this cell
    float rotation = hash(dot(cell, vec2(12.9898, 78.233)) + u_rotationSeed) * 3.14159 * 0.5;
    rotation = floor(rotation / (3.14159 * 0.5)) * (3.14159 * 0.5); // Quantize to 90 degrees
    
    // Calculate pattern
    float d = truchetPattern(f, rotation);
    
    // Create lines with width
    float line = 1.0 - smoothstep(u_lineWidth - 0.01, u_lineWidth + 0.01, abs(d));
    
    // Animated color gradient
    float colorPhase = length(cell) * 0.1 + time * 0.1;
    vec3 color1 = hsv2rgb(vec3(colorPhase, 0.8, 0.9));
    vec3 color2 = hsv2rgb(vec3(colorPhase + 0.3, 0.7, 0.8));
    
    // Background pattern
    float bg = noise(p * 0.5 + time * 0.05) * 0.2 + 0.1;
    vec3 bgColor = vec3(bg) * color2 * 0.3;
    
    return mix(bgColor, color1, line);
}
