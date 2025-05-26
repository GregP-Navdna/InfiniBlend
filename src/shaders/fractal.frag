// Julia/Mandelbrot Fractal shader

vec3 fractalShader(vec2 st, float time) {
    vec2 p = st * u_fractalZoom + u_fractalOffset;
    
    // Animate Julia set parameter
    float t = time * 0.1;
    vec2 c = vec2(
        0.4 * cos(t) - 0.2 * sin(t * 0.7),
        0.4 * sin(t) + 0.2 * cos(t * 1.3)
    );
    
    // Julia set iteration
    vec2 z = p;
    float iter = 0.0;
    float maxIter = u_fractalIterations;
    
    for(float i = 0.0; i < 200.0; i++) {
        if(i >= maxIter) break;
        
        // z = z^2 + c
        z = vec2(
            z.x * z.x - z.y * z.y + c.x,
            2.0 * z.x * z.y + c.y
        );
        
        if(length(z) > 2.0) {
            iter = i;
            break;
        }
        
        iter = i;
    }
    
    // Smooth iteration count
    if(length(z) > 2.0) {
        float log_zn = log(length(z)) / 2.0;
        float nu = log(log_zn / log(2.0)) / log(2.0);
        iter = iter + 1.0 - nu;
    }
    
    // Calculate distance estimation for better edges
    float dist = length(z) * log(length(z)) / (iter + 1.0);
    
    // Color based on iteration count
    vec3 color;
    
    if(iter >= maxIter - 1.0) {
        // Inside the set - create interesting interior
        float angle = atan(z.y, z.x);
        float radius = length(z);
        
        float hue = angle / (2.0 * 3.14159) + 0.5;
        float saturation = 0.8;
        float value = 0.2 + 0.3 * sin(radius * 10.0);
        
        color = hsv2rgb(vec3(hue, saturation, value));
    } else {
        // Outside the set - smooth coloring
        float t = iter / maxIter;
        
        // Multi-hue gradient
        float hue = t * 3.0 + u_fractalColor + time * 0.02;
        float saturation = 0.7 + 0.3 * sin(t * 10.0);
        float value = 0.4 + 0.6 * pow(t, 0.5);
        
        color = hsv2rgb(vec3(hue, saturation, value));
        
        // Edge highlighting
        float edge = exp(-dist * 10.0);
        color = mix(color, vec3(1.0), edge * 0.3);
    }
    
    // Add some glow
    float glow = 1.0 / (1.0 + dist * dist * 50.0);
    color += vec3(0.1, 0.2, 0.4) * glow;
    
    return color;
}
