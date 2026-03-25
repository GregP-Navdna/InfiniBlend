// Stained Glass - luminous stained glass window patterns

vec3 stainedGlassShader(vec2 st, float time) {
    // Warp the coordinate space for organic shapes
    vec2 p = st * u_glassScale;
    float t = time * 0.3;
    
    // Gentle warp animation
    vec2 warp = vec2(
        sin(p.y * 1.5 + t * 0.5) * u_glassWarp,
        cos(p.x * 1.3 + t * 0.4) * u_glassWarp
    );
    p += warp;
    
    // Voronoi cells for glass pieces
    vec2 cell = floor(p);
    vec2 frac = fract(p);
    
    float minDist = 10.0;
    float secondDist = 10.0;
    vec2 closestCell = vec2(0.0);
    
    for (int y = -2; y <= 2; y++) {
        for (int x = -2; x <= 2; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 cellId = cell + neighbor;
            vec2 point = hash2(cellId);
            
            // Slight animation of cell centers
            point = 0.5 + 0.45 * sin(t * 0.3 + 6.283 * point);
            
            float dist = length(neighbor + point - frac);
            
            if (dist < minDist) {
                secondDist = minDist;
                minDist = dist;
                closestCell = cellId;
            } else if (dist < secondDist) {
                secondDist = dist;
            }
        }
    }
    
    // Lead came (dark borders between glass pieces)
    float edge = secondDist - minDist;
    float bevel = smoothstep(0.0, u_glassBevel, edge);
    
    // Each cell gets a rich, saturated color
    float cellHash = hash(closestCell);
    float cellHash2 = hash(closestCell + vec2(37.0, 17.0));
    
    // Stained glass uses rich jewel tones
    float hue = u_glassHue + cellHash * 0.8;
    float sat = 0.7 + 0.3 * cellHash2;
    float val = 0.7 + 0.3 * cellHash;
    
    vec3 glassColor = hsv2rgb(vec3(hue, sat, val));
    
    // Light transmission varies - simulate light coming through
    float lightAngle = sin(t * 0.2) * 0.3;
    float lightDir = dot(normalize(vec2(cos(lightAngle), sin(lightAngle))), st);
    float lightIntensity = 0.7 + 0.3 * sin(lightDir * 2.0 + t * 0.5);
    
    // Internal texture of glass - subtle variations
    float glassTexture = noise(st * 20.0 + closestCell * 5.0) * 0.15;
    glassTexture += noise(st * 40.0 + closestCell * 10.0) * 0.08;
    
    // Compose
    vec3 color = glassColor * lightIntensity;
    color += glassTexture;
    
    // Apply lead came
    vec3 leadColor = vec3(0.05, 0.05, 0.06); // Dark lead
    color = mix(leadColor, color, bevel);
    
    // Subtle light refraction at edges
    float refraction = pow(1.0 - bevel, 2.0) * 0.3;
    color += vec3(0.3, 0.3, 0.35) * refraction;
    
    // Slight bloom on bright pieces
    color += glassColor * pow(clamp(val * lightIntensity, 0.0, 1.0), 4.0) * 0.15;
    
    return clamp(color, 0.0, 1.0);
}
