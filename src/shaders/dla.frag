// Diffusion-limited aggregation growth simulation

float dlaPattern(vec2 p, float time) {
    float pattern = 0.0;
    float scale = 1.0;
    
    for (int i = 0; i < 4; i++) {
        vec2 q = p * scale;
        
        // Random walk simulation
        float n = noise(q + time * u_growthSpeed * 0.1);
        float angle = n * 6.28318;
        q += vec2(cos(angle), sin(angle)) * 0.1;
        
        // Check distance to cluster centers
        float d = 1000.0;
        for (int j = 0; j < 5; j++) {
            vec2 center = vec2(
                sin(float(j) * 2.0) * 1.5,
                cos(float(j) * 1.5) * 1.5
            ) * 2.0;
            
            // Grow over time
            float growth = sin(time * u_growthSpeed * 0.2 + float(j)) * 0.5 + 0.5;
            d = min(d, length(q - center) - growth * 0.3);
        }
        
        pattern += (1.0 - smoothstep(0.0, 0.1, d)) * u_stickProb / scale;
        scale *= 2.2;
    }
    
    return pattern;
}

vec3 dlaShader(vec2 st, float time) {
    vec2 p = st * 5.0;
    
    float pattern = dlaPattern(p, time);
    
    // Add spawning particles
    float particles = 0.0;
    for (int i = 0; i < 20; i++) {
        float t = time * u_spawnRate + float(i) * 0.3;
        vec2 pos = vec2(
            sin(t * 1.3 + float(i)) * 2.0,
            cos(t * 0.7 + float(i) * 1.1) * 2.0
        );
        float d = length(p - pos);
        particles += exp(-d * 5.0) * (sin(t * 10.0) * 0.5 + 0.5);
    }
    
    // Combine patterns
    float finalPattern = pattern + particles * 0.5;
    
    // Color based on pattern density
    vec3 color = vec3(0.1, 0.2, 0.4) * finalPattern;
    color += vec3(0.0, 0.3, 0.6) * particles;
    color = pow(color, vec3(0.8));
    
    return color;
}
