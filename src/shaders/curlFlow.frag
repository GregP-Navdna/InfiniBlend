// Curl-noise flow field with drifting dye

// Simplified 3D noise for curl computation
float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float n = i.x + i.y * 57.0 + 113.0 * i.z;
    
    return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                   mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
               mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                   mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
}

// Compute curl of noise field
vec2 curlNoise(vec2 p, float t) {
    float eps = 0.01;
    
    // Sample noise at neighboring points
    float n1 = noise3D(vec3(p.x - eps, p.y, t));
    float n2 = noise3D(vec3(p.x + eps, p.y, t));
    float n3 = noise3D(vec3(p.x, p.y - eps, t));
    float n4 = noise3D(vec3(p.x, p.y + eps, t));
    
    // Compute partial derivatives
    float dx = (n2 - n1) / (2.0 * eps);
    float dy = (n4 - n3) / (2.0 * eps);
    
    // Return curl (perpendicular to gradient)
    return vec2(-dy, dx) * u_turbulence;
}

vec3 curlFlowShader(vec2 st, float time) {
    vec2 p = st * u_flowScale;
    
    // Advect multiple particles
    vec3 color = vec3(0.0);
    
    for (int i = 0; i < 5; i++) {
        float offset = float(i) * 0.1;
        vec2 pos = p + vec2(sin(offset * 6.28), cos(offset * 6.28)) * 0.5;
        
        // Advect along curl field
        for (int j = 0; j < 10; j++) {
            vec2 curl = curlNoise(pos, time * 0.1);
            pos += curl * u_advectSpeed * 0.1;
        }
        
        // Create color based on final position
        float hue = length(pos) * 0.1 + time * 0.05 + offset;
        vec3 particleColor = hsv2rgb(vec3(hue, 0.8, 0.9));
        
        // Accumulate with distance falloff
        float dist = length(pos - p);
        color += particleColor * exp(-dist * 2.0);
    }
    
    return color * 0.3;
}
