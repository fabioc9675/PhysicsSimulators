<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulación Stern-Gerlach</title>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>

    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden; /* Prevents scrollbars */
            background-color: #1e1e28; /* Matches the sketch background */
            font-family: sans-serif;
        }
        /* Style for p5.js DOM elements (buttons/selects) to look cleaner */
        button, select {
            margin-bottom: 5px;
            font-size: 12px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <script>
        /*************************************************************
         ******** SIMULACIÓN EXPERIMETO DE STERN-GERLACH  ************
         *************************************************************
         * * Autores: Marlon Jhassir García Velasquez                *
         * * Ricardo Felipe Moran Vasquez                   *
         * * Juan Sebastian Agudelo Lozada                  *
         ** Institución: Universidad de Antioquia                    **
         ** Curso: Laboratorio avanzado 3                            **
         *************************************************************/

        // VARIABLES GLOBALES
        let particles = [];
        let runningBeam = false;
        let lastEmitTime = 0;
        let emitInterval = 100;

        // Configuración del Experimento
        let experiment1 = "SG-Z";
        // Primer imán
        let experiment2 = "NONE";       // Segundo imán (NONE = Desactivado)
        let initialSpinState = "z+";
        // Estado del horno

        // Estadísticas
        let stats = { up: 0, down: 0, total: 0 };
        // UI Elements
        let btnSingle, btnBeam, btnReset;
        let selState, selExp1, selExp2;

        // Layout dinámico
        let mag1_Start = 250;
        let mag1_End = 450;
        let filter_X = 480;
        let mag2_Start = 550;
        let mag2_End = 750;

        function setup() {
            createCanvas(windowWidth, windowHeight);
            textSize(14);
            setupUI();
            resetSimulation();
        }


        // Interfaz de usuario
        // ---------------------------------------------------------
        function setupUI() {
            let uiX = 20;
            let uiY = 20;
            // Título y Botones
            createP('<b>Control del Horno</b>').position(uiX, uiY - 15).style('color', '#FFF');
            
            btnSingle = createButton("Lanzar 1 Partícula");
            btnSingle.position(uiX, uiY + 30);
            btnSingle.mousePressed(emitParticle);
            
            btnBeam = createButton("Haz Continuo (ON/OFF)");
            btnBeam.position(uiX, uiY + 60);
            btnBeam.mousePressed(() => {
                runningBeam = !runningBeam;
                if(runningBeam) btnBeam.style('background-color', '#ffaaaa');
                else btnBeam.style('background-color', '');
            });
            // Selectores
            createP('<b>Configuración</b>').position(uiX, uiY + 95).style('color', '#FFF');

            // 1. Estado Inicial
            createSpan('Estado Inicial:').position(uiX, uiY + 140).style('color', '#AAA');
            selState = createSelect();
            selState.position(uiX + 100, uiY + 140);
            selState.option("z+");
            selState.option("z-");
            selState.option("x+");
            selState.changed(() => { initialSpinState = selState.value(); resetSimulation(); });
            
            // 2. Primer SG
            createSpan('1er Aparato:').position(uiX, uiY + 170).style('color', '#88FFFF');
            selExp1 = createSelect();
            selExp1.position(uiX + 100, uiY + 170);
            selExp1.option("SG-Z");
            selExp1.option("SG-X");
            selExp1.option("SG-Y");
            selExp1.changed(() => { experiment1 = selExp1.value(); resetSimulation(); });
            
            // 3. Segundo SG (Opcional)
            createSpan('2do Aparato:').position(uiX, uiY + 200).style('color', '#FF88FF');
            selExp2 = createSelect();
            selExp2.position(uiX + 100, uiY + 200);
            selExp2.option("DESACTIVADO", "NONE"); // Opción para apagarlo
            selExp2.option("SG-Z");
            selExp2.option("SG-X");
            selExp2.option("SG-Y");
            selExp2.changed(() => { 
                experiment2 = selExp2.value(); 
                resetSimulation(); 
            });
            
            // Botón Reiniciar
            btnReset = createButton("Reiniciar Todo");
            btnReset.position(uiX, uiY + 350);
            btnReset.style('background-color', '#ff5555');
            btnReset.style('color', 'white');
            btnReset.mousePressed(() => {
                resetSimulation();
                runningBeam = false; 
                btnBeam.style('background-color', '');
            });
        }

        function resetSimulation() {
            stats = { up: 0, down: 0, total: 0 };
            particles = [];
        }


        // bucle de dibujos
        // ---------------------------------------------------------
        function draw() {
            background(30, 30, 40);

            // Dibujar elementos estáticos
            drawSource();
            drawMagnet(mag1_Start, height/2 - 60, experiment1, "#88FFFF"); // Imán 1 siempre visible

            // Lógica para mostrar Imán 2 o Detectores
            let detectorsX;
            if (experiment2 !== "NONE") {
                // MODO DOBLE
                drawFilter(filter_X);
                // Bloque intermedio
                drawMagnet(mag2_Start, height/2 - 110, experiment2, "#FF88FF");
                // Imán 2 (más arriba)
                detectorsX = mag2_End + 50;
                drawDetectors(detectorsX, height/2 - 50);
                // Detectores al final de la cadena
            } else {
                // MODO SIMPLE
                detectorsX = mag1_End + 50;
                drawDetectors(detectorsX, height/2); // Detectores justo después del 1ro
            }

            drawGraph();
            // Barra de estadísticas original

            // Generador de haz
            if (runningBeam && millis() - lastEmitTime > emitInterval) {
                emitParticle();
                lastEmitTime = millis();
            }

            // Actualizar partículas
            for (let i = particles.length - 1; i >= 0; i--) {
                let p = particles[i];
                p.update();
                p.display();
                
                // Checkear colisiones
                let result = checkCollision(p, detectorsX);
                if (result === "dead") {
                    particles.splice(i, 1);
                    // Murió en el filtro
                } else if (result) {
                    recordMeasurement(result);
                    particles.splice(i, 1); // Llegó al detector
                } else if (p.pos.x > width) {
                    particles.splice(i, 1);
                    // Se fue de pantalla
                }
            }
        }


        // Particula
        // ---------------------------------------------------------
        class Particle {
            constructor(x, y, spinState) {
                this.pos = createVector(x, y);
                this.vel = createVector(4, 0);
                this.state = spinState;
                this.r = 10;
                // Variables de estado interno
                this.decision1 = 0; 
                this.decision2 = 0;
                this.processed1 = false;
                this.processed2 = false;
                this.passedFilter = false;
            }

            update() {
                this.pos.add(this.vel);
                // --- ETAPA 1: PRIMER IMÁN ---
                if (this.pos.x > mag1_Start && this.pos.x < mag1_End) {
                    if (!this.processed1) {
                        this.decision1 = getCollapse(this.state, experiment1);
                        this.processed1 = true;
                    }
                    // Animación de desviación (Suavizado lerp)
                    let targetY = (height/2) + (this.decision1 * 50);
                    // +50 (Down), -50 (Up)
                    this.pos.y = lerp(this.pos.y, targetY, 0.1);
                }

                // --- DECISIÓN: ¿HAY SEGUNDA ETAPA? ---
                if (experiment2 === "NONE") {
                    // MODO SIMPLE: Solo seguir recto tras salir del imán 1
                    if (this.pos.x >= mag1_End) this.vel.y = 0;
                    return; 
                }

                // --- MODO DOBLE: LÓGICA DE FILTRO Y SEGUNDO IMÁN ---
                
                // Zona Filtro (Entre imanes)
                if (this.pos.x > mag1_End && this.pos.x < mag2_Start) {
                    this.vel.y = 0;
                    // Estabilizar vuelo horizontal
                    
                    // Si la decisión fue DOWN (1), choca con el filtro
                    if (this.decision1 === 1) { 
                        if (this.pos.x > filter_X) this.pos.x = -9999;
                        // Hack para matarla (checkCollision la borrará)
                    } else {
                        // Si fue UP (-1), sobrevive y su estado cambia al del eje del Imán 1
                        if (!this.passedFilter) {
                            // Actualizamos el estado cuántico para la siguiente medición
                            // Ej: Si pasó por SG-X hacia arriba, ahora es "x+"
                            this.state = getNewStateString(experiment1, "up");
                            this.passedFilter = true;
                        }
                    }
                }

                // Zona Imán 2
                if (this.pos.x > mag2_Start && this.pos.x < mag2_End) {
                    if (!this.processed2) {
                        this.decision2 = getCollapse(this.state, experiment2);
                        this.processed2 = true;
                    }
                    // Base Y es la salida UP del imán 1 (height/2 - 50)
                    let baseY = height/2 - 50;
                    let targetY = baseY + (this.decision2 * 40); 
                    this.pos.y = lerp(this.pos.y, targetY, 0.1);
                }
                
                // Salida final
                if (this.pos.x >= mag2_End) this.vel.y = 0;
            }

            display() {
                // LÓGICA DE INVISIBILIDAD
                // Si está dentro del Imán 1
                if (this.pos.x > mag1_Start && this.pos.x < mag1_End) return;
                // Si hay Imán 2 activo y está dentro
                if (experiment2 !== "NONE" && this.pos.x > mag2_Start && this.pos.x < mag2_End) return;
                // Si está "muerta" (colisionó en filtro) no dibujar
                if (this.pos.x < 0) return;

                noStroke();
                fill(255, 50, 50);
                ellipse(this.pos.x, this.pos.y, this.r);
            }
        }


        // mecanica cuantica 
        // ---------------------------------------------------------
        function getCollapse(state, magnet) {
            let p_up = 0.5;
            // Por defecto (ortogonal)

            let axis = magnet.charAt(3).toLowerCase(); // z, x, y
            let stateAxis = state.charAt(0);
            let stateSign = state.charAt(1);

            // Si los ejes coinciden (Medición determinista)
            if (axis === stateAxis) {
                if (stateSign === "+") p_up = 1.0;
                else p_up = 0.0;
            }

            // Colapso aleatorio
            if (random(1) < p_up) return -1;
            // UP
            else return 1; // DOWN
        }

        function getNewStateString(magnet, result) {
            // Retorna el nuevo estado tras pasar una medición
            // magnet: "SG-Z", result: "up" -> retorna "z+"
            let axis = magnet.charAt(3).toLowerCase();
            let sign = (result === "up") ? "+" : "-";
            return axis + sign;
        }


        // Chequear colisiones
        // ---------------------------------------------------------
        function emitParticle() {
            particles.push(new Particle(100, height/2, initialSpinState));
        }

        function checkCollision(p, detX) {
            if (p.pos.x < 0) return "dead";
            // Código de muerte en filtro

            // Verificar cercanía X con detectores
            if (p.pos.x > detX && p.pos.x < detX + 20) {
                // Determinar altura esperada
                let centerLine = (experiment2 !== "NONE") ?
                (height/2 - 50) : height/2;
                let gap = (experiment2 !== "NONE") ? 40 : 50;
                if (abs(p.pos.y - (centerLine - gap)) < 30) return "up";
                if (abs(p.pos.y - (centerLine + gap)) < 30) return "down";
            }
            return null;
        }

        function recordMeasurement(res) {
            stats.total++;
            if (res === "up") stats.up++;
            if (res === "down") stats.down++;
        }

        // ELEMENTOS VISUALES
        function drawSource() {
            fill(100); stroke(200);
            rect(80, height/2 - 40, 60, 80);
            fill(255); noStroke(); textAlign(CENTER);
            text("HORNO", 110, height/2);
            text(initialSpinState, 110, height/2 + 20);
            rect(140, height/2 - 10, 20, 20);
        }

        function drawMagnet(x, y, type, colorHex) {
            fill(60, 60, 70, 240); // Opaco (Caja negra)
            stroke(colorHex); strokeWeight(2);
            rect(x, y, 200, 120);
            noStroke(); fill(colorHex);
            text(type, x + 100, y + 60);
            strokeWeight(1);
        }

        function drawFilter(x) {
            // Dibuja el bloque que detiene las partículas que van abajo
            fill(80); stroke(255, 100, 100);
            // Bloquea la ruta inferior que sale del primer imán
            rect(x, height/2 + 20, 20, 60); 
            noStroke();
            fill(255, 100, 100);
            textSize(10); text("BLOCK", x+10, height/2 + 50);
        }

        function drawDetectors(x, centerY) {
            let gap = (experiment2 !== "NONE") ?
            40 : 50; // Ajuste visual

            // Detector UP
            fill(20); stroke(0, 255, 0);
            rect(x, centerY - gap - 30, 20, 60);
            
            // Detector DOWN
            fill(20); stroke(0, 100, 255);
            rect(x, centerY + gap - 30, 20, 60);
            
            noStroke(); textSize(12); fill(255);
            text("D+", x+10, centerY - gap);
            text("D-", x+10, centerY + gap);
        }

        function drawGraph() {
            // Gráfico original restaurado
            let gx = width - 250;
            let gy = 50;
            let gh = 150;
            let gw = 200;
            
            fill(0, 150); stroke(255);
            rect(gx, gy, gw, gh);
            if (stats.total > 0) {
                let pup = stats.up / stats.total;
                let pdown = stats.down / stats.total;
                fill(0, 255, 0, 180);
                let hUp = pup * (gh - 40);
                rect(gx+40, gy+gh-20-hUp, 40, hUp);
                
                fill(0, 100, 255, 180);
                let hDown = pdown * (gh - 40);
                rect(gx+120, gy+gh-20-hDown, 40, hDown);
                
                fill(255); textAlign(CENTER);
                text(`${nf(pup*100,1,0)}%`, gx+60, gy+gh-5);
                text(`${nf(pdown*100,1,0)}%`, gx+140, gy+gh-5);
            }
            
            fill(255); textAlign(CENTER);
            text("RESULTADOS", gx+gw/2, gy+20);
            text(`Total: ${stats.total}`, gx+gw/2, gy+35);
        }

        function windowResized() { resizeCanvas(windowWidth, windowHeight); setupUI(); }
    </script>
</body>
</html>