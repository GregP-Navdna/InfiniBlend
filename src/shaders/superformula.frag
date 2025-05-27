// Animated superformula shapes

// Superformula implementation
float superformula(float theta, float m, float n1, float n2, float n3) {
    float a = 1.0, b = 1.0;
    float t1 = abs(cos(m * theta / 4.0) / a);
    float t2 = abs(sin(m * theta / 4.0) / b);
    float r = pow(pow(t1, n2) + pow(t2, n3), -1.0 / n1);
    return r;
}

vec3 superformulaShader(vec2 st, float time) {
    vec2 p = st * 3.0;
    float angle = atan(p.y, p.x);
    float radius = length(p);
    
    // Animate parameters
    float m = u_superM + sin(time * 0.2) * 2.0;
    float n1 = u_superN1 + cos(time * 0.15) * 0.5;
    float n2 = u_superN2 + sin(time * 0.1) * 0.3;
    float n3 = u_superN3 + cos(time * 0.12) * 0.3;
    
    // Calculate two superformula shapes
    float r1 = superformula(angle, m, n1, n2, n3);
    float r2 = superformula(angle + 3.14159, m * 0.5, n1 * 1.2, n2 * 0.8, n3 * 1.1);
    
    // Mix between shapes
    float r = mix(r1, r2, u_shapeMix);
    
    // Create distance field
    float dist = radius - r * 0.5;
    float shape = 1.0 - smoothstep(-0.02, 0.02, dist);
    
    // Radial gradient coloring
    vec3 color1 = hsv2rgb(vec3(angle / 6.28 + time * 0.05, 0.7, 0.9));
    vec3 color2 = hsv2rgb(vec3(radius * 0.3 + time * 0.03, 0.6, 0.8));
    vec3 color = mix(color1, color2, radius * 0.5);
    
    // Add glow effect
    float glow = exp(-abs(dist) * 5.0) * 0.5;
    color += vec3(glow) * vec3(0.5, 0.7, 1.0);
    
    return color * (shape + glow * 0.5);
}
