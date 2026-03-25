// Aurora Borealis - flowing curtains of light

vec3 auroraShader(vec2 st, float time) {
    vec2 p = st;
    float t = time * u_auroraSpeed;
    
    // Vertical stretch - aurora is tall
    p.y *= 0.6;
    p.x *= u_auroraScale;
    
    // Multiple curtain layers
    float aurora = 0.0;
    float curtainPhase = 0.0;
    
    for (float i = 0.0; i < 5.0; i++) {
        float freq = 1.5 + i * 0.8;
        float speed = 0.3 + i * 0.15;
        float amp = 0.4 / (i + 1.0);
        
        // Flowing wave for each curtain
        float wave = sin(p.x * freq + t * speed + i * 2.1) * amp;
        wave += sin(p.x * freq * 1.7 + t * speed * 0.6 + i * 3.7) * amp * 0.5;
        
        // Curtain shape: bright near a vertical band, fading out
        float curtain = exp(-pow((p.y - wave - 0.1 * i + 0.2) * (3.0 + u_auroraCurtain), 2.0));
        curtain *= smoothstep(-0.5, 0.5, p.y + 0.3); // Fade at bottom
        curtain *= smoothstep(1.5, 0.3, p.y); // Fade at top
        
        aurora += curtain;
        curtainPhase += curtain * (i * 0.15 + 0.1);
    }
    
    // Shimmer
    float shimmer = noise(vec2(p.x * 8.0 + t * 2.0, p.y * 4.0 + t)) * 0.3;
    aurora += shimmer * aurora;
    
    // Color: green core fading to purple/blue edges
    float hue = u_auroraHue + curtainPhase * 0.3 + p.y * 0.1;
    float sat = 0.7 + 0.3 * sin(curtainPhase * 6.28);
    float val = clamp(aurora * 1.2, 0.0, 1.0);
    
    vec3 color = hsv2rgb(vec3(hue, sat, val));
    
    // Add bright white core in strongest areas
    color += vec3(0.8, 0.95, 0.8) * pow(clamp(aurora, 0.0, 1.0), 4.0) * 0.5;
    
    // Add faint stars in dark areas
    float stars = pow(hash(floor(st * 80.0)), 20.0);
    color += vec3(stars) * (1.0 - clamp(aurora * 2.0, 0.0, 1.0)) * 0.6;
    
    return color;
}
