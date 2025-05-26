import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19.1/dist/lil-gui.esm.js';
import { ShaderComposer } from './shaderComposer.js';
import { guiConfig } from './guiConfig.js';

class GenerativeShaderApp {
    constructor() {
        this.clock = new THREE.Clock();
        this.params = this.initParams();
        this.init();
    }

    initParams() {
        const params = {
            // Shader enable toggles
            fbmEnabled: true,
            voronoiEnabled: true,
            reactionEnabled: false,
            cellularEnabled: false,
            kaleidoEnabled: true,
            fractalEnabled: false,
            
            // Master blend weights
            fbmWeight: 0.5,
            voronoiWeight: 0.3,
            reactionWeight: 0.0,
            cellularWeight: 0.0,
            kaleidoWeight: 0.2,
            fractalWeight: 0.0,
            
            // FBM parameters
            fbmScale: 2.0,
            fbmSpeed: 0.5,
            fbmOctaves: 4,
            fbmHueShift: 0.0,
            
            // Voronoi parameters
            voronoiScale: 5.0,
            voronoiSpeed: 0.3,
            voronoiSmooth: 0.02,
            voronoiColor: 0.5,
            
            // Reaction-diffusion parameters
            reactionFeed: 0.055,
            reactionKill: 0.062,
            reactionSpeed: 1.0,
            reactionScale: 1.0,
            
            // Cellular automata parameters
            cellularThreshold: 0.5,
            cellularSpeed: 5.0,
            cellularScale: 50.0,
            cellularSmooth: 0.1,
            
            // Kaleidoscope parameters
            kaleidoSegments: 6,
            kaleidoRotation: 0.1,
            kaleidoZoom: 1.0,
            kaleidoOffset: 0.0,
            
            // Fractal parameters
            fractalIterations: 100,
            fractalZoom: 1.0,
            fractalOffsetX: 0.0,
            fractalOffsetY: 0.0,
            fractalColor: 0.5,
            
            // Global parameters
            timeScale: 1.0,
            brightness: 1.0,
            contrast: 1.0,
            saturation: 1.0
        };
        
        return params;
    }

    async init() {
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Setup scene and camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Load and compose shaders
        this.shaderComposer = new ShaderComposer();
        await this.shaderComposer.loadShaders();
        
        // Create material with composed shader
        this.material = new THREE.ShaderMaterial({
            uniforms: this.createUniforms(),
            vertexShader: this.getVertexShader(),
            fragmentShader: this.shaderComposer.getComposedShader()
        });

        // Create full-screen quad
        const geometry = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);

        // Setup GUI
        this.setupGUI();

        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation loop
        this.animate();
    }

    createUniforms() {
        const uniforms = {
            u_time: { value: 0.0 },
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            
            // Shader enable toggles
            u_fbmEnabled: { value: this.params.fbmEnabled ? 1.0 : 0.0 },
            u_voronoiEnabled: { value: this.params.voronoiEnabled ? 1.0 : 0.0 },
            u_reactionEnabled: { value: this.params.reactionEnabled ? 1.0 : 0.0 },
            u_cellularEnabled: { value: this.params.cellularEnabled ? 1.0 : 0.0 },
            u_kaleidoEnabled: { value: this.params.kaleidoEnabled ? 1.0 : 0.0 },
            u_fractalEnabled: { value: this.params.fractalEnabled ? 1.0 : 0.0 },
            
            // Master weights
            u_fbmWeight: { value: this.params.fbmWeight },
            u_voronoiWeight: { value: this.params.voronoiWeight },
            u_reactionWeight: { value: this.params.reactionWeight },
            u_cellularWeight: { value: this.params.cellularWeight },
            u_kaleidoWeight: { value: this.params.kaleidoWeight },
            u_fractalWeight: { value: this.params.fractalWeight },
            
            // Algorithm-specific uniforms
            u_fbmScale: { value: this.params.fbmScale },
            u_fbmSpeed: { value: this.params.fbmSpeed },
            u_fbmOctaves: { value: this.params.fbmOctaves },
            u_fbmHueShift: { value: this.params.fbmHueShift },
            
            u_voronoiScale: { value: this.params.voronoiScale },
            u_voronoiSpeed: { value: this.params.voronoiSpeed },
            u_voronoiSmooth: { value: this.params.voronoiSmooth },
            u_voronoiColor: { value: this.params.voronoiColor },
            
            u_reactionFeed: { value: this.params.reactionFeed },
            u_reactionKill: { value: this.params.reactionKill },
            u_reactionSpeed: { value: this.params.reactionSpeed },
            u_reactionScale: { value: this.params.reactionScale },
            
            u_cellularThreshold: { value: this.params.cellularThreshold },
            u_cellularSpeed: { value: this.params.cellularSpeed },
            u_cellularScale: { value: this.params.cellularScale },
            u_cellularSmooth: { value: this.params.cellularSmooth },
            
            u_kaleidoSegments: { value: this.params.kaleidoSegments },
            u_kaleidoRotation: { value: this.params.kaleidoRotation },
            u_kaleidoZoom: { value: this.params.kaleidoZoom },
            u_kaleidoOffset: { value: this.params.kaleidoOffset },
            
            u_fractalIterations: { value: this.params.fractalIterations },
            u_fractalZoom: { value: this.params.fractalZoom },
            u_fractalOffset: { value: new THREE.Vector2(this.params.fractalOffsetX, this.params.fractalOffsetY) },
            u_fractalColor: { value: this.params.fractalColor },
            
            u_timeScale: { value: this.params.timeScale },
            u_brightness: { value: this.params.brightness },
            u_contrast: { value: this.params.contrast },
            u_saturation: { value: this.params.saturation }
        };
        
        return uniforms;
    }

    getVertexShader() {
        return `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;
    }

    setupGUI() {
        this.gui = new GUI();
        
        // Master blend weights
        const blendFolder = this.gui.addFolder('Shader Blend Weights');
        
        // Add toggles and weights for each shader
        blendFolder.add(this.params, 'fbmEnabled').name('FBM On/Off').onChange(v => this.material.uniforms.u_fbmEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'fbmWeight', 0, 1).name('FBM Weight').onChange(v => this.material.uniforms.u_fbmWeight.value = v);
        
        blendFolder.add(this.params, 'voronoiEnabled').name('Voronoi On/Off').onChange(v => this.material.uniforms.u_voronoiEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'voronoiWeight', 0, 1).name('Voronoi Weight').onChange(v => this.material.uniforms.u_voronoiWeight.value = v);
        
        blendFolder.add(this.params, 'reactionEnabled').name('Reaction On/Off').onChange(v => this.material.uniforms.u_reactionEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'reactionWeight', 0, 1).name('Reaction Weight').onChange(v => this.material.uniforms.u_reactionWeight.value = v);
        
        blendFolder.add(this.params, 'cellularEnabled').name('Cellular On/Off').onChange(v => this.material.uniforms.u_cellularEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'cellularWeight', 0, 1).name('Cellular Weight').onChange(v => this.material.uniforms.u_cellularWeight.value = v);
        
        blendFolder.add(this.params, 'kaleidoEnabled').name('Kaleido On/Off').onChange(v => this.material.uniforms.u_kaleidoEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'kaleidoWeight', 0, 1).name('Kaleido Weight').onChange(v => this.material.uniforms.u_kaleidoWeight.value = v);
        
        blendFolder.add(this.params, 'fractalEnabled').name('Fractal On/Off').onChange(v => this.material.uniforms.u_fractalEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'fractalWeight', 0, 1).name('Fractal Weight').onChange(v => this.material.uniforms.u_fractalWeight.value = v);
        
        blendFolder.open();
        
        // Algorithm-specific parameters
        guiConfig.setupGUI(this.gui, this.params, this.material.uniforms);
        
        // Global parameters
        const globalFolder = this.gui.addFolder('Global');
        globalFolder.add(this.params, 'timeScale', 0, 5).onChange(v => this.material.uniforms.u_timeScale.value = v);
        globalFolder.add(this.params, 'brightness', 0, 2).onChange(v => this.material.uniforms.u_brightness.value = v);
        globalFolder.add(this.params, 'contrast', 0, 2).onChange(v => this.material.uniforms.u_contrast.value = v);
        globalFolder.add(this.params, 'saturation', 0, 2).onChange(v => this.material.uniforms.u_saturation.value = v);
        
        // Utility buttons
        const utilsFolder = this.gui.addFolder('Utils');
        utilsFolder.add({ randomize: () => this.randomize() }, 'randomize').name('Randomize');
        utilsFolder.add({ preset1: () => this.loadPreset(0) }, 'preset1').name('Preset 1');
        utilsFolder.add({ preset2: () => this.loadPreset(1) }, 'preset2').name('Preset 2');
        utilsFolder.add({ preset3: () => this.loadPreset(2) }, 'preset3').name('Preset 3');
        utilsFolder.add({ save: () => this.saveParams() }, 'save').name('Save JSON');
        
        // Add GitHub link with icon
        const githubButton = utilsFolder.add({ github: () => {
            window.open('https://github.com/GregP-Navdna/InfiniBlend', '_blank');
        }}, 'github').name('');
        
        // Customize the GitHub button to show an icon
        setTimeout(() => {
            const controller = utilsFolder.controllers.find(c => c.property === 'github');
            if (controller && controller.domElement) {
                const nameElement = controller.domElement.querySelector('.name');
                if (nameElement) {
                    nameElement.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: #c3c3c3;">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span style="margin-left: 8px; font-size: 11px; opacity: 0.8;">GitHub</span>
                    `;
                    controller.domElement.classList.add('github-button');
                }
            }
        }, 100);
        
        utilsFolder.open();
    }

    randomize() {
        // Randomize boolean toggles
        const booleanParams = [
            'fbmEnabled', 'voronoiEnabled', 'reactionEnabled', 
            'cellularEnabled', 'kaleidoEnabled', 'fractalEnabled'
        ];
        
        booleanParams.forEach(key => {
            const value = Math.random() > 0.5;
            this.params[key] = value;
            const controller = this.gui.controllersRecursive().find(c => c.property === key);
            if (controller) {
                controller.setValue(value);
            }
        });
        
        // Randomize numeric parameters
        Object.keys(this.params).forEach(key => {
            // Skip boolean parameters as they're already handled
            if (booleanParams.includes(key)) return;
            
            const controller = this.gui.controllersRecursive().find(c => c.property === key);
            if (controller && controller._min !== undefined && controller._max !== undefined) {
                const min = controller._min;
                const max = controller._max;
                const value = min + Math.random() * (max - min);
                this.params[key] = value;
                controller.setValue(value);
            }
        });
    }

    loadPreset(index) {
        const presets = [
            // Preset 1: Dreamy Flow
            {
                fbmEnabled: true, voronoiEnabled: true, reactionEnabled: false, 
                cellularEnabled: false, kaleidoEnabled: false, fractalEnabled: false,
                fbmWeight: 0.7, voronoiWeight: 0.3, reactionWeight: 0, cellularWeight: 0,
                kaleidoWeight: 0, fractalWeight: 0, fbmScale: 1.5, fbmSpeed: 0.3,
                fbmOctaves: 5, fbmHueShift: 0.2, voronoiScale: 3, voronoiSpeed: 0.1,
                timeScale: 0.8, brightness: 1.1, contrast: 1.2, saturation: 0.9
            },
            // Preset 2: Kaleidoscope Dreams
            {
                fbmEnabled: true, voronoiEnabled: false, reactionEnabled: false, 
                cellularEnabled: false, kaleidoEnabled: true, fractalEnabled: false,
                fbmWeight: 0.2, voronoiWeight: 0, reactionWeight: 0, cellularWeight: 0,
                kaleidoWeight: 0.8, fractalWeight: 0, kaleidoSegments: 8, kaleidoRotation: 0.2,
                kaleidoZoom: 1.5, fbmScale: 0.5, timeScale: 1.2, brightness: 1.2,
                contrast: 1.3, saturation: 1.1
            },
            // Preset 3: Fractal Reaction
            {
                fbmEnabled: false, voronoiEnabled: false, reactionEnabled: true, 
                cellularEnabled: false, kaleidoEnabled: false, fractalEnabled: true,
                fbmWeight: 0, voronoiWeight: 0, reactionWeight: 0.6, cellularWeight: 0,
                kaleidoWeight: 0, fractalWeight: 0.4, reactionFeed: 0.055, reactionKill: 0.062,
                fractalIterations: 80, fractalZoom: 0.8, timeScale: 0.5, brightness: 1.0,
                contrast: 1.5, saturation: 0.8
            }
        ];
        
        const preset = presets[index];
        if (preset) {
            Object.keys(preset).forEach(key => {
                if (this.params.hasOwnProperty(key)) {
                    this.params[key] = preset[key];
                    const controller = this.gui.controllersRecursive().find(c => c.property === key);
                    if (controller) controller.setValue(preset[key]);
                }
            });
        }
    }

    saveParams() {
        const dataStr = JSON.stringify(this.params, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'shader-params-' + Date.now() + '.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    onWindowResize() {
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const elapsedTime = this.clock.getElapsedTime();
        this.material.uniforms.u_time.value = elapsedTime;
        
        // Update fractal offset uniform
        this.material.uniforms.u_fractalOffset.value.set(
            this.params.fractalOffsetX,
            this.params.fractalOffsetY
        );
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Start application
window.addEventListener('DOMContentLoaded', () => {
    new GenerativeShaderApp();
});
