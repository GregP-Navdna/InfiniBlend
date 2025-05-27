// Moiré interference patterns

// Create line pattern
float linePattern(vec2 p, float angle, float freq) {
    float c = cos(angle);
    float s = sin(angle);
    vec2 rot = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
    return sin(rot.x * freq) * 0.5 + 0.5;
}

vec3 moireShader(vec2 st, float time) {
    vec2 p = st * 10.0;
    float t = time * u_waveSpeed;
    
    // Create multiple overlapping patterns
    float pattern1 = linePattern(p, 0.0, u_lineDensity);
    float pattern2 = linePattern(p, u_angleOffset + sin(t * 0.1) * 0.2, u_lineDensity * 1.1);
    float pattern3 = linePattern(p, -u_angleOffset + cos(t * 0.15) * 0.1, u_lineDensity * 0.9);
    
    // Circular pattern
    float radial = sin(length(p - vec2(5.0)) * u_lineDensity * 0.5 + t) * 0.5 + 0.5;
    
    // Combine patterns for moiré effect
    float moire = pattern1 * pattern2;
    moire *= pattern3;
    moire *= radial;
    
    // Create interference colors
    vec3 color1 = vec3(0.1, 0.3, 0.9);
    vec3 color2 = vec3(0.9, 0.1, 0.7);
    vec3 color3 = vec3(0.3, 0.9, 0.4);
    
    // Mix colors based on pattern intensity
    vec3 color = mix(color1, color2, moire);
    color = mix(color, color3, radial * pattern1);
    
    // Add some brightness variation
    float brightness = 0.5 + 0.5 * sin(moire * 20.0 + t * 2.0);
    color *= brightness;
    
    return color;
}
