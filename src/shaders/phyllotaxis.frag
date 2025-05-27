// Phyllotactic spiral particles

vec3 phyllotaxisShader(vec2 st, float time) {
    vec2 p = st * 5.0;
    float rotation = time * u_rotateSpeed;
    
    // Golden angle in radians
    float goldenAngle = 2.39996323; // 137.5 degrees
    float brightness = 0.0;
    
    vec3 color = vec3(0.0);
    
    // Generate phyllotactic pattern
    for (float i = 0.0; i < 500.0; i++) {
        if (i >= u_pointCount) break;
        
        // Calculate position using golden angle
        float angle = i * goldenAngle + rotation;
        float radius = sqrt(i) * u_spiralScale * 0.1;
        
        vec2 pos = vec2(cos(angle), sin(angle)) * radius;
        
        // Distance from current pixel
        float dist = length(p - pos);
        
        // Point size decreases with index
        float pointSize = 0.05 / (1.0 + i * 0.002);
        float point = 1.0 - smoothstep(0.0, pointSize, dist);
        
        // Color based on index and time
        float hue = i * 0.002 + time * 0.02;
        vec3 pointColor = hsv2rgb(vec3(hue, 0.7, 0.9));
        
        // Accumulate color
        color += pointColor * point;
    }
    
    // Add subtle background gradient
    float bgGradient = length(p) * 0.05;
    vec3 bgColor = hsv2rgb(vec3(bgGradient + time * 0.01, 0.1, 0.1));
    
    return color + bgColor * 0.2;
}
