const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl");

canvas.width = innerWidth;
canvas.height = innerHeight;

if (!gl) {
    alert("WebGL not supported");
}

const vertexShaderSrc = `
attribute vec2 aPos;
void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const fragmentShaderSrc = `
precision highp float;

uniform float uTime;
uniform vec2 uRes;

// SIMPLE COLOR ANIMATION (this guarantees a non-black result)
// Once confirmed working, I will replace this with your fractal mandala
void main() {
    vec2 uv = gl_FragCoord.xy / uRes.xy;
    float r = 0.5 + 0.5 * sin(uTime + uv.x * 10.0);
    float g = 0.5 + 0.5 * sin(uTime * 0.7 + uv.y * 12.0);
    float b = 0.5 + 0.5 * sin(uTime * 1.3 + uv.x * 14.0 + uv.y * 20.0);
    gl_FragColor = vec4(r, g, b, 1.0);
}
`;

function compileShader(src, type) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
    }
    return sh;
}

const vs = compileShader(vertexShaderSrc, gl.VERTEX_SHADER);
const fs = compileShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);

const prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
gl.useProgram(prog);

const aPos = gl.getAttribLocation(prog, "aPos");
const quad = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1
]);
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

const uTime = gl.getUniformLocation(prog, "uTime");
const uRes = gl.getUniformLocation(prog, "uRes");

function render(t) {
    gl.uniform1f(uTime, t * 0.001);
    gl.uniform2f(uRes, canvas.width, canvas.height);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}

render(0);
