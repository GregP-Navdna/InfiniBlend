// Warp - hypnotic space warp tunnel effect

vec3 warpShader(vec2 st, float time) {
    vec2 p = st;
    float t = time * u_warpSpeed;
    
    // Convert to polar
    float radius = length(p);
    float angle = atan(p.y, p.x);
    
    // Warp the radius for tunnel depth effect
    float depth = u_warpZoom / (radius + 0.1);
    
    // Twist increases with depth
    float twist = angle + depth * u_warpTwist + t * 0.5;
    
    // Create tunnel coordinates
    vec2 tunnelUV = vec2(twist / 3.14159, depth - t * 2.0);
    
    // Layered tunnel patterns
    float pattern = 0.0;
    
    // Ring pattern
    float rings = sin(depth * u_warpRings - t * 3.0) * 0.5 + 0.5;
    rings = pow(rings, 2.0);
    pattern += rings * 0.4;
    
    // Spiral pattern
    float spiral = sin(twist * 3.0 + depth * 2.0 - t * 4.0) * 0.5 + 0.5;
    pattern += spiral * 0.3;
    
    // Noise texture on the tunnel walls
    float wallNoise = fbm(tunnelUV * 3.0, 4.0);
    pattern += wallNoise * 0.3;
    
    // Energy streaks
    float streaks = 0.0;
    for (float i = 0.0; i < 6.0; i++) {
        float streakAngle = i * 1.047 + t * 0.3; // 60 degrees apart
        float streakDist = abs(sin(angle - streakAngle) * radius);
        streaks += 0.01 / (streakDist + 0.01) * smoothstep(0.5, 0.0, radius);
    }
    
    // Color based on depth and angle
    float hue = twist * 0.1 + depth * 0.05 + t * 0.03;
    float sat = 0.6 + 0.4 * pattern;
    float val = pattern * 0.8;
    
    vec3 color = hsv2rgb(vec3(hue, sat, val));
    
    // Add energy streaks in contrasting color
    vec3 streakColor = hsv2rgb(vec3(hue + 0.5, 0.9, 1.0));
    color += streakColor * streaks * 0.15;
    
    // Bright center
    float centerBright = 0.05 / (radius * radius + 0.05);
    color += vec3(0.8, 0.9, 1.0) * centerBright * 0.3;
    
    // Depth fog - darken edges
    float fog = smoothstep(0.0, 0.3, radius);
    color *= 1.0 - fog * 0.5;
    
    return color;
}
