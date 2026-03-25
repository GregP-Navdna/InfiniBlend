// Caustics - underwater light caustic patterns

vec3 causticsShader(vec2 st, float time) {
    vec2 p = st * u_causticScale;
    float t = time * u_causticSpeed;
    
    // Multiple layers of caustic patterns
    float caustic = 0.0;
    
    for (float i = 0.0; i < 3.0; i++) {
        float scale = 1.0 + i * 0.5;
        float speed = 1.0 + i * 0.3;
        vec2 q = p * scale;
        
        // Animated distortion
        q += vec2(
            sin(t * speed * 0.3 + q.y * 0.7) * 0.3,
            cos(t * speed * 0.4 + q.x * 0.6) * 0.3
        );
        
        // Voronoi-based caustic pattern
        vec2 cell = floor(q);
        vec2 frac = fract(q);
        
        float minDist1 = 10.0;
        float minDist2 = 10.0;
        
        for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
                vec2 neighbor = vec2(float(x), float(y));
                vec2 point = hash2(cell + neighbor);
                
                // Animate points
                point = 0.5 + 0.5 * sin(t * speed * 0.5 + 6.283 * point);
                
                float dist = length(neighbor + point - frac);
                
                if (dist < minDist1) {
                    minDist2 = minDist1;
                    minDist1 = dist;
                } else if (dist < minDist2) {
                    minDist2 = dist;
                }
            }
        }
        
        // Edge detection creates caustic lines
        float edge = minDist2 - minDist1;
        float causticLine = pow(edge, 0.5) * 1.5;
        
        caustic += causticLine / (i + 1.0);
    }
    
    caustic /= 2.0;
    
    // Apply intensity
    caustic = pow(caustic, 1.5) * u_causticIntensity;
    
    // Color: deep blue water with bright caustic highlights
    vec3 deepWater = vec3(0.02, 0.05, 0.15);
    vec3 shallowWater = vec3(0.0, 0.2, 0.4);
    vec3 causticColor = vec3(0.4, 0.8, 0.9);
    
    // Base water color varies with noise
    float waterNoise = noise(p * 0.5 + t * 0.1);
    vec3 water = mix(deepWater, shallowWater, waterNoise * 0.5 + 0.3);
    
    // Add caustic highlights
    vec3 color = water + causticColor * caustic;
    
    // Add bright peaks
    color += vec3(1.0, 1.0, 0.9) * pow(clamp(caustic, 0.0, 1.0), 3.0) * 0.5;
    
    // Gentle surface ripple modulation
    float ripple = sin(p.x * 3.0 + t) * sin(p.y * 2.5 + t * 0.8) * 0.1;
    color += vec3(0.1, 0.2, 0.3) * ripple;
    
    return clamp(color, 0.0, 1.0);
}
