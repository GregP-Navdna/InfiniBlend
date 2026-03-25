export class ShaderComposer {
    constructor() {
        this.shaders = {};
        this.commonCode = '';
    }

    async loadShaders() {
        // Load common utilities first
        this.commonCode = await this.loadShaderFile('/src/shaders/common.glsl');
        
        // Load individual shader algorithms
        const shaderFiles = [
            'fbm.frag',
            'voronoi.frag',
            'reactionDiff.frag',
            'cellular.frag',
            'kaleido.frag',
            'fractal.frag',
            'curlFlow.frag',
            'metaballs.frag', 
            'superformula.frag',
            'truchet.frag',
            'plasma.frag',
            'moire.frag',
            'phyllotaxis.frag',
            'dla.frag',
            'mandelbrot.frag',
            'hexRelax.frag',
            'aurora.frag',
            'spirograph.frag',
            'nebula.frag',
            'lissajous.frag',
            'warp.frag',
            'caustics.frag',
            'galaxy.frag',
            'electricField.frag',
            'stainedGlass.frag',
            'topographic.frag'
        ];
        
        await Promise.all(shaderFiles.map(async (file) => {
            const name = file.split('.')[0];
            this.shaders[name] = await this.loadShaderFile(`/src/shaders/${file}`);
        }));
        
        console.log('Loaded shaders:', Object.keys(this.shaders));
    }

    async loadShaderFile(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to load ${path}`);
            return await response.text();
        } catch (error) {
            console.error(`Error loading shader ${path}:`, error);
            return '';
        }
    }

    getComposedShader() {
        // Check if shaders are loaded
        if (Object.keys(this.shaders).length === 0) {
            console.error('No shaders loaded!');
            return `
                void main() {
                    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // Magenta error color
                }
            `;
        }
        
        return `
            precision highp float;
            
            // Uniforms
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            
            // Shader enable toggles
            uniform float u_fbmEnabled;
            uniform float u_voronoiEnabled;
            uniform float u_reactionEnabled;
            uniform float u_cellularEnabled;
            uniform float u_kaleidoEnabled;
            uniform float u_fractalEnabled;
            uniform float u_curlFlowEnabled;
            uniform float u_metaballsEnabled;
            uniform float u_superformulaEnabled;
            uniform float u_truchetEnabled;
            uniform float u_plasmaEnabled;
            uniform float u_moireEnabled;
            uniform float u_phyllotaxisEnabled;
            uniform float u_dlaEnabled;
            uniform float u_mandelbrotEnabled;
            uniform float u_hexRelaxEnabled;
            uniform float u_auroraEnabled;
            uniform float u_spirographEnabled;
            uniform float u_nebulaEnabled;
            uniform float u_lissajousEnabled;
            uniform float u_warpEnabled;
            uniform float u_causticsEnabled;
            uniform float u_galaxyEnabled;
            uniform float u_electricFieldEnabled;
            uniform float u_stainedGlassEnabled;
            uniform float u_topographicEnabled;
            
            // Master blend weights
            uniform float u_fbmWeight;
            uniform float u_voronoiWeight;
            uniform float u_reactionWeight;
            uniform float u_cellularWeight;
            uniform float u_kaleidoWeight;
            uniform float u_fractalWeight;
            uniform float u_curlFlowWeight;
            uniform float u_metaballsWeight;
            uniform float u_superformulaWeight;
            uniform float u_truchetWeight;
            uniform float u_plasmaWeight;
            uniform float u_moireWeight;
            uniform float u_phyllotaxisWeight;
            uniform float u_dlaWeight;
            uniform float u_mandelbrotWeight;
            uniform float u_hexRelaxWeight;
            uniform float u_auroraWeight;
            uniform float u_spirographWeight;
            uniform float u_nebulaWeight;
            uniform float u_lissajousWeight;
            uniform float u_warpWeight;
            uniform float u_causticsWeight;
            uniform float u_galaxyWeight;
            uniform float u_electricFieldWeight;
            uniform float u_stainedGlassWeight;
            uniform float u_topographicWeight;
            
            // Blend mode uniforms for each algorithm
            uniform int u_fbmBlendMode;
            uniform int u_voronoiBlendMode;
            uniform int u_reactionBlendMode;
            uniform int u_cellularBlendMode;
            uniform int u_kaleidoBlendMode;
            uniform int u_fractalBlendMode;
            uniform int u_curlFlowBlendMode;
            uniform int u_metaballsBlendMode;
            uniform int u_superformulaBlendMode;
            uniform int u_truchetBlendMode;
            uniform int u_plasmaBlendMode;
            uniform int u_moireBlendMode;
            uniform int u_phyllotaxisBlendMode;
            uniform int u_dlaBlendMode;
            uniform int u_mandelbrotBlendMode;
            uniform int u_hexRelaxBlendMode;
            uniform int u_auroraBlendMode;
            uniform int u_spirographBlendMode;
            uniform int u_nebulaBlendMode;
            uniform int u_lissajousBlendMode;
            uniform int u_warpBlendMode;
            uniform int u_causticsBlendMode;
            uniform int u_galaxyBlendMode;
            uniform int u_electricFieldBlendMode;
            uniform int u_stainedGlassBlendMode;
            uniform int u_topographicBlendMode;
            
            // Algorithm-specific uniforms
            uniform float u_fbmScale;
            uniform float u_fbmSpeed;
            uniform float u_fbmOctaves;
            uniform float u_fbmHueShift;
            
            uniform float u_voronoiScale;
            uniform float u_voronoiSpeed;
            uniform float u_voronoiSmooth;
            uniform float u_voronoiColor;
            
            uniform float u_reactionFeed;
            uniform float u_reactionKill;
            uniform float u_reactionSpeed;
            uniform float u_reactionScale;
            
            uniform float u_cellularThreshold;
            uniform float u_cellularSpeed;
            uniform float u_cellularScale;
            uniform float u_cellularSmooth;
            
            uniform float u_kaleidoSegments;
            uniform float u_kaleidoRotation;
            uniform float u_kaleidoZoom;
            uniform float u_kaleidoOffset;
            
            uniform float u_fractalIterations;
            uniform float u_fractalZoom;
            uniform vec2 u_fractalOffset;
            uniform float u_fractalColor;
            
            // Curl Flow parameters
            uniform float u_flowScale;
            uniform float u_advectSpeed;
            uniform float u_turbulence;
            
            // Metaballs parameters
            uniform float u_ballCount;
            uniform float u_metaRadius;
            uniform float u_metaThreshold;
            uniform float u_metaSpeed;
            
            // Superformula parameters
            uniform float u_superM;
            uniform float u_superN1;
            uniform float u_superN2;
            uniform float u_superN3;
            uniform float u_shapeMix;
            
            // Truchet parameters
            uniform float u_tileScale;
            uniform float u_rotationSeed;
            uniform float u_lineWidth;
            
            // Plasma parameters
            uniform float u_plasmaFreq;
            uniform float u_plasmaSpeed;
            uniform float u_colorShift;
            
            // Moire parameters
            uniform float u_lineDensity;
            uniform float u_angleOffset;
            uniform float u_waveSpeed;
            
            // Phyllotaxis parameters
            uniform float u_pointCount;
            uniform float u_spiralScale;
            uniform float u_rotateSpeed;
            
            // DLA parameters
            uniform float u_spawnRate;
            uniform float u_stickProb;
            uniform float u_growthSpeed;
            
            // Mandelbrot parameters
            uniform float u_mandelbrotZoom;
            uniform vec2 u_mandelbrotCenter;
            uniform float u_maxIter;
            uniform float u_colorCycle;
            
            // Hex Relax parameters
            uniform float u_hexScale;
            uniform float u_relaxSteps;
            uniform float u_jitter;
            uniform float u_blendSharpness;
            
            // Aurora parameters
            uniform float u_auroraScale;
            uniform float u_auroraSpeed;
            uniform float u_auroraCurtain;
            uniform float u_auroraHue;
            
            // Spirograph parameters
            uniform float u_spiroR1;
            uniform float u_spiroR2;
            uniform float u_spiroD;
            uniform float u_spiroSpeed;
            
            // Nebula parameters
            uniform float u_nebulaScale;
            uniform float u_nebulaDensity;
            uniform float u_nebulaSpeed;
            uniform float u_nebulaColor;
            
            // Lissajous parameters
            uniform float u_lissajousA;
            uniform float u_lissajousB;
            uniform float u_lissajousDelta;
            uniform float u_lissajousSpeed;
            
            // Warp parameters
            uniform float u_warpSpeed;
            uniform float u_warpTwist;
            uniform float u_warpZoom;
            uniform float u_warpRings;
            
            // Caustics parameters
            uniform float u_causticScale;
            uniform float u_causticSpeed;
            uniform float u_causticIntensity;
            
            // Galaxy parameters
            uniform float u_galaxyArms;
            uniform float u_galaxyTwist;
            uniform float u_galaxySpin;
            uniform float u_galaxyStars;
            
            // Electric Field parameters
            uniform float u_fieldCharges;
            uniform float u_fieldStrength;
            uniform float u_fieldSpeed;
            
            // Stained Glass parameters
            uniform float u_glassScale;
            uniform float u_glassBevel;
            uniform float u_glassHue;
            uniform float u_glassWarp;
            
            // Topographic parameters
            uniform float u_topoScale;
            uniform float u_topoLevels;
            uniform float u_topoSpeed;
            uniform float u_topoThickness;
            
            // Global parameters
            uniform float u_timeScale;
            uniform float u_brightness;
            uniform float u_contrast;
            uniform float u_saturation;
            
            // Varying
            varying vec2 vUv;
            
            // Common utilities
            ${this.commonCode}
            
            // Individual shader algorithms
            ${this.shaders.fbm || ''}
            ${this.shaders.voronoi || ''}
            ${this.shaders.reactionDiff || ''}
            ${this.shaders.cellular || ''}
            ${this.shaders.kaleido || ''}
            ${this.shaders.fractal || ''}
            ${this.shaders.curlFlow || ''}
            ${this.shaders.metaballs || ''}
            ${this.shaders.superformula || ''}
            ${this.shaders.truchet || ''}
            ${this.shaders.plasma || ''}
            ${this.shaders.moire || ''}
            ${this.shaders.phyllotaxis || ''}
            ${this.shaders.dla || ''}
            ${this.shaders.mandelbrot || ''}
            ${this.shaders.hexRelax || ''}
            ${this.shaders.aurora || ''}
            ${this.shaders.spirograph || ''}
            ${this.shaders.nebula || ''}
            ${this.shaders.lissajous || ''}
            ${this.shaders.warp || ''}
            ${this.shaders.caustics || ''}
            ${this.shaders.galaxy || ''}
            ${this.shaders.electricField || ''}
            ${this.shaders.stainedGlass || ''}
            ${this.shaders.topographic || ''}
            
            // Blend mode functions
            vec3 blendNormal(vec3 base, vec3 blend, float weight) {
                return mix(base, blend, weight);
            }
            
            vec3 blendMultiply(vec3 base, vec3 blend, float weight) {
                return mix(base, base * blend, weight);
            }
            
            vec3 blendScreen(vec3 base, vec3 blend, float weight) {
                return mix(base, 1.0 - (1.0 - base) * (1.0 - blend), weight);
            }
            
            vec3 blendOverlay(vec3 base, vec3 blend, float weight) {
                vec3 result = vec3(
                    base.r < 0.5 ? 2.0 * base.r * blend.r : 1.0 - 2.0 * (1.0 - base.r) * (1.0 - blend.r),
                    base.g < 0.5 ? 2.0 * base.g * blend.g : 1.0 - 2.0 * (1.0 - base.g) * (1.0 - blend.g),
                    base.b < 0.5 ? 2.0 * base.b * blend.b : 1.0 - 2.0 * (1.0 - base.b) * (1.0 - blend.b)
                );
                return mix(base, result, weight);
            }
            
            vec3 blendSoftLight(vec3 base, vec3 blend, float weight) {
                vec3 result = vec3(
                    blend.r < 0.5 ? base.r * (2.0 * blend.r + base.r * (1.0 - 2.0 * blend.r)) : sqrt(base.r) * (2.0 * blend.r - 1.0) + base.r * (1.0 - blend.r),
                    blend.g < 0.5 ? base.g * (2.0 * blend.g + base.g * (1.0 - 2.0 * blend.g)) : sqrt(base.g) * (2.0 * blend.g - 1.0) + base.g * (1.0 - blend.g),
                    blend.b < 0.5 ? base.b * (2.0 * blend.b + base.b * (1.0 - 2.0 * blend.b)) : sqrt(base.b) * (2.0 * blend.b - 1.0) + base.b * (1.0 - blend.b)
                );
                return mix(base, result, weight);
            }
            
            vec3 blendHardLight(vec3 base, vec3 blend, float weight) {
                return blendOverlay(blend, base, weight);
            }
            
            vec3 blendColorDodge(vec3 base, vec3 blend, float weight) {
                vec3 result = base / (1.0 - blend);
                return mix(base, result, weight);
            }
            
            vec3 blendColorBurn(vec3 base, vec3 blend, float weight) {
                vec3 result = 1.0 - (1.0 - base) / blend;
                return mix(base, result, weight);
            }
            
            vec3 blendDifference(vec3 base, vec3 blend, float weight) {
                return mix(base, abs(base - blend), weight);
            }
            
            vec3 blendExclusion(vec3 base, vec3 blend, float weight) {
                return mix(base, base + blend - 2.0 * base * blend, weight);
            }
            
            vec3 blendLighten(vec3 base, vec3 blend, float weight) {
                return mix(base, max(base, blend), weight);
            }
            
            vec3 blendDarken(vec3 base, vec3 blend, float weight) {
                return mix(base, min(base, blend), weight);
            }
            
            vec3 blendLinearLight(vec3 base, vec3 blend, float weight) {
                vec3 result = 2.0 * blend + base - 1.0;
                return mix(base, result, weight);
            }
            
            vec3 blendVividLight(vec3 base, vec3 blend, float weight) {
                vec3 result = vec3(
                    blend.r < 0.5 ? 1.0 - (1.0 - base.r) / (2.0 * blend.r) : base.r / (2.0 * (1.0 - blend.r)),
                    blend.g < 0.5 ? 1.0 - (1.0 - base.g) / (2.0 * blend.g) : base.g / (2.0 * (1.0 - blend.g)),
                    blend.b < 0.5 ? 1.0 - (1.0 - base.b) / (2.0 * blend.b) : base.b / (2.0 * (1.0 - blend.b))
                );
                return mix(base, result, weight);
            }
            
            vec3 applyBlendMode(vec3 base, vec3 blend, float weight, int mode) {
                if (mode == 0) return blendNormal(base, blend, weight);
                else if (mode == 1) return blendMultiply(base, blend, weight);
                else if (mode == 2) return blendScreen(base, blend, weight);
                else if (mode == 3) return blendOverlay(base, blend, weight);
                else if (mode == 4) return blendSoftLight(base, blend, weight);
                else if (mode == 5) return blendHardLight(base, blend, weight);
                else if (mode == 6) return blendColorDodge(base, blend, weight);
                else if (mode == 7) return blendColorBurn(base, blend, weight);
                else if (mode == 8) return blendDifference(base, blend, weight);
                else if (mode == 9) return blendExclusion(base, blend, weight);
                else if (mode == 10) return blendLighten(base, blend, weight);
                else if (mode == 11) return blendDarken(base, blend, weight);
                else if (mode == 12) return blendLinearLight(base, blend, weight);
                else if (mode == 13) return blendVividLight(base, blend, weight);
                else return blendNormal(base, blend, weight);
            }
            
            // Color adjustment functions
            vec3 adjustBrightness(vec3 color, float brightness) {
                return color * brightness;
            }
            
            vec3 adjustContrast(vec3 color, float contrast) {
                return (color - 0.5) * contrast + 0.5;
            }
            
            vec3 adjustSaturation(vec3 color, float saturation) {
                float gray = dot(color, vec3(0.299, 0.587, 0.114));
                return mix(vec3(gray), color, saturation);
            }
            
            void main() {
                vec2 uv = vUv;
                vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
                float time = u_time * u_timeScale;
                
                // Calculate individual shader contributions only if enabled
                vec3 fbmColor = u_fbmEnabled > 0.5 ? fbmShader(st, time) : vec3(0.0);
                vec3 voronoiColor = u_voronoiEnabled > 0.5 ? voronoiShader(st, time) : vec3(0.0);
                vec3 reactionColor = u_reactionEnabled > 0.5 ? reactionDiffShader(st, time) : vec3(0.0);
                vec3 cellularColor = u_cellularEnabled > 0.5 ? cellularShader(st, time) : vec3(0.0);
                vec3 kaleidoColor = u_kaleidoEnabled > 0.5 ? kaleidoShader(st, time) : vec3(0.0);
                vec3 fractalColor = u_fractalEnabled > 0.5 ? fractalShader(st, time) : vec3(0.0);
                vec3 curlFlowColor = u_curlFlowEnabled > 0.5 ? curlFlowShader(st, time) : vec3(0.0);
                vec3 metaballsColor = u_metaballsEnabled > 0.5 ? metaballsShader(st, time) : vec3(0.0);
                vec3 superformulaColor = u_superformulaEnabled > 0.5 ? superformulaShader(st, time) : vec3(0.0);
                vec3 truchetColor = u_truchetEnabled > 0.5 ? truchetShader(st, time) : vec3(0.0);
                vec3 plasmaColor = u_plasmaEnabled > 0.5 ? plasmaShader(st, time) : vec3(0.0);
                vec3 moireColor = u_moireEnabled > 0.5 ? moireShader(st, time) : vec3(0.0);
                vec3 phyllotaxisColor = u_phyllotaxisEnabled > 0.5 ? phyllotaxisShader(st, time) : vec3(0.0);
                vec3 dlaColor = u_dlaEnabled > 0.5 ? dlaShader(st, time) : vec3(0.0);
                vec3 mandelbrotColor = u_mandelbrotEnabled > 0.5 ? mandelbrotShader(st, time) : vec3(0.0);
                vec3 hexRelaxColor = u_hexRelaxEnabled > 0.5 ? hexRelaxShader(st, time) : vec3(0.0);
                vec3 auroraColor = u_auroraEnabled > 0.5 ? auroraShader(st, time) : vec3(0.0);
                vec3 spirographColor = u_spirographEnabled > 0.5 ? spirographShader(st, time) : vec3(0.0);
                vec3 nebulaColor = u_nebulaEnabled > 0.5 ? nebulaShader(st, time) : vec3(0.0);
                vec3 lissajousColor = u_lissajousEnabled > 0.5 ? lissajousShader(st, time) : vec3(0.0);
                vec3 warpColor = u_warpEnabled > 0.5 ? warpShader(st, time) : vec3(0.0);
                vec3 causticsColor = u_causticsEnabled > 0.5 ? causticsShader(st, time) : vec3(0.0);
                vec3 galaxyColor = u_galaxyEnabled > 0.5 ? galaxyShader(st, time) : vec3(0.0);
                vec3 electricFieldColor = u_electricFieldEnabled > 0.5 ? electricFieldShader(st, time) : vec3(0.0);
                vec3 stainedGlassColor = u_stainedGlassEnabled > 0.5 ? stainedGlassShader(st, time) : vec3(0.0);
                vec3 topographicColor = u_topographicEnabled > 0.5 ? topographicShader(st, time) : vec3(0.0);
                
                // DEBUG: Add a test pattern to see if shader is running
                vec3 debugColor = vec3(st.x * 0.5 + 0.5, st.y * 0.5 + 0.5, sin(time) * 0.5 + 0.5);
                
                // Calculate effective weights (weight * enabled)
                float fbmEffectiveWeight = u_fbmWeight * u_fbmEnabled;
                float voronoiEffectiveWeight = u_voronoiWeight * u_voronoiEnabled;
                float reactionEffectiveWeight = u_reactionWeight * u_reactionEnabled;
                float cellularEffectiveWeight = u_cellularWeight * u_cellularEnabled;
                float kaleidoEffectiveWeight = u_kaleidoWeight * u_kaleidoEnabled;
                float fractalEffectiveWeight = u_fractalWeight * u_fractalEnabled;
                float curlFlowEffectiveWeight = u_curlFlowWeight * u_curlFlowEnabled;
                float metaballsEffectiveWeight = u_metaballsWeight * u_metaballsEnabled;
                float superformulaEffectiveWeight = u_superformulaWeight * u_superformulaEnabled;
                float truchetEffectiveWeight = u_truchetWeight * u_truchetEnabled;
                float plasmaEffectiveWeight = u_plasmaWeight * u_plasmaEnabled;
                float moireEffectiveWeight = u_moireWeight * u_moireEnabled;
                float phyllotaxisEffectiveWeight = u_phyllotaxisWeight * u_phyllotaxisEnabled;
                float dlaEffectiveWeight = u_dlaWeight * u_dlaEnabled;
                float mandelbrotEffectiveWeight = u_mandelbrotWeight * u_mandelbrotEnabled;
                float hexRelaxEffectiveWeight = u_hexRelaxWeight * u_hexRelaxEnabled;
                float auroraEffectiveWeight = u_auroraWeight * u_auroraEnabled;
                float spirographEffectiveWeight = u_spirographWeight * u_spirographEnabled;
                float nebulaEffectiveWeight = u_nebulaWeight * u_nebulaEnabled;
                float lissajousEffectiveWeight = u_lissajousWeight * u_lissajousEnabled;
                float warpEffectiveWeight = u_warpWeight * u_warpEnabled;
                float causticsEffectiveWeight = u_causticsWeight * u_causticsEnabled;
                float galaxyEffectiveWeight = u_galaxyWeight * u_galaxyEnabled;
                float electricFieldEffectiveWeight = u_electricFieldWeight * u_electricFieldEnabled;
                float stainedGlassEffectiveWeight = u_stainedGlassWeight * u_stainedGlassEnabled;
                float topographicEffectiveWeight = u_topographicWeight * u_topographicEnabled;
                
                // Blend all shaders with effective weights
                float totalWeight = fbmEffectiveWeight + voronoiEffectiveWeight + reactionEffectiveWeight + 
                                  cellularEffectiveWeight + kaleidoEffectiveWeight + fractalEffectiveWeight + 
                                  curlFlowEffectiveWeight + metaballsEffectiveWeight + superformulaEffectiveWeight +
                                  truchetEffectiveWeight + plasmaEffectiveWeight + moireEffectiveWeight + 
                                  phyllotaxisEffectiveWeight + dlaEffectiveWeight + mandelbrotEffectiveWeight +
                                  hexRelaxEffectiveWeight +
                                  auroraEffectiveWeight + spirographEffectiveWeight + nebulaEffectiveWeight +
                                  lissajousEffectiveWeight + warpEffectiveWeight + causticsEffectiveWeight +
                                  galaxyEffectiveWeight + electricFieldEffectiveWeight + stainedGlassEffectiveWeight +
                                  topographicEffectiveWeight + 0.001;
                
                // Start with black color and accumulate blended results
                vec3 color = vec3(0.0);
                
                // Apply each shader with its blend mode
                if (fbmEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, fbmColor, fbmEffectiveWeight / totalWeight, u_fbmBlendMode);
                }
                if (voronoiEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, voronoiColor, voronoiEffectiveWeight / totalWeight, u_voronoiBlendMode);
                }
                if (reactionEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, reactionColor, reactionEffectiveWeight / totalWeight, u_reactionBlendMode);
                }
                if (cellularEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, cellularColor, cellularEffectiveWeight / totalWeight, u_cellularBlendMode);
                }
                if (kaleidoEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, kaleidoColor, kaleidoEffectiveWeight / totalWeight, u_kaleidoBlendMode);
                }
                if (fractalEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, fractalColor, fractalEffectiveWeight / totalWeight, u_fractalBlendMode);
                }
                if (curlFlowEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, curlFlowColor, curlFlowEffectiveWeight / totalWeight, u_curlFlowBlendMode);
                }
                if (metaballsEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, metaballsColor, metaballsEffectiveWeight / totalWeight, u_metaballsBlendMode);
                }
                if (superformulaEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, superformulaColor, superformulaEffectiveWeight / totalWeight, u_superformulaBlendMode);
                }
                if (truchetEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, truchetColor, truchetEffectiveWeight / totalWeight, u_truchetBlendMode);
                }
                if (plasmaEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, plasmaColor, plasmaEffectiveWeight / totalWeight, u_plasmaBlendMode);
                }
                if (moireEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, moireColor, moireEffectiveWeight / totalWeight, u_moireBlendMode);
                }
                if (phyllotaxisEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, phyllotaxisColor, phyllotaxisEffectiveWeight / totalWeight, u_phyllotaxisBlendMode);
                }
                if (dlaEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, dlaColor, dlaEffectiveWeight / totalWeight, u_dlaBlendMode);
                }
                if (mandelbrotEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, mandelbrotColor, mandelbrotEffectiveWeight / totalWeight, u_mandelbrotBlendMode);
                }
                if (hexRelaxEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, hexRelaxColor, hexRelaxEffectiveWeight / totalWeight, u_hexRelaxBlendMode);
                }
                if (auroraEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, auroraColor, auroraEffectiveWeight / totalWeight, u_auroraBlendMode);
                }
                if (spirographEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, spirographColor, spirographEffectiveWeight / totalWeight, u_spirographBlendMode);
                }
                if (nebulaEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, nebulaColor, nebulaEffectiveWeight / totalWeight, u_nebulaBlendMode);
                }
                if (lissajousEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, lissajousColor, lissajousEffectiveWeight / totalWeight, u_lissajousBlendMode);
                }
                if (warpEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, warpColor, warpEffectiveWeight / totalWeight, u_warpBlendMode);
                }
                if (causticsEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, causticsColor, causticsEffectiveWeight / totalWeight, u_causticsBlendMode);
                }
                if (galaxyEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, galaxyColor, galaxyEffectiveWeight / totalWeight, u_galaxyBlendMode);
                }
                if (electricFieldEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, electricFieldColor, electricFieldEffectiveWeight / totalWeight, u_electricFieldBlendMode);
                }
                if (stainedGlassEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, stainedGlassColor, stainedGlassEffectiveWeight / totalWeight, u_stainedGlassBlendMode);
                }
                if (topographicEffectiveWeight > 0.0) {
                    color = applyBlendMode(color, topographicColor, topographicEffectiveWeight / totalWeight, u_topographicBlendMode);
                }
                
                // DEBUG: If no shaders are active, show debug pattern
                if (totalWeight < 0.01) {
                    color = debugColor;
                }
                
                // Apply global adjustments
                color = adjustBrightness(color, u_brightness);
                color = adjustContrast(color, u_contrast);
                color = adjustSaturation(color, u_saturation);
                
                // Clamp and output
                color = clamp(color, 0.0, 1.0);
                gl_FragColor = vec4(color, 1.0);
                
                // DEBUG: Override with solid red to test if mesh is rendering
                // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `;
    }
}
