<!--
/*************************************************************
 ******** DINAMICA DE MASAS ACOPLADAS ************************
 *************************************************************
 ** Autor: Miguel Angel Revelo Cordoba                      **
 ** Institución: Universidad de Antioquia                   **
 ** Curso: Laboratorio avanzado 3  2025-1                   **
 *************************************************************
 ** Dependencias (librerías):
 **  - p5.js (CDN): https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js
 **
**************************************************************
 *************************************************************/
-->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Masa en Movimiento Circular Acoplada</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
    <style>
        /* ESTILOS (CSS) */
        html, body { margin: 0; padding: 0; height: 100%; width: 100%; }
        body { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #f0f2f5; height: 100%; width: 100%; overflow: hidden; display: flex; }
        #sidebar { width: 320px; min-width: 320px; background: #ffffff; border-right: 1px solid #ddd; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; z-index: 10; overflow-y: auto; height: 100%; }
        #sim-container { flex: 1 1 auto; min-width: 0; position: relative; background-color: #e9ecef; overflow: hidden; }
        h2 { margin-top: 0; color: #2c3e50; font-size: 1.2rem; }
        .control-group { margin-bottom: 15px; background: #f8f9fa; padding: 10px; border-radius: 6px; border: 1px solid #dee2e6; }
        label { display: block; font-size: 0.85rem; font-weight: 600; color: #495057; margin-bottom: 5px; }
        .row { display: flex; gap: 10px; align-items: center; }
        input[type="range"] { flex-grow: 1; }
        input[type="number"] { width: 60px; padding: 4px; border: 1px solid #ced4da; border-radius: 4px; }
        button { width: 100%; padding: 12px; margin-top: 5px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; color: white; transition: 0.2s; }
        .btn-start { background-color: #0d6efd; }
        .btn-start:hover { background-color: #0b5ed7; }
        .btn-pause { background-color: #6c757d; }
        .btn-pause:hover { background-color: #5c636a; }
        .stats { margin-top: auto; font-size: 0.9rem; color: #666; background: #e2e3e5; padding: 10px; border-radius: 6px; }
        #sim-container canvas { display: block; }

    </style>
</head>
<body>

    <div id="sidebar">
        <h2>Dinámica de masas acopladas</h2>
        
        <div class="control-group">
            <label>Masa 1 (Mesa) [kg]</label>
            <div class="row">
                <input type="range" min="0.5" max="5.0" step="0.1" value="1.0" oninput="updateVal('m1', this.value)">
                <input type="number" id="disp_m1" value="1.0" readonly>
            </div>
        </div>

        <div class="control-group">
            <label>Masa 2 (Colgante) [kg]</label>
            <div class="row">
                <input type="range" min="0.5" max="5.0" step="0.1" value="1.5" oninput="updateVal('m2', this.value)">
                <input type="number" id="disp_m2" value="1.5" readonly>
            </div>
        </div>

        <div class="control-group">
            <label>Coeficiente de Fricción (&mu;)</label>
            <div class="row">
                <input type="range" min="0.0" max="0.5" step="0.01" value="0.0" oninput="updateVal('mu', this.value)">
                <input type="number" id="disp_mu" value="0.0" readonly>
            </div>
        </div>

        <div class="control-group">
            <label>Radio inicial (r₀) [m]</label>
            <div class="row">
                <input type="range" min="0.2" max="1.5" step="0.1" value="0.8" oninput="updateVal('r0', this.value)">
                <input type="number" id="disp_r0" value="0.8" readonly>
            </div>
        </div>

        <div class="control-group">
            <label>Velocidad inicial (v₀) [m/s]</label>
            <div class="row">
                <input type="range" min="0.0" max="10.0" step="0.1" value="3.5" oninput="updateVal('v0', this.value)">
                <input type="number" id="disp_v0" value="3.5" readonly>
            </div>
        </div>

        <div class="control-group">
            <label>Longitud de Estela (Cola)</label>
            <div class="row">
                <input type="range" min="0" max="1500" step="10" value="100" oninput="updateTrail(this.value)">
                <input type="number" id="disp_trail" value="100" readonly>
            </div>
        </div>

        <button class="btn-start" onclick="resetSim()">Reiniciar Simulación</button>
        <button class="btn-pause" onclick="togglePause()">Pausar / Reanudar</button>

        <div class="stats">
            <strong>Datos en Vivo:</strong><br>
            Radio (r): <span id="stat_r">0.00</span> m<br>
            Energía (E): <span id="stat_E">0.00</span> J
        </div>
    </div>

    <div id="sim-container"></div>

    <script>

        // --- 1. CONFIGURACIÓN ---
        let params = { m1: 1.0, m2: 1.5, mu: 0.0, g: 9.81, r0: 0.8, v0: 3.5 };
        let state = { r: 0.8, vr: 0, th: 0, w: 0 };
        let running = true;
        let simMessage = ""; 
        let pxScale = 100; 

        // --- VARIABLES DE TRAZO ---
        let trail = []; 
        let maxTrailLength = 150; 

        // --- 2. INTERFAZ ---
        function updateVal(key, val) {
            params[key] = parseFloat(val);
            document.getElementById('disp_' + key).value = params[key];
        }

        // --- ACTUALIZAR LONGITUD DE TRAZO ---
        function updateTrail(val) {
            maxTrailLength = parseInt(val);
            document.getElementById('disp_trail').value = maxTrailLength;
            // Immediate cleanup if we shorten the tail
            if (trail.length > maxTrailLength) {
                trail = trail.slice(trail.length - maxTrailLength);
            }
        }

        function togglePause() { running = !running; }

        function resetSim() {
            state.r = params.r0;
            state.vr = 0;
            state.th = 0;
            state.w = (params.r0 > 0.01) ? params.v0 / params.r0 : 0;
            running = true;
            simMessage = ""; 
            trail = []; 
        }

        // --- 3. SETUP ---
        function resizeToContainer() {
    const container = document.getElementById('sim-container');
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    resizeCanvas(w, h);
    calcScale();
}

// --- 3. SETUP ---
function setup() {
    let cnv = createCanvas(1, 1);
    cnv.parent('sim-container');


    requestAnimationFrame(() => {
        resizeToContainer();
        resetSim();
    });
}

function windowResized() {
    resizeToContainer();
}

function calcScale() {
            let minDim = min(width/2, height); 
            pxScale = (minDim * 0.8) / 4.0; 
        }

        // --- 4. ANIMACIÓN ---
        function draw() {
            background(245); 

            if (running) {
                let dt = 1/60;
                let subSteps = 8; 
                for (let i = 0; i < subSteps; i++) {
                    stepRK4(dt / subSteps);
                    if (!running) break; 
                }

                if (running) {
                    let currentX = state.r * pxScale * cos(state.th);
                    let currentY = state.r * pxScale * sin(state.th);
                    trail.push({x: currentX, y: currentY});
                    // Updated logic to use variable maxTrailLength
                    if (trail.length > maxTrailLength) trail.shift(); 
                    updateStats();
                }
            }

            let wHalf = width / 2;
            stroke(200); strokeWeight(2); line(wHalf, 0, wHalf, height);

            // -- Panel Izquierdo (Top View) --
            push();
            translate(wHalf / 2, height / 2);
            fill(255); stroke(150); strokeWeight(2); circle(0, 0, 4.0 * pxScale); // Mesa
            
            // Trazo
            noFill();
            // Draw lines
            for (let i = 1; i < trail.length; i++) {
                let prev = trail[i-1]; let curr = trail[i];
                // Calculate visual age for fading
                let age = trail.length - i; 
                // Color fades with age
                stroke(37, 99, 235, map(age, 0, trail.length, 255, 0)); 
                strokeWeight(map(age, 0, trail.length, 3, 0.5));
                line(prev.x, prev.y, curr.x, curr.y);
            }

            fill(30); noStroke(); circle(0, 0, 10); // Agujero
            let x1 = state.r * pxScale * cos(state.th);
            let y1 = state.r * pxScale * sin(state.th);
            stroke(50); strokeWeight(2); line(0, 0, x1, y1); // Cuerda
            fill(37, 99, 235); noStroke(); let m1Rad = 15 + params.m1 * 3;
            circle(x1, y1, m1Rad * 2); // Masa
            fill(100); textAlign(CENTER); textSize(14); text("VISTA SUPERIOR", 0, -height/2 + 30);
            pop();

            // -- Panel Derecho (Side View) --
            push();
            translate(wHalf + (wHalf / 2), height / 3);
            rectMode(CENTER); fill(220); stroke(180); rect(0, 0, 4.0 * pxScale, 15);
            fill(30); noStroke(); rect(0, 0, 12, 15);
            let m1X_side = state.r * pxScale;
            fill(37, 99, 235); rect(m1X_side, -15, 30, 20);
            stroke(50); strokeWeight(2); line(0, -5, m1X_side, -5);
            let hangLen = (2.5 - state.r) * pxScale; 
            line(0, 0, 0, hangLen);
            fill(220, 38, 38); noStroke(); let m2Sz = 20 + params.m2 * 8;
            rect(0, hangLen + m2Sz/2, m2Sz, m2Sz); // Masa 2
            fill(100); textAlign(CENTER); textSize(14); text("VISTA LATERAL", 0, -100);
            pop();


            if (simMessage !== "") {
                push();
                translate(width/2, height/2);
                fill(0, 0, 0, 200); 
                noStroke(); rectMode(CENTER);
                rect(0, 0, 450, 80, 10); 
                fill(255); textAlign(CENTER, CENTER); textSize(20);
                text(simMessage, 0, 0); 
                pop();
            }
        }

        function updateStats() {
            let v_tan = state.r * state.w;
            let v_tot_sq = state.vr*state.vr + v_tan*v_tan;
            let KE = 0.5 * params.m1 * v_tot_sq + 0.5 * params.m2 * (state.vr*state.vr);
            let PE = params.m2 * params.g * state.r;
            document.getElementById('stat_r').innerText = state.r.toFixed(3);
            document.getElementById('stat_E').innerText = (KE + PE).toFixed(2);
        }

        function getDerivatives(st) {
            let r = st.r; if(r < 0.05) r = 0.05; 
            let vr = st.vr; let w = st.w;
            let v_tan = r * w;
            let v_tot = Math.sqrt(vr*vr + v_tan*v_tan);
            
            let Ff = params.mu * params.m1 * params.g;
            let F_rad_fric = 0; let F_tan_fric = 0;

            if (v_tot > 0.0001) {
                F_rad_fric = -Ff * (vr / v_tot);
                F_tan_fric = -Ff * (v_tan / v_tot);
            } else {
                F_rad_fric = -5 * vr; F_tan_fric = -5 * v_tan;
            }

            let centrifugal = params.m1 * r * w * w;
            let gravity = params.m2 * params.g;
            let ar = (centrifugal - gravity + F_rad_fric) / (params.m1 + params.m2);
            let alpha = ((F_tan_fric/params.m1) - (2*vr*w)) / r;
            return { dr: vr, dvr: ar, dth: w, dw: alpha };
        }

        function stepRK4(dt) {
            let s = state;
            let k1 = getDerivatives(s);
            let s2 = { r: s.r+k1.dr*dt*0.5, vr: s.vr+k1.dvr*dt*0.5, th: s.th+k1.dth*dt*0.5, w: s.w+k1.dw*dt*0.5 };
            let k2 = getDerivatives(s2);
            let s3 = { r: s.r+k2.dr*dt*0.5, vr: s.vr+k2.dvr*dt*0.5, th: s.th+k2.dth*dt*0.5, w: s.w+k2.dw*dt*0.5 };
            let k3 = getDerivatives(s3);
            let s4 = { r: s.r+k3.dr*dt, vr: s.vr+k3.dvr*dt, th: s.th+k3.dth*dt, w: s.w+k3.dw*dt };
            let k4 = getDerivatives(s4);

            state.r  += (k1.dr + 2*k2.dr + 2*k3.dr + k4.dr) * dt/6;
            state.vr += (k1.dvr + 2*k2.dvr + 2*k3.dvr + k4.dvr) * dt/6;
            state.th += (k1.dth + 2*k2.dth + 2*k3.dth + k4.dth) * dt/6;
            state.w  += (k1.dw + 2*k2.dw + 2*k3.dw + k4.dw) * dt/6;

            if (state.r > 2.0) { 
                running = false; 
                simMessage = "¡La masa se salió de la mesa!"; 
            }
            if (state.r < 0.02) { 
                running = false; 
                simMessage = "¡La masa cayó por el agujero!"; 
            }
        }
    </script>
</body>
</html>