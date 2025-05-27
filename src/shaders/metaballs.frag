// Distance-field metaballs

// Metaball distance function
float metaballField(vec2 p, vec2 center, float radius) {
    float dist = length(p - center);
    return radius / (dist * dist + 0.001);
}

vec3 metaballsShader(vec2 st, float time) {
    float field = 0.0;
    vec2 p = st * 2.0;
    
    // Create moving metaballs
    for (float i = 0.0; i < 8.0; i++) {
        if (i >= u_ballCount) break;
        
        float phase = i * 1.618 + time * u_metaSpeed;
        vec2 center = vec2(
            sin(phase * 0.7) * 1.5,
            cos(phase * 0.5) * 1.5
        );
        
        field += metaballField(p, center, u_metaRadius);
    }
    
    // Threshold the field for blob effect
    float shape = smoothstep(u_metaThreshold - 0.1, u_metaThreshold + 0.1, field);
    
    // Create colorful gradient
    vec3 color1 = vec3(0.9, 0.3, 0.4);
    vec3 color2 = vec3(0.3, 0.7, 0.9);
    vec3 color3 = vec3(0.5, 0.9, 0.3);
    
    // Mix colors based on field strength
    float colorMix = field * 0.5 + time * 0.1;
    vec3 color = mix(color1, color2, sin(colorMix) * 0.5 + 0.5);
    color = mix(color, color3, cos(colorMix * 1.3) * 0.5 + 0.5);
    
    return color * shape;
}
