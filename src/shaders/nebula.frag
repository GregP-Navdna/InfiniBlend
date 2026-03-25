// Nebula - deep space gas clouds with embedded stars

vec3 nebulaShader(vec2 st, float time) {
    vec2 p = st * u_nebulaScale;
    float t = time * u_nebulaSpeed;
    
    // Warped coordinates for organic feel
    vec2 warp = vec2(
        fbm(p + vec2(t * 0.1, 0.0), 5.0),
        fbm(p + vec2(0.0, t * 0.13), 5.0)
    );
    
    vec2 warp2 = vec2(
        fbm(p + warp * 2.0 + vec2(1.7, 9.2) + t * 0.05, 5.0),
        fbm(p + warp * 2.0 + vec2(8.3, 2.8) + t * 0.07, 5.0)
    );
    
    // Gas density from layered warped noise
    float density = fbm(p + warp2 * u_nebulaDensity, 6.0);
    float density2 = fbm(p * 1.5 + warp * 1.5 + vec2(3.1, 7.4), 5.0);
    
    // Create filamentary structure
    float filaments = abs(density - 0.5) * 2.0;
    filaments = pow(1.0 - filaments, 3.0);
    
    // Color: mix of warm and cool nebula tones
    float hueBase = u_nebulaColor + density * 0.3 + warp2.x * 0.15;
    vec3 warmColor = hsv2rgb(vec3(hueBase, 0.8, 0.9));
    vec3 coolColor = hsv2rgb(vec3(hueBase + 0.5, 0.6, 0.7));
    vec3 gasColor = mix(coolColor, warmColor, density2);
    
    // Apply density
    vec3 color = gasColor * (density * 0.6 + filaments * 0.4);
    
    // Dark dust lanes
    float dust = smoothstep(0.3, 0.5, fbm(p * 3.0 + t * 0.02, 4.0));
    color *= 0.3 + 0.7 * dust;
    
    // Embedded stars
    for (float i = 0.0; i < 3.0; i++) {
        vec2 starGrid = p * (30.0 + i * 20.0);
        vec2 starCell = floor(starGrid);
        vec2 starFract = fract(starGrid) - 0.5;
        
        vec2 starOffset = hash2(starCell + i * 100.0) - 0.5;
        float starDist = length(starFract - starOffset * 0.5);
        
        float brightness = hash(starCell + i * 50.0);
        float starGlow = pow(max(0.0, 1.0 - starDist * 6.0), 4.0) * step(0.85, brightness);
        
        // Twinkling
        float twinkle = sin(t * 3.0 + brightness * 50.0) * 0.3 + 0.7;
        
        vec3 starColor = hsv2rgb(vec3(hash(starCell + i * 30.0), 0.2, 1.0));
        color += starColor * starGlow * twinkle;
    }
    
    // Soft glow around dense regions
    color += gasColor * pow(clamp(density, 0.0, 1.0), 3.0) * 0.3;
    
    return color;
}
