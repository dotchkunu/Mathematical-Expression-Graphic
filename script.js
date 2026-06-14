// ============================================
// MATHEMATICAL EXPRESSION GRAPHIC
// Fractals, Trigonometric Waves, Polar Equations
// Complex numbers, Julia sets, Mathematical formulas
// ============================================

const DEFAULT_SHADER = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec2 move;
uniform vec2 wheel;

// ============================================
// MATHEMATICAL FUNCTIONS
// ============================================

// Complex number operations
vec2 cmul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 cadd(vec2 a, vec2 b) {
    return a + b;
}

float cabs(vec2 z) {
    return sqrt(z.x * z.x + z.y * z.y);
}

// Mandelbrot iteration count
float mandelbrot(vec2 c, int maxIter) {
    vec2 z = vec2(0.0);
    float iter = 0.0;
    for(int i = 0; i < 100; i++) {
        if(i >= maxIter) break;
        if(cabs(z) > 2.0) break;
        z = cmul(z, z);
        z = cadd(z, c);
        iter += 1.0;
    }
    return iter;
}

// Julia set
float julia(vec2 z, vec2 c, int maxIter) {
    float iter = 0.0;
    for(int i = 0; i < 80; i++) {
        if(i >= maxIter) break;
        if(cabs(z) > 2.0) break;
        z = cmul(z, z);
        z = cadd(z, c);
        iter += 1.0;
    }
    return iter;
}

// Trigonometric wave function
float trigWave(vec2 p, float t) {
    float w1 = sin(p.x * 8.0 + t) * cos(p.y * 6.0 - t * 1.5);
    float w2 = sin(p.y * 12.0 + t * 2.0) * cos(p.x * 10.0 + t);
    float w3 = sin((p.x * 3.0 + p.y * 4.0) * 5.0 + t * 3.0);
    return (w1 + w2 + w3) / 3.0;
}

// Polar flower equation
float polarFlower(vec2 p, float t) {
    float r = length(p);
    float a = atan(p.y, p.x);
    float petals = 5.0 + sin(t * 0.5) * 2.0;
    float flower = sin(petals * a + t) * 0.5 + 0.5;
    float radial = 1.0 - smoothstep(0.2, 0.8, r);
    return flower * radial;
}

// Spiral equation
float spiral(vec2 p, float t) {
    float r = length(p);
    float a = atan(p.y, p.x);
    float spiralVal = sin(a * 8.0 - r * 15.0 + t * 3.0);
    float rFalloff = 1.0 - smoothstep(0.1, 1.2, r);
    return (spiralVal * 0.5 + 0.5) * rFalloff;
}

// Modulo / grid pattern (mathematical)
float mathGrid(vec2 p, float t) {
    vec2 q = p * 4.0;
    vec2 grid = abs(fract(q - 0.5) - 0.5);
    float distToLine = min(grid.x, grid.y);
    float lines = 1.0 - smoothstep(0.0, 0.08, distToLine);
    float cross = sin(p.x * 20.0 + t) * sin(p.y * 20.0 - t);
    return lines * 0.6 + cross * 0.3;
}

// Sine wave surface
float sineSurface(vec2 p, float t) {
    float z = sin(p.x * 5.0 + t) * cos(p.y * 5.0 + t * 0.8);
    z += sin(p.x * 12.0 - t * 2.0) * 0.3;
    z += cos(p.y * 10.0 + t) * 0.3;
    return (z + 1.0) / 2.0;
}

// Fractal pattern (simple)
float fractalPattern(vec2 p, float t) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 3.0;
    for(int i = 0; i < 5; i++) {
        val += amp * sin(p.x * freq + t) * cos(p.y * freq - t * 0.7);
        amp *= 0.5;
        freq *= 2.0;
    }
    return (val + 1.0) / 2.0;
}

// Mathematical heart curve
float heart(vec2 p, float t) {
    p.x = abs(p.x);
    float heartEq = pow(p.x, 2.0) + pow(p.y - 0.5 * sqrt(abs(p.x)), 2.0) - 0.3;
    return 1.0 - smoothstep(0.0, 0.05, abs(heartEq));
}

// ============================================
// COLOR PALETTE (Mathematical gradient)
// ============================================
vec3 palette(float x, float t) {
    // HSL-like mathematical conversion
    float r = sin(x * 6.28318 + t) * 0.5 + 0.5;
    float g = sin(x * 6.28318 + 2.094 + t * 1.3) * 0.5 + 0.5;
    float b = sin(x * 6.28318 + 4.188 + t * 0.7) * 0.5 + 0.5;
    return vec3(r, g, b);
}

vec3 scientificPalette(float x) {
    // Viridis-like mathematical palette
    vec3 a = vec3(0.267, 0.004, 0.329);
    vec3 b = vec3(0.368, 0.669, 0.569);
    vec3 c = vec3(0.5, 0.5, 0.5);
    vec3 d = vec3(0.8, 0.5, 0.2);
    return a + b * cos(6.28318 * (c * x + d));
}

// ============================================
// MAIN RENDER
// ============================================
void main() {
    vec2 uv = (gl_FragCoord.xy - resolution.xy * 0.5) / min(resolution.x, resolution.y);
    uv.x *= resolution.x / resolution.y;
    
    float t = time;
    
    // Mouse controls mathematical parameters
    float zoom = 1.5 + move.y * 1.5;
    float rotation = move.x * 6.28318;
    float mathParam = wheel.y * 2.0;
    
    // Apply zoom
    vec2 p = uv * zoom;
    
    // Apply rotation
    float s = sin(rotation);
    float c = cos(rotation);
    vec2 pr = vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    
    // ============================================
    // MATHEMATICAL EXPRESSIONS
    // ============================================
    
    // 1. Mandelbrot fractal
    vec2 mandelCoord = pr * 1.2 + vec2(-0.5 + mathParam * 0.3, 0.0);
    float mandel = mandelbrot(mandelCoord, 60);
    
    // 2. Julia set (with time-varying constant)
    vec2 juliaC = vec2(0.7885 * cos(t * 0.2), 0.7885 * sin(t * 0.3));
    float juliaVal = julia(pr * 1.5, juliaC, 50);
    
    // 3. Trigonometric wave surface
    float waves = sineSurface(pr, t);
    
    // 4. Polar flower
    float flower = polarFlower(pr, t);
    
    // 5. Spiral
    float spiralVal = spiral(pr, t);
    
    // 6. Fractal noise pattern
    float fractal = fractalPattern(pr, t);
    
    // 7. Mathematical grid
    float grid = mathGrid(pr, t);
    
    // 8. Heart curve
    float heartVal = heart(pr, t);
    
    // Combine expressions with weights
    float expression1 = mandel / 60.0;
    float expression2 = juliaVal / 50.0;
    float expression3 = waves;
    float expression4 = flower;
    float expression5 = spiralVal;
    float expression6 = fractal;
    
    // Mathematical blend based on position and time
    float blend = sin(pr.x * 2.0 + t) * 0.5 + 0.5;
    float blend2 = cos(pr.y * 2.5 - t * 0.8) * 0.5 + 0.5;
    
    float finalPattern = 0.0;
    finalPattern += expression1 * (0.2 + blend * 0.3);
    finalPattern += expression2 * (0.1 + blend2 * 0.2);
    finalPattern += expression3 * 0.2;
    finalPattern += expression4 * (0.15 + sin(t) * 0.05);
    finalPattern += expression5 * 0.1;
    finalPattern += expression6 * 0.15;
    finalPattern += grid * 0.1;
    finalPattern += heartVal * 0.1;
    
    finalPattern = clamp(finalPattern, 0.0, 1.0);
    
    // Add mathematical glow (derivative effect)
    float glow = abs(sin(finalPattern * 30.0 - t * 8.0)) * 0.15;
    finalPattern += glow;
    
    // ============================================
    // COLORING (Mathematical)
    // ============================================
    
    vec3 col;
    
    // Color based on mathematical iteration count
    if(expression1 > 0.3 || expression2 > 0.2) {
        // Fractal colors (scientific palette)
        float iterVal = max(expression1, expression2);
        col = scientificPalette(iterVal);
    } else {
        // Wave and pattern colors
        vec3 col1 = palette(finalPattern + pr.x * 0.5, t);
        vec3 col2 = palette(finalPattern + pr.y * 0.5 + 0.4, t * 0.8);
        col = mix(col1, col2, blend);
    }
    
    // Add flower colors
    col += vec3(0.9, 0.4, 0.6) * expression4 * 0.5;
    
    // Add spiral colors
    col += vec3(0.3, 0.7, 0.9) * expression5 * 0.4;
    
    // Add mathematical formula overlay
    float formulaLines = sin(pr.x * 30.0) * sin(pr.y * 30.0);
    col += vec3(0.8, 0.8, 0.5) * abs(formulaLines) * 0.1;
    
    // Vignette
    float vignette = 1.0 - length(uv * 0.7) * 0.4;
    col *= vignette;
    
    // Color correction
    col = pow(col, vec3(0.85));
    col = clamp(col, 0.0, 1.0);
    
    O = vec4(col, 1.0);
}
`;

// ============================================
// WEBGL2 SETUP
// ============================================

const canvas = document.getElementById('glCanvas');
const textarea = document.getElementById('shaderCodeArea');
const errorDiv = document.getElementById('errorBox');
const resetBtn = document.getElementById('resetViewBtn');
const toggleAnimBtn = document.getElementById('toggleAnimBtn');
const fullResBtn = document.getElementById('fullResBtn');
const led = document.getElementById('statusLed');

textarea.value = DEFAULT_SHADER;

let gl, program = null;
let isAnimating = true;
let animFrame = null;
let startTime = performance.now() / 1000;
let currentTime = 0;
let mouseMove = { x: 0.5, y: 0.5 };
let mouseWheel = { y: 0 };
let resolution = { x: canvas.clientWidth, y: canvas.clientHeight };
let fullResolutionMode = false;

function resizeCanvas() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    if (fullResolutionMode) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
    } else {
        canvas.width = w;
        canvas.height = h;
    }
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    
    resolution.x = canvas.width;
    resolution.y = canvas.height;
    
    if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
}

function compileShader() {
    const source = textarea.value;
    if (!gl) return false;
    
    const vsSource = `#version 300 es
    layout(location=0) in vec2 aPos;
    void main() {
        gl_Position = vec4(aPos, 0.0, 1.0);
    }`;
    
    function createShader(type, src) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            const err = gl.getShaderInfoLog(sh);
            gl.deleteShader(sh);
            throw new Error(err);
        }
        return sh;
    }
    
    try {
        const vs = createShader(gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl.FRAGMENT_SHADER, source);
        const newProg = gl.createProgram();
        gl.attachShader(newProg, vs);
        gl.attachShader(newProg, fs);
        gl.linkProgram(newProg);
        
        if (!gl.getProgramParameter(newProg, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(newProg));
        }
        
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        
        if (program) {
            gl.deleteProgram(program);
        }
        
        program = newProg;
        gl.useProgram(program);
        
        const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        const posLoc = gl.getAttribLocation(program, "aPos");
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        
        errorDiv.style.display = 'none';
        led.style.background = '#3fe48b';
        led.style.boxShadow = '0 0 8px #3fe48b';
        return true;
        
    } catch (err) {
        errorDiv.textContent = '⚠️ ERROR: ' + err.message;
        errorDiv.style.display = 'block';
        led.style.background = '#f55c5c';
        led.style.boxShadow = '0 0 8px #ff7777';
        console.error(err);
        return false;
    }
}

function renderFrame() {
    if (!gl || !program) return;
    
    gl.useProgram(program);
    
    const t = isAnimating ? (performance.now() / 1000 - startTime) : currentTime;
    currentTime = t;
    
    const timeLoc = gl.getUniformLocation(program, "time");
    const resLoc = gl.getUniformLocation(program, "resolution");
    const moveLoc = gl.getUniformLocation(program, "move");
    const wheelLoc = gl.getUniformLocation(program, "wheel");
    
    if (timeLoc !== null) gl.uniform1f(timeLoc, t);
    if (resLoc !== null) gl.uniform2f(resLoc, resolution.x, resolution.y);
    if (moveLoc !== null) gl.uniform2f(moveLoc, mouseMove.x, mouseMove.y);
    if (wheelLoc !== null) gl.uniform2f(wheelLoc, mouseWheel.x, mouseWheel.y);
    
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function renderLoop() {
    if (!isAnimating) {
        animFrame = null;
        return;
    }
    renderFrame();
    animFrame = requestAnimationFrame(renderLoop);
}

function restartShader() {
    if (!gl) return;
    if (compileShader()) {
        resizeCanvas();
        renderFrame();
        if (isAnimating && !animFrame) {
            animFrame = requestAnimationFrame(renderLoop);
        }
    }
}

function initWebGL() {
    gl = canvas.getContext('webgl2', { alpha: false, antialias: true });
    if (!gl) {
        errorDiv.textContent = "FATAL: WebGL2 not supported in your browser!";
        errorDiv.style.display = 'block';
        return false;
    }
    gl.clearColor(0.0, 0.0, 0.05, 1.0);
    return true;
}

function setupEvents() {
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseMove.x = (e.clientX - rect.left) / rect.width;
        mouseMove.y = (e.clientY - rect.top) / rect.height;
        if (program) renderFrame();
    });
    
    canvas.addEventListener('wheel', (e) => {
        mouseWheel.y += e.deltaY * 0.005;
        mouseWheel.y = Math.max(-1.0, Math.min(1.0, mouseWheel.y));
        if (program) renderFrame();
        e.preventDefault();
    });
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        if (program) renderFrame();
    });
    
    resetBtn.onclick = () => {
        mouseMove = { x: 0.5, y: 0.5 };
        mouseWheel = { y: 0 };
        renderFrame();
    };
    
    toggleAnimBtn.onclick = () => {
        isAnimating = !isAnimating;
        toggleAnimBtn.textContent = isAnimating ? "⏸️ Pause" : "▶️ Play";
        if (isAnimating) {
            startTime = performance.now() / 1000 - currentTime;
            renderLoop();
        } else {
            if (animFrame) cancelAnimationFrame(animFrame);
            animFrame = null;
            renderFrame();
        }
    };
    
    fullResBtn.onclick = () => {
        fullResolutionMode = !fullResolutionMode;
        fullResBtn.textContent = fullResolutionMode ? "📱 Std Res" : "🔘 Full Res";
        resizeCanvas();
        renderFrame();
    };
    
    textarea.addEventListener('input', () => {
        restartShader();
    });
}

function start() {
    if (!initWebGL()) return;
    setupEvents();
    restartShader();
    resizeCanvas();
    startTime = performance.now() / 1000;
    currentTime = 0;
    renderLoop();
}

start();