export const guiConfig = {
    setupGUI: (gui, params, uniforms) => {
        // FBM parameters
        const fbmFolder = gui.addFolder('FBM Noise');
        fbmFolder.add(params, 'fbmScale', 0.1, 10).onChange(v => uniforms.u_fbmScale.value = v);
        fbmFolder.add(params, 'fbmSpeed', 0, 2).onChange(v => uniforms.u_fbmSpeed.value = v);
        fbmFolder.add(params, 'fbmOctaves', 1, 8, 1).onChange(v => uniforms.u_fbmOctaves.value = v);
        fbmFolder.add(params, 'fbmHueShift', 0, 1).onChange(v => uniforms.u_fbmHueShift.value = v);
        
        // Voronoi parameters
        const voronoiFolder = gui.addFolder('Voronoi');
        voronoiFolder.add(params, 'voronoiScale', 1, 20).onChange(v => uniforms.u_voronoiScale.value = v);
        voronoiFolder.add(params, 'voronoiSpeed', 0, 2).onChange(v => uniforms.u_voronoiSpeed.value = v);
        voronoiFolder.add(params, 'voronoiSmooth', 0.001, 0.1).onChange(v => uniforms.u_voronoiSmooth.value = v);
        voronoiFolder.add(params, 'voronoiColor', 0, 1).onChange(v => uniforms.u_voronoiColor.value = v);
        
        // Reaction-diffusion parameters
        const reactionFolder = gui.addFolder('Reaction-Diffusion');
        reactionFolder.add(params, 'reactionFeed', 0.01, 0.1).onChange(v => uniforms.u_reactionFeed.value = v);
        reactionFolder.add(params, 'reactionKill', 0.04, 0.08).onChange(v => uniforms.u_reactionKill.value = v);
        reactionFolder.add(params, 'reactionSpeed', 0, 5).onChange(v => uniforms.u_reactionSpeed.value = v);
        reactionFolder.add(params, 'reactionScale', 0.1, 5).onChange(v => uniforms.u_reactionScale.value = v);
        
        // Cellular automata parameters
        const cellularFolder = gui.addFolder('Cellular Automata');
        cellularFolder.add(params, 'cellularThreshold', 0, 1).onChange(v => uniforms.u_cellularThreshold.value = v);
        cellularFolder.add(params, 'cellularSpeed', 0, 20).onChange(v => uniforms.u_cellularSpeed.value = v);
        cellularFolder.add(params, 'cellularScale', 10, 200).onChange(v => uniforms.u_cellularScale.value = v);
        cellularFolder.add(params, 'cellularSmooth', 0, 1).onChange(v => uniforms.u_cellularSmooth.value = v);
        
        // Kaleidoscope parameters
        const kaleidoFolder = gui.addFolder('Kaleidoscope');
        kaleidoFolder.add(params, 'kaleidoSegments', 2, 16, 1).onChange(v => uniforms.u_kaleidoSegments.value = v);
        kaleidoFolder.add(params, 'kaleidoRotation', -1, 1).onChange(v => uniforms.u_kaleidoRotation.value = v);
        kaleidoFolder.add(params, 'kaleidoZoom', 0.1, 5).onChange(v => uniforms.u_kaleidoZoom.value = v);
        kaleidoFolder.add(params, 'kaleidoOffset', -5, 5).onChange(v => uniforms.u_kaleidoOffset.value = v);
        
        // Fractal parameters
        const fractalFolder = gui.addFolder('Fractal');
        fractalFolder.add(params, 'fractalIterations', 10, 200, 1).onChange(v => uniforms.u_fractalIterations.value = v);
        fractalFolder.add(params, 'fractalZoom', 0.1, 5).onChange(v => uniforms.u_fractalZoom.value = v);
        fractalFolder.add(params, 'fractalOffsetX', -2, 2).onChange(v => uniforms.u_fractalOffset.value.x = v);
        fractalFolder.add(params, 'fractalOffsetY', -2, 2).onChange(v => uniforms.u_fractalOffset.value.y = v);
        fractalFolder.add(params, 'fractalColor', 0, 1).onChange(v => uniforms.u_fractalColor.value = v);
    }
};
