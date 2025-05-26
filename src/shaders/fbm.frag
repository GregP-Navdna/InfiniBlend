// FBM (Fractal Brownian Motion) shader

vec3 fbmShader(vec2 st, float time) {
    vec2 p = st * u_fbmScale;
    
    // Animate position
    p += vec2(sin(time * u_fbmSpeed * 0.1), cos(time * u_fbmSpeed * 0.13)) * 0.5;
    
    // Multi-octave noise
    float n1 = fbm(p, u_fbmOctaves);
    float n2 = fbm(p * 1.5 + vec2(5.2, 1.3), u_fbmOctaves);
    float n3 = fbm(p * 2.0 + vec2(8.3, 2.8), u_fbmOctaves);
    
    // Create color based on noise layers
    vec3 color;
    
    // Base hue from first noise layer
    float hue = n1 + u_fbmHueShift + time * u_fbmSpeed * 0.05;
    
    // Saturation from second noise layer
    float saturation = 0.5 + 0.5 * n2;
    
    // Value from third noise layer
    float value = 0.4 + 0.6 * n3;
    
    // Convert HSV to RGB
    color = hsv2rgb(vec3(hue, saturation, value));
    
    // Add some contrast
    color = pow(color, vec3(1.2));
    
    return color;
}
