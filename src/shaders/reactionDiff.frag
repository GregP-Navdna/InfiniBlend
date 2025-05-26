// Reaction-Diffusion (Gray-Scott model) shader

vec3 reactionDiffShader(vec2 st, float time) {
    vec2 p = st * u_reactionScale;
    
    // Simulate reaction-diffusion pattern
    float t = time * u_reactionSpeed;
    
    // Create initial seed points
    float seeds = 0.0;
    for(float i = 0.0; i < 5.0; i++) {
        vec2 seedPos = hash2(vec2(i, i * 1.3)) * 2.0 - 1.0;
        seedPos = vec2(
            sin(t * 0.3 + i * 2.1) * 0.5,
            cos(t * 0.4 + i * 1.7) * 0.5
        );
        float d = length(p - seedPos);
        seeds += exp(-d * 5.0);
    }
    
    // Create the reaction-diffusion pattern
    float n1 = noise(p * 10.0 + vec2(t * 0.1));
    float n2 = noise(p * 20.0 - vec2(t * 0.15));
    
    // Combine noise with seeds
    float pattern = seeds * 0.5 + n1 * n2;
    
    // Apply feed and kill rates to simulate the chemical reaction
    float feedInfluence = u_reactionFeed * 10.0;
    float killInfluence = u_reactionKill * 10.0;
    
    pattern = smoothstep(killInfluence * 0.1, feedInfluence, pattern);
    
    // Create organic-looking structures
    float structure = 0.0;
    for(float scale = 1.0; scale < 8.0; scale *= 2.0) {
        float weight = 1.0 / scale;
        vec2 sp = p * scale + vec2(t * 0.02 * weight);
        structure += weight * (sin(sp.x * 10.0) * sin(sp.y * 10.0) + 1.0) * 0.5;
    }
    
    pattern = mix(pattern, structure * 0.5, 0.3);
    
    // Color mapping
    vec3 color1 = vec3(0.1, 0.1, 0.3);  // Dark blue
    vec3 color2 = vec3(0.9, 0.6, 0.1);  // Orange
    vec3 color3 = vec3(1.0, 0.9, 0.8);  // Light
    
    vec3 color;
    if(pattern < 0.5) {
        color = mix(color1, color2, pattern * 2.0);
    } else {
        color = mix(color2, color3, (pattern - 0.5) * 2.0);
    }
    
    // Add some variation
    color += 0.1 * vec3(n1, n2, n1 * n2);
    
    return color;
}
