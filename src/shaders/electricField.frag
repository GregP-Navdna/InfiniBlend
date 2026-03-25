// Electric Field - animated field lines between charges

vec3 electricFieldShader(vec2 st, float time) {
    vec2 p = st;
    float t = time * u_fieldSpeed;
    
    float numCharges = u_fieldCharges;
    float strength = u_fieldStrength;
    
    // Calculate electric potential, field, and glow inline per charge
    float potential = 0.0;
    vec2 field = vec2(0.0);
    vec3 chargeGlow = vec3(0.0);
    
    vec3 posColor = vec3(0.2, 0.5, 1.0);
    vec3 negColor = vec3(1.0, 0.3, 0.2);
    
    for (int i = 0; i < 8; i++) {
        float fi = float(i);
        if (fi >= numCharges) break;
        
        // Compute charge position inline
        float baseAngle = fi * 6.283 / numCharges + t * 0.2;
        float radius = 0.4 + 0.15 * sin(t * 0.5 + fi * 1.7);
        vec2 chargePos = vec2(cos(baseAngle), sin(baseAngle)) * radius;
        float sign = mod(fi, 2.0) < 0.5 ? 1.0 : -1.0;
        
        vec2 diff = p - chargePos;
        float dist = length(diff) + 0.01;
        
        potential += sign * strength / dist;
        field += sign * strength * diff / (dist * dist * dist);
        
        // Charge glow
        float glow = 0.01 / (dist * dist + 0.01);
        vec3 cColor = sign > 0.0 ? posColor : negColor;
        chargeGlow += cColor * glow * 0.2;
        
        // Pulsing halo
        float halo = abs(sin(dist * 30.0 - t * 5.0)) * exp(-dist * 8.0);
        chargeGlow += cColor * halo * 0.15;
    }
    
    // Field lines visualization using potential
    float fieldLines = sin(potential * 10.0) * 0.5 + 0.5;
    fieldLines = pow(fieldLines, 0.3);
    
    // Equipotential lines
    float equipotential = abs(fract(potential * 2.0) - 0.5) * 2.0;
    equipotential = smoothstep(0.0, 0.1, equipotential);
    
    // Animated energy flow along field lines
    float flowPhase = potential * 5.0 - t * 3.0;
    float energyFlow = sin(flowPhase) * 0.5 + 0.5;
    energyFlow = pow(energyFlow, 2.0);
    
    // Color based on potential sign
    float potentialSign = smoothstep(-1.0, 1.0, potential * 0.5);
    vec3 baseColor = mix(negColor, posColor, potentialSign);
    
    // Combine
    vec3 color = baseColor * fieldLines * 0.6;
    color += baseColor * energyFlow * 0.3;
    color *= 0.5 + 0.5 * equipotential;
    color += chargeGlow;
    
    return clamp(color, 0.0, 1.0);
}
