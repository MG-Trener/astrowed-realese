(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43509,e=>{"use strict";let t=`
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`,r=`
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform sampler2D galaxy;

mat2 turn(float a) { float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float hash(vec3 p) {
  p=fract(p*.3183099+vec3(.13,.27,.41)); p*=17.0;
  return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
}
float noise(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
                 mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                 mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p) {
  float f=0.0, a=.55;
  for(int i=0;i<4;i++) { f+=a*noise(p); p=p*2.03+vec3(3.1,7.4,1.7); a*=.49; }
  return f;
}

vec3 galaxyLight(vec2 p, float inclination, float angle, float seed) {
  p=turn(angle)*p; p.y/=inclination;
  float r=length(p);
  if(r>1.08) return vec3(0);
  // Differential rotation: inner stars orbit faster than the outer arms.
  vec2 orbit=turn(time*.009+sin(time*.018)*.13/(.4+sqrt(r+.01))+seed)*p;
  vec2 drift=vec2(noise(vec3(orbit*9.0,time*.035)),noise(vec3(orbit*9.0+4.0,time*.025)))-.5;
  vec2 uv=.5+orbit*.48+drift*.006*smoothstep(.12,.65,r);
  vec3 light=texture2D(galaxy,clamp(uv,.001,.999)).rgb;
  float grain=fbm(vec3(orbit*35.0,time*.03+seed));
  light*=.85+.3*grain;
  // A thin moving ionised-dust veil, with a separate warm central bulge.
  light+=vec3(.2,.29,.42)*pow(grain,5.0)*exp(-r*3.0)*.2;
  light+=vec3(1.0,.74,.43)*exp(-r*r*190.0)*.06;
  return light*(1.0-smoothstep(.72,1.05,r));
}

void main() {
  vec2 uv=gl_FragCoord.xy/resolution;
  uv.y=1.0-uv.y;
  float unit=min(resolution.x,resolution.y);
  vec2 ratio=resolution/unit;
  vec3 col=galaxyLight((uv-vec2(.12,.15))*ratio/.72,.66,-.42,0.0)*.4;
  col+=galaxyLight((uv-vec2(.93,.88))*ratio/.64,.36,.58,2.8)*.32;
  // Reduce luminance behind the main reading column; retain detail at the edges.
  col*=1.0-.3*exp(-pow((uv.x-.5)*3.2,2.0));
  col=1.0-exp(-col*1.25);
  gl_FragColor=vec4(col,1.0);
}
`;e.s(["createSkyRenderer",0,function(e,a){let i=e.getContext("webgl",{alpha:!1,antialias:!1,depth:!1,stencil:!1,powerPreference:"low-power"});if(!i)throw Error("WebGL is unavailable");let o=[],n=null,l=null,c=null,h=()=>{c&&i.deleteTexture(c),l&&i.deleteBuffer(l),n&&i.deleteProgram(n),o.forEach(e=>i.deleteShader(e))};try{for(let[e,a]of[[i.VERTEX_SHADER,t],[i.FRAGMENT_SHADER,r]]){let t=i.createShader(e);if(!t)throw Error("Cannot allocate sky shader");if(o.push(t),i.shaderSource(t,a),i.compileShader(t),!i.getShaderParameter(t,i.COMPILE_STATUS))throw Error(i.getShaderInfoLog(t)||"Sky shader compilation failed")}if(!(n=i.createProgram()))throw Error("Cannot allocate sky program");if(o.forEach(e=>i.attachShader(n,e)),i.linkProgram(n),!i.getProgramParameter(n,i.LINK_STATUS))throw Error(i.getProgramInfoLog(n)||"Sky shader link failed");if(i.useProgram(n),l=i.createBuffer(),c=i.createTexture(),!l||!c)throw Error("Cannot allocate sky resources");i.bindBuffer(i.ARRAY_BUFFER,l),i.bufferData(i.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),i.STATIC_DRAW);let f=i.getAttribLocation(n,"position");i.enableVertexAttribArray(f),i.vertexAttribPointer(f,2,i.FLOAT,!1,0,0),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,c),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,a),i.uniform1i(i.getUniformLocation(n,"galaxy"),0);let s=i.getUniformLocation(n,"time"),u=i.getUniformLocation(n,"resolution");return{resize(t,r){let a=Math.min(1,(t<600?640:1100)/Math.max(t,r));e.width=Math.max(1,Math.round(t*a)),e.height=Math.max(1,Math.round(r*a)),i.viewport(0,0,e.width,e.height),i.uniform2f(u,e.width,e.height)},draw(e){i.uniform1f(s,e),i.drawArrays(i.TRIANGLES,0,6)},dispose:h}}catch(e){throw h(),e}}])}]);