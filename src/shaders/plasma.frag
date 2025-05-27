// Classic sine-based plasma

vec3 plasmaShader(vec2 st, float time) {
    vec2 p = st * u_plasmaFreq;
    float t = time * u_plasmaSpeed;
    
    // Classic plasma pattern using multiple sine waves
    float v = 0.0;
    
    // Horizontal and vertical waves
    v += sin(p.x + t);
    v += sin(p.y + t * 0.7);
    
    // Diagonal waves
    v += sin((p.x + p.y) * 0.7 + t * 1.3);
    v += sin(sqrt(p.x * p.x + p.y * p.y) * 1.2 + t * 0.8);
    
    // Circular waves from center
    vec2 center1 = vec2(sin(t * 0.3), cos(t * 0.4)) * 2.0;
    v += sin(length(p - center1) * 2.0 - t * 1.5);
    
    vec2 center2 = vec2(cos(t * 0.2), sin(t * 0.3)) * 3.0;
    v += sin(length(p - center2) * 1.5 - t);
    
    // Normalize
    v = v / 6.0;
    
    // Create color palette
    float hue = v * 0.5 + 0.5 + u_colorShift + t * 0.02;
    vec3 color = hsv2rgb(vec3(hue, 0.8, 0.9));
    
    // Add some contrast
    color = pow(color, vec3(1.2));
    
    return color;
}
