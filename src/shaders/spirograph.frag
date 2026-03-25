// Spirograph - animated hypotrochoid / epitrochoid patterns

vec3 spirographShader(vec2 st, float time) {
    vec2 p = st;
    float t = time * u_spiroSpeed;
    
    float R = u_spiroR1;
    float r = u_spiroR2;
    float d = u_spiroD;
    
    // Accumulate glow from multiple spirograph arms
    vec3 color = vec3(0.0);
    float totalGlow = 0.0;
    
    // Draw multiple spirograph curves at different phases
    for (float arm = 0.0; arm < 3.0; arm++) {
        float armPhase = arm * 2.094 + t * 0.1; // 120 degrees apart
        
        // Trace along the curve and accumulate distance-based glow
        float minDist = 100.0;
        float closestT = 0.0;
        
        for (float i = 0.0; i < 200.0; i++) {
            float theta = i * 0.0628 + t * 0.5 + armPhase; // ~200 samples over 4*PI
            
            // Hypotrochoid: x = (R-r)*cos(t) + d*cos((R-r)/r * t)
            // y = (R-r)*sin(t) - d*sin((R-r)/r * t)
            float ratio = (R - r) / max(r, 0.01);
            vec2 curvePoint = vec2(
                (R - r) * cos(theta) + d * cos(ratio * theta),
                (R - r) * sin(theta) - d * sin(ratio * theta)
            ) * 0.3;
            
            float dist = length(p - curvePoint);
            if (dist < minDist) {
                minDist = dist;
                closestT = theta;
            }
        }
        
        // Glowing line
        float glow = 0.005 / (minDist * minDist + 0.005);
        glow = clamp(glow, 0.0, 2.0);
        
        // Color varies along the curve
        float hue = closestT * 0.05 + arm * 0.33 + t * 0.02;
        vec3 armColor = hsv2rgb(vec3(hue, 0.8, 1.0));
        
        color += armColor * glow * 0.3;
        totalGlow += glow;
    }
    
    // Add subtle background pattern
    float bgPattern = sin(length(p) * 20.0 - t * 2.0) * 0.02;
    color += vec3(bgPattern) * (1.0 - clamp(totalGlow * 0.5, 0.0, 1.0));
    
    // Bloom effect
    color += color * color * 0.5;
    
    return clamp(color, 0.0, 1.0);
}
