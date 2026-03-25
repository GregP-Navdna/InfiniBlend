// Galaxy - spiral galaxy formation with arms, dust, and stars

vec3 galaxyShader(vec2 st, float time) {
    vec2 p = st;
    float t = time * u_galaxySpin;
    
    // Convert to polar
    float radius = length(p);
    float angle = atan(p.y, p.x);
    
    // Spiral arm function
    float arms = u_galaxyArms;
    float twist = u_galaxyTwist;
    
    // Logarithmic spiral: angle = twist * ln(radius)
    float spiralAngle = angle - twist * log(radius + 0.1) + t;
    
    // Create spiral arm pattern
    float armPattern = 0.0;
    for (float i = 0.0; i < 4.0; i++) {
        if (i >= arms) break;
        float armAngle = spiralAngle + i * 6.283 / arms;
        float arm = cos(armAngle * arms * 0.5) * 0.5 + 0.5;
        arm = pow(arm, 3.0);
        armPattern += arm;
    }
    armPattern = clamp(armPattern, 0.0, 1.0);
    
    // Radial falloff - galaxy brightness profile
    float diskProfile = exp(-radius * 2.5) * 1.5;
    float bulge = exp(-radius * radius * 15.0); // Central bulge
    
    // Add noise to arms for clumpiness
    float armNoise = fbm(vec2(spiralAngle * 2.0, radius * 5.0) + t * 0.1, 4.0);
    armPattern *= 0.5 + 0.5 * armNoise;
    
    // Dust lanes - dark areas between arms
    float dust = fbm(vec2(angle * 3.0, radius * 8.0 - t * 0.05), 3.0);
    float dustLane = smoothstep(0.3, 0.6, dust) * (1.0 - bulge);
    
    // Stars - field stars with varying brightness
    float starField = 0.0;
    for (float i = 0.0; i < 3.0; i++) {
        if (i >= u_galaxyStars) break;
        vec2 starGrid = p * (50.0 + i * 40.0);
        vec2 starCell = floor(starGrid);
        vec2 starFrac = fract(starGrid) - 0.5;
        
        vec2 starPos = hash2(starCell + i * 100.0) - 0.5;
        float starDist = length(starFrac - starPos * 0.4);
        
        float brightness = hash(starCell + i * 77.0);
        // Stars more likely in arms
        float inArm = armPattern * diskProfile;
        float starProb = 0.92 - inArm * 0.15;
        
        float star = pow(max(0.0, 1.0 - starDist * 8.0), 6.0) * step(starProb, brightness);
        
        // Twinkling
        star *= 0.7 + 0.3 * sin(t * 5.0 + brightness * 100.0);
        starField += star;
    }
    
    // Color composition
    // Arms: blue-white star forming regions
    vec3 armColor = vec3(0.6, 0.7, 1.0) * armPattern * diskProfile;
    
    // Bulge: warm yellow-orange
    vec3 bulgeColor = vec3(1.0, 0.85, 0.5) * bulge;
    
    // Disk: general warm glow
    vec3 diskColor = vec3(0.8, 0.7, 0.5) * diskProfile * 0.3;
    
    // Combine
    vec3 color = diskColor + armColor + bulgeColor;
    
    // Apply dust
    color *= 1.0 - dustLane * 0.6;
    
    // Add stars
    vec3 starColor = vec3(1.0, 0.95, 0.9);
    color += starColor * starField;
    
    // H-II regions (pink nebulae in arms)
    float hii = pow(armPattern * armNoise, 2.0) * diskProfile;
    color += vec3(1.0, 0.3, 0.4) * hii * 0.3;
    
    return clamp(color, 0.0, 1.0);
}
