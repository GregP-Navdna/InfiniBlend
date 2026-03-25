// Lissajous - glowing animated Lissajous curve patterns

vec3 lissajousShader(vec2 st, float time) {
    vec2 p = st;
    float t = time * u_lissajousSpeed;
    
    float a = u_lissajousA;
    float b = u_lissajousB;
    float delta = u_lissajousDelta + t * 0.2;
    
    vec3 color = vec3(0.0);
    
    // Multiple phase-shifted Lissajous curves
    for (float curve = 0.0; curve < 4.0; curve++) {
        float curvePhase = curve * 0.785 + t * 0.05; // 45 degrees apart
        float curveA = a + sin(t * 0.1 + curve) * 0.5;
        float curveB = b + cos(t * 0.13 + curve) * 0.5;
        
        float minDist = 100.0;
        float closestParam = 0.0;
        
        // Trace the curve
        for (float i = 0.0; i < 150.0; i++) {
            float theta = i * 0.042 + curvePhase; // ~150 samples over 2*PI
            
            vec2 curvePoint = vec2(
                sin(curveA * theta + delta) * 0.7,
                sin(curveB * theta) * 0.7
            );
            
            float dist = length(p - curvePoint);
            if (dist < minDist) {
                minDist = dist;
                closestParam = theta;
            }
        }
        
        // Glowing trail
        float glow = 0.003 / (minDist * minDist + 0.003);
        glow = clamp(glow, 0.0, 3.0);
        
        // Trail fade: brighter near the "drawing head"
        float headPos = mod(t * 2.0 + curvePhase, 6.283);
        float trailDist = abs(mod(closestParam - headPos + 3.14159, 6.283) - 3.14159);
        float trail = exp(-trailDist * 0.3) * 0.7 + 0.3;
        
        // Color per curve
        float hue = curve * 0.25 + closestParam * 0.03 + t * 0.01;
        vec3 curveColor = hsv2rgb(vec3(hue, 0.7, 1.0));
        
        color += curveColor * glow * trail * 0.25;
    }
    
    // Central glow
    float centerGlow = 0.02 / (dot(p, p) + 0.02);
    color += vec3(0.1, 0.05, 0.15) * centerGlow;
    
    // Bloom
    color += color * color * 0.3;
    
    return clamp(color, 0.0, 1.0);
}
