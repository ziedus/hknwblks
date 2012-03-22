// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 頂点シェーダー
var vshader_src =
	"#ifdef GL_ES                                                    \n" +
	"    precision highp float;                                      \n" +
	"#endif                                                          \n" +
	"                                                                \n" +
	"attribute vec3 vs_attr_pos;                                     \n" +
	"attribute vec3 vs_attr_col;                                     \n" +
	"attribute vec2 vs_attr_uvc;                                     \n" +
	"uniform mat4 vs_unif_mat;                                       \n" +
	"                                                                \n" +
	"varying vec4 color;                                             \n" +
	"varying vec2 texCoord;                                          \n" +
	"                                                                \n" +
	"void main() {                                                   \n" +
	"    color       = vec4(vs_attr_col, 1.0);                       \n" +
	"    texCoord    = vs_attr_uvc;                                  \n" +
	"    gl_Position = vs_unif_mat * vec4(vs_attr_pos, 1.0);         \n" +
	"}                                                               \n" +
"";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// フラグメントシェーダー
var fshader_src =
	"#ifdef GL_ES                                                    \n" +
	"    precision highp float;                                      \n" +
	"#endif                                                          \n" +
	"                                                                \n" +
	"uniform float fs_unif_afn;                                      \n" +
	"uniform sampler2D texture;                                      \n" +
	"                                                                \n" +
	"varying vec4 color;                                             \n" +
	"varying vec2 texCoord;                                          \n" +
	"                                                                \n" +
	"void main() {                                                   \n" +
	"    vec4 fragColor = texture2D(texture, texCoord) * color;      \n" +
	"    if(fragColor.a > fs_unif_afn){                              \n" +
	"        gl_FragColor = fragColor;                               \n" +
	"    }else{                                                      \n" +
	"        discard;                                                \n" +
	"    }                                                           \n" +
	"}                                                               \n" +
"";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 簡易3Dエンジンクラス
function Engine3d(){
	this.gl;
	this.shader;
	this.s_pos;
	this.s_col;
	this.s_uvc;
	this.s_mat;
	this.s_afn;
	
	// ----------------------------------------------------------------
	// 初期化
	
	// エンジン初期化
	this.init = function(canvas){
		// コンテキストの獲得
		try{var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");}catch(e){}
		if(!gl){
			alert("WebGL がサポートされていません。");
			return -1;
		}
		
		// 頂点シェーダーの作成
		var vshader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vshader, vshader_src);
		gl.compileShader(vshader);
		if(!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)){
			alert(gl.getShaderInfoLog(vshader));
			return -1;
		}
		
		// フラグメントシェーダーの作成
		var fshader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fshader,  fshader_src);
		gl.compileShader(fshader);
		if(!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)){
			alert(gl.getShaderInfoLog(fshader));
			return -1;
		}
		
		// プログラムオブジェクトを作成
		this.shader = gl.createProgram();
		gl.attachShader(this.shader, vshader);
		gl.attachShader(this.shader, fshader);
		
		// 頂点シェーダーとフラグメントシェーダーをリンクする
		gl.linkProgram(this.shader);
		if(!gl.getProgramParameter(this.shader, gl.LINK_STATUS)){
			alert(gl.getProgramInfoLog(this.shader));
			return -1;
		}
		
		// シェーダー内の変数を頂点属性に結びつける
		this.s_pos = gl.getAttribLocation(this.shader, "vs_attr_pos");
		this.s_col = gl.getAttribLocation(this.shader, "vs_attr_col");
		this.s_uvc = gl.getAttribLocation(this.shader, "vs_attr_uvc");
		// シェーダーパラメータのインデックスを取得保存
		this.s_mat = gl.getUniformLocation(this.shader, "vs_unif_mat");
		this.s_afn = gl.getUniformLocation(this.shader, "fs_unif_afn");
		
		// opengl描画設定
		gl.clearColor(1, 1, 1, 1);
		gl.clearDepth(1000);
		// カリング
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		// シェーダーを指定
		gl.useProgram(this.shader);
		
		this.gl = gl;
		return 0;
	}
	
	// ----------------------------------------------------------------
	// モデル作成
	
	// VBO作成
	this.createVBO = function(vertices){
		var gl = this.gl;
		var vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		return vertexBuffer;
	}
	
	// IBO作成
	this.createIBO = function(indexes){
		var gl = this.gl;
		var indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(indexes), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		return indexBuffer;
	}
	
	// バッファ除去
	this.deleteBuffer = function(buffer){
		var gl = this.gl;
		gl.deleteBuffer(buffer);
	}
	
	// キャンバスからテクスチャ作成
	this.createTexture = function(canvas, texture){
		var gl = this.gl;
		// テクスチャーオブジェクトを作成
		if(typeof texture == "undefined"){var texture = gl.createTexture();}
		gl.enable(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
		return texture;
	}
	
	// 画像からテクスチャ読込み
	this.loadTexture = function(url){
		var that = this;
		var texture = this.gl.createTexture();
		var image = new Image();
		// 画像の読み込み 完了時テクスチャ作成
		image.onload = function(){that.createTexture(image, texture);}
		image.src = url;
		return texture;
	}
	
	// ----------------------------------------------------------------
	// 描画処理
	
	// 描画のクリア
	this.clear = function(){
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}
	
	// デプステスト設定
	this.setDepthMode = function(flag){
		var gl = this.gl;
		if(flag){
			gl.enable(gl.DEPTH_TEST);
		}else{
			gl.disable(gl.DEPTH_TEST);
		}
	}
	
	// アルファ設定
	this.setAlphaMode = function(mode){
		var gl = this.gl;
		if(mode > 0){
			gl.uniform1f(this.s_afn, 0.0);
			gl.enable(gl.BLEND);
			gl.depthMask(false);
			switch(mode){
				case 0: gl.blendFunc(gl.ONE, gl.ZERO); // 上書き
				case 1: gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); break; // 半透明アルファ合成
				case 2: gl.blendFunc(gl.SRC_ALPHA, gl.ONE); break; // 加算合成
			}
		}else{
			// アルファ合成なし
			gl.disable(gl.BLEND);
			gl.depthMask(true);
			gl.uniform1f(this.s_afn, 0.8);
		}
	}
	
	// 行列の設定
	this.setMatrix = function(matrix){
		var matrixArray = new Float32Array([
			matrix._11, matrix._12, matrix._13, matrix._14,
			matrix._21, matrix._22, matrix._23, matrix._24,
			matrix._31, matrix._32, matrix._33, matrix._34,
			matrix._41, matrix._42, matrix._43, matrix._44,
		]);
		this.gl.uniformMatrix4fv(this.s_mat, false, matrixArray);
	}
	
	// テクスチャを指定
	this.bindTex = function(texture, type){
		var gl = this.gl;
		gl.enable(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		if(type == 1){
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		}else{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		}
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}
	
	// VBO登録
	this.bindBuf = function(vertVBO, clorVBO, texcVBO, faceIBO){
		this.bindVertBuf(vertVBO);
		this.bindClorBuf(clorVBO);
		this.bindTexcBuf(texcVBO);
		this.bindFaceBuf(faceIBO);
	}
	
	// VBO登録 頂点座標
	this.bindVertBuf = function(vertVBO){
		var gl = this.gl;
		gl.enableVertexAttribArray(this.s_pos);
		gl.bindBuffer(gl.ARRAY_BUFFER, vertVBO);
		gl.vertexAttribPointer(this.s_pos, 3, gl.FLOAT, false, 0, 0);
	}
	
	// VBO登録 カラー
	this.bindClorBuf = function(clorVBO){
		var gl = this.gl;
		gl.enableVertexAttribArray(this.s_col);
		gl.bindBuffer(gl.ARRAY_BUFFER, clorVBO);
		gl.vertexAttribPointer(this.s_col, 3, gl.FLOAT, false, 0, 0);
	}
	
	// VBO登録 テクスチャ座標
	this.bindTexcBuf = function(texcVBO){
		var gl = this.gl;
		gl.enableVertexAttribArray(this.s_uvc);
		gl.bindBuffer(gl.ARRAY_BUFFER, texcVBO);
		gl.vertexAttribPointer(this.s_uvc, 2, gl.FLOAT, false, 0, 0);
	}
	
	// IBO登録 頂点インデックス
	this.bindFaceBuf = function(faceIBO){
		var gl = this.gl;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceIBO);
	}
	
	// 描画
	this.draw = function(offset, count){
		var gl = this.gl;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, offset * Uint16Array.BYTES_PER_ELEMENT);
	}
	
	// 描画の反映
	this.flush = function(){
		this.gl.flush();
	}
	
	// ----------------------------------------------------------------
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 行列クラス
// openGLと同じ右手座標系のつもりだが...?
//[ x ][ _11, _12, _13, _14 ]
//[ y ][ _21, _22, _23, _24 ]
//[ z ][ _31, _32, _33, _34 ]
//[ w ][ _41, _42, _43, _44 ]
function Matrix(){
	// ----------------------------------------------------------------
	// 初期化
	
	// 単位行列
	this.identity = function(){
		this._12 = this._13 = this._14 = 0;
		this._21 = this._23 = this._24 = 0;
		this._31 = this._32 = this._34 = 0;
		this._41 = this._42 = this._43 = 0;
		this._11 = this._22 = this._33 = this._44 = 1;
	}
	
	// 行列の複製
	this.copy = function(m){
		this._11 = m._11;
		this._12 = m._12;
		this._13 = m._13;
		this._14 = m._14;
		this._21 = m._21;
		this._22 = m._22;
		this._23 = m._23;
		this._24 = m._24;
		this._31 = m._31;
		this._32 = m._32;
		this._33 = m._33;
		this._34 = m._34;
		this._41 = m._41;
		this._42 = m._42;
		this._43 = m._43;
		this._44 = m._44;
	}
	
	this.identity();
	
	// ----------------------------------------------------------------
	// 行列の掛け合わせ
	
	// 行列の掛け合わせ m0 * m1
	this.mul = function(m0, m1){
		this._11 = m0._11 * m1._11 + m0._12 * m1._21 + m0._13 * m1._31 + m0._14 * m1._41;
		this._12 = m0._11 * m1._12 + m0._12 * m1._22 + m0._13 * m1._32 + m0._14 * m1._42;
		this._13 = m0._11 * m1._13 + m0._12 * m1._23 + m0._13 * m1._33 + m0._14 * m1._43;
		this._14 = m0._11 * m1._14 + m0._12 * m1._24 + m0._13 * m1._34 + m0._14 * m1._44;
		this._21 = m0._21 * m1._11 + m0._22 * m1._21 + m0._23 * m1._31 + m0._24 * m1._41;
		this._22 = m0._21 * m1._12 + m0._22 * m1._22 + m0._23 * m1._32 + m0._24 * m1._42;
		this._23 = m0._21 * m1._13 + m0._22 * m1._23 + m0._23 * m1._33 + m0._24 * m1._43;
		this._24 = m0._21 * m1._14 + m0._22 * m1._24 + m0._23 * m1._34 + m0._24 * m1._44;
		this._31 = m0._31 * m1._11 + m0._32 * m1._21 + m0._33 * m1._31 + m0._34 * m1._41;
		this._32 = m0._31 * m1._12 + m0._32 * m1._22 + m0._33 * m1._32 + m0._34 * m1._42;
		this._33 = m0._31 * m1._13 + m0._32 * m1._23 + m0._33 * m1._33 + m0._34 * m1._43;
		this._34 = m0._31 * m1._14 + m0._32 * m1._24 + m0._33 * m1._34 + m0._34 * m1._44;
		this._41 = m0._41 * m1._11 + m0._42 * m1._21 + m0._43 * m1._31 + m0._44 * m1._41;
		this._42 = m0._41 * m1._12 + m0._42 * m1._22 + m0._43 * m1._32 + m0._44 * m1._42;
		this._43 = m0._41 * m1._13 + m0._42 * m1._23 + m0._43 * m1._33 + m0._44 * m1._43;
		this._44 = m0._41 * m1._14 + m0._42 * m1._24 + m0._43 * m1._34 + m0._44 * m1._44;
	}
	
	// 平行移動行列の掛け合わせ
	//[  1,  0,  0,  0 ][ _11, _12, _13, _14 ]
	//[  0,  1,  0,  0 ][ _21, _22, _23, _24 ]
	//[  0,  0,  1,  0 ][ _31, _32, _33, _34 ]
	//[  x,  y,  z,  1 ][ _41, _42, _43, _44 ]
	this.mulTranslate = function(x, y, z){
		var temp41 = this._11 * x + this._21 * y + this._31 * z + this._41;
		var temp42 = this._12 * x + this._22 * y + this._32 * z + this._42;
		var temp43 = this._13 * x + this._23 * y + this._33 * z + this._43;
		var temp44 = this._14 * x + this._24 * y + this._34 * z + this._44;
		this._41 = temp41;
		this._42 = temp42;
		this._43 = temp43;
		this._44 = temp44;
	}
	
	// 拡大縮小行列の掛け合わせ
	//[  x,  0,  0,  0 ][ _11, _12, _13, _14 ]
	//[  0,  y,  0,  0 ][ _21, _22, _23, _24 ]
	//[  0,  0,  z,  0 ][ _31, _32, _33, _34 ]
	//[  0,  0,  0,  1 ][ _41, _42, _43, _44 ]
	this.mulScale = function(x, y, z){
		this._11 *= x;
		this._12 *= x;
		this._13 *= x;
		this._14 *= x;
		this._21 *= y;
		this._22 *= y;
		this._23 *= y;
		this._24 *= y;
		this._31 *= z;
		this._32 *= z;
		this._33 *= z;
		this._34 *= z;
	}
	
	// x軸中心回転行列の掛け合わせ
	//[  1,  0,  0,  0 ][ _11, _12, _13, _14 ]
	//[  0,  c,  s,  0 ][ _21, _22, _23, _24 ]
	//[  0, -s,  c,  0 ][ _31, _32, _33, _34 ]
	//[  0,  0,  0,  1 ][ _41, _42, _43, _44 ]
	this.mulRotX = function(r){
		var mr22 = Math.cos(r)
		var mr23 = Math.sin(r)
		var mr32 = -mr23;
		var mr33 = mr22;
		var temp21 = mr22 * this._21 + mr23 * this._31
		var temp22 = mr22 * this._22 + mr23 * this._32
		var temp23 = mr22 * this._23 + mr23 * this._33
		var temp24 = mr22 * this._24 + mr23 * this._34
		var temp31 = mr32 * this._21 + mr33 * this._31
		var temp32 = mr32 * this._22 + mr33 * this._32
		var temp33 = mr32 * this._23 + mr33 * this._33
		var temp34 = mr32 * this._24 + mr33 * this._34
		this._21 = temp21;
		this._22 = temp22;
		this._23 = temp23;
		this._24 = temp24;
		this._31 = temp31;
		this._32 = temp32;
		this._33 = temp33;
		this._34 = temp34;
	}
	
	// y軸中心回転行列の掛け合わせ
	//[  c,  0, -s,  0 ][ _11, _12, _13, _14 ]
	//[  0,  1,  0,  0 ][ _21, _22, _23, _24 ]
	//[  s,  0,  c,  0 ][ _31, _32, _33, _34 ]
	//[  0,  0,  0,  1 ][ _41, _42, _43, _44 ]
	this.mulRotY = function(r){
		var mr33 = Math.cos(r)
		var mr31 = Math.sin(r)
		var mr13 = -mr31;
		var mr11 = mr33;
		var temp11 = mr11 * this._11 + mr13 * this._31;
		var temp12 = mr11 * this._12 + mr13 * this._32;
		var temp13 = mr11 * this._13 + mr13 * this._33;
		var temp14 = mr11 * this._14 + mr13 * this._34;
		var temp31 = mr31 * this._11 + mr33 * this._31;
		var temp32 = mr31 * this._12 + mr33 * this._32;
		var temp33 = mr31 * this._13 + mr33 * this._33;
		var temp34 = mr31 * this._14 + mr33 * this._34;
		this._11 = temp11;
		this._12 = temp12;
		this._13 = temp13;
		this._14 = temp14;
		this._31 = temp31;
		this._32 = temp32;
		this._33 = temp33;
		this._34 = temp34;
	}
	
	// z軸中心回転行列の掛け合わせ
	//[  c,  s,  0,  0 ][ _11, _12, _13, _14 ]
	//[ -s,  c,  0,  0 ][ _21, _22, _23, _24 ]
	//[  0,  0,  1,  0 ][ _31, _32, _33, _34 ]
	//[  0,  0,  0,  1 ][ _41, _42, _43, _44 ]
	this.mulRotZ = function(r){
		var mr11 = Math.cos(r)
		var mr12 = Math.sin(r)
		var mr21 = -mr12;
		var mr22 = mr11;
		var temp11 = mr11 * this._11 + mr12 * this._21;
		var temp12 = mr11 * this._12 + mr12 * this._22;
		var temp13 = mr11 * this._13 + mr12 * this._23;
		var temp14 = mr11 * this._14 + mr12 * this._24;
		var temp21 = mr21 * this._11 + mr22 * this._21;
		var temp22 = mr21 * this._12 + mr22 * this._22;
		var temp23 = mr21 * this._13 + mr22 * this._23;
		var temp24 = mr21 * this._14 + mr22 * this._24;
		this._11 = temp11;
		this._12 = temp12;
		this._13 = temp13;
		this._14 = temp14;
		this._21 = temp21;
		this._22 = temp22;
		this._23 = temp23;
		this._24 = temp24;
	}
	
	// ----------------------------------------------------------------
	// 行列の作成
	
	// 透視射影行列作成
	this.frustum = function(w, h, z_near, z_far){
		this._12 = this._13 = this._14 = 0;
		this._21 = this._23 = this._24 = 0;
		this._31 = this._32 = 0;
		this._41 = this._42 = 0;
		this._11 = 2 * z_near / w;
		this._22 = 2 * z_near / h;
		this._33 = -(z_far + z_near) / (z_far - z_near);
		this._34 = -1;
		this._43 = -2 * z_near * z_far / (z_far - z_near);
		this._44 = 0;
	}
	
	// 正射影行列作成
	this.ortho = function(x, y, w, h){
		this._12 = this._13 = this._14 = 0;
		this._21 = this._23 = this._24 = 0;
		this._31 = this._32 = this._34 = 0;
		this._43 = 0;
		this._33 = this._44 = 1;
		this._11 =  2 / w;
		this._22 = -2 / h;
		this._41 = -2 * x / w - 1;
		this._42 =  2 * y / h + 1;
	}
	
	// 4*4行列の逆行列作成
	this.inverse = function(m){
		this._11 =  m._22 * (m._33 * m._44 - m._34 * m._43) + m._23 * (m._34 * m._42 - m._32 * m._44) + m._24 * (m._32 * m._43 - m._33 * m._42);
		this._12 = -m._32 * (m._43 * m._14 - m._44 * m._13) - m._33 * (m._44 * m._12 - m._42 * m._14) - m._34 * (m._42 * m._13 - m._43 * m._12);
		this._13 =  m._42 * (m._13 * m._24 - m._14 * m._23) + m._43 * (m._14 * m._22 - m._12 * m._24) + m._44 * (m._12 * m._23 - m._13 * m._22);
		this._14 = -m._12 * (m._23 * m._34 - m._24 * m._33) - m._13 * (m._24 * m._32 - m._22 * m._34) - m._14 * (m._22 * m._33 - m._23 * m._32);
		this._21 = -m._23 * (m._34 * m._41 - m._31 * m._44) - m._24 * (m._31 * m._43 - m._33 * m._41) - m._21 * (m._33 * m._44 - m._34 * m._43);
		this._22 =  m._33 * (m._44 * m._11 - m._41 * m._14) + m._34 * (m._41 * m._13 - m._43 * m._11) + m._31 * (m._43 * m._14 - m._44 * m._13);
		this._23 = -m._43 * (m._14 * m._21 - m._11 * m._24) - m._44 * (m._11 * m._23 - m._13 * m._21) - m._41 * (m._13 * m._24 - m._14 * m._23);
		this._24 =  m._13 * (m._24 * m._31 - m._21 * m._34) + m._14 * (m._21 * m._33 - m._23 * m._31) + m._11 * (m._23 * m._34 - m._24 * m._33);
		this._31 =  m._24 * (m._31 * m._42 - m._32 * m._41) + m._21 * (m._32 * m._44 - m._34 * m._42) + m._22 * (m._34 * m._41 - m._31 * m._44);
		this._32 = -m._34 * (m._41 * m._12 - m._42 * m._11) - m._31 * (m._42 * m._14 - m._44 * m._12) - m._32 * (m._44 * m._11 - m._41 * m._14);
		this._33 =  m._44 * (m._11 * m._22 - m._12 * m._21) + m._41 * (m._12 * m._24 - m._14 * m._22) + m._42 * (m._14 * m._21 - m._11 * m._24);
		this._34 = -m._14 * (m._21 * m._32 - m._22 * m._31) - m._11 * (m._22 * m._34 - m._24 * m._32) - m._12 * (m._24 * m._31 - m._21 * m._34);
		this._41 = -m._21 * (m._32 * m._43 - m._33 * m._42) - m._22 * (m._33 * m._41 - m._31 * m._43) - m._23 * (m._31 * m._42 - m._32 * m._41);
		this._42 =  m._31 * (m._42 * m._13 - m._43 * m._12) + m._32 * (m._43 * m._11 - m._41 * m._13) + m._33 * (m._41 * m._12 - m._42 * m._11);
		this._43 = -m._41 * (m._12 * m._23 - m._13 * m._22) - m._42 * (m._13 * m._21 - m._11 * m._23) - m._43 * (m._11 * m._22 - m._12 * m._21);
		this._44 =  m._11 * (m._22 * m._33 - m._23 * m._32) + m._12 * (m._23 * m._31 - m._21 * m._33) + m._13 * (m._21 * m._32 - m._22 * m._31);
		var det =  m._11 * this._11 + m._21 * this._12 + m._31 * this._13 + m._41 * this._14;
		if(det == 0){return -1;}
		var idet = 1 / det;
		this._11 *= idet; this._12 *= idet; this._13 *= idet; this._14 *= idet;
		this._21 *= idet; this._22 *= idet; this._23 *= idet; this._24 *= idet;
		this._31 *= idet; this._32 *= idet; this._33 *= idet; this._34 *= idet;
		this._41 *= idet; this._42 *= idet; this._43 *= idet; this._44 *= idet;
		return 0;
	}
	
	// 四元数回転行列作成
	this.qRotate = function(q){
		var xx = q.x * q.x;
		var yy = q.y * q.y;
		var zz = q.z * q.z;
		var xy = q.x * q.y;
		var yz = q.y * q.z;
		var zx = q.z * q.x;
		var wx = q.w * q.x;
		var wy = q.w * q.y;
		var wz = q.w * q.z;
		this._11 = 1 - 2 * (yy + zz);
		this._12 =     2 * (xy + wz);
		this._13 =     2 * (zx - wy);
		this._21 =     2 * (xy - wz);
		this._22 = 1 - 2 * (zz + xx);
		this._23 =     2 * (yz + wx);
		this._31 =     2 * (zx + wy);
		this._32 =     2 * (yz - wx);
		this._33 = 1 - 2 * (xx + yy);
		this._14 = this._24 = this._34 = 0;
		this._41 = this._42 = this._43 = 0;
		this._44 = 1;
	}
	
	// ----------------------------------------------------------------
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 四元数クラス
function Quaternion(){
	// ----------------------------------------------------------------
	// 初期化
	
	// 単位四元数
	this.identity = function(){
		this.w = 1;
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
	
	// 四元数の複製
	this.copy = function(q){
		this.w = q.w;
		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
	}
	
	this.identity();
	
	// ----------------------------------------------------------------
	// 四元数の掛け合わせ
	
	// 四元数の掛け合わせ q0 * q1
	this.mul = function(q0, q1){
		this.w = q0.w * q1.w - q0.x * q1.x - q0.y * q1.y - q0.z * q1.z;
		this.x = q0.w * q1.x + q0.x * q1.w - q0.y * q1.z + q0.z * q1.y;
		this.y = q0.w * q1.y + q0.x * q1.z + q0.y * q1.w - q0.z * q1.x;
		this.z = q0.w * q1.z - q0.x * q1.y + q0.y * q1.x + q0.z * q1.w;
	}
	
	// 回転の四元数の掛け合わせ
	this.mulRot = function(r, x, y, z){
		var s = Math.sin(r / 2) / Math.sqrt(x * x + y * y + z * z);
		rw = Math.cos(r / 2);
		rx = s * x;
		ry = s * y;
		rz = s * z;
		var tw = this.w;
		var tx = this.x;
		var ty = this.y;
		var tz = this.z;
		this.w = tw * rw - tx * rx - ty * ry - tz * rz;
		this.x = tw * rx + tx * rw - ty * rz + tz * ry;
		this.y = tw * ry + tx * rz + ty * rw - tz * rx;
		this.z = tw * rz - tx * ry + ty * rx + tz * rw;
	}
	
	// ----------------------------------------------------------------
	// 四元数の作成
	
	// 回転の四元数作成
	this.rotate = function(r, x, y, z){
		var s = Math.sin(r / 2) / Math.sqrt(x * x + y * y + z * z);
		this.w = Math.cos(r / 2);
		this.x = s * x;
		this.y = s * y;
		this.z = s * z;
	}
	
	// 球面線形補間
	this.sleap = function(t, q0, q1){
		var r = q0.w * q1.w + q0.x * q1.x + q0.y * q1.y + q0.z * q1.z;
		var s = 1 - r * r;
		if(s == 0){
			this.w = q0.w;
			this.x = q0.x;
			this.y = q0.y;
			this.z = q0.z;
		}else{
			var sp = Math.sqrt(s);
			var ph = Math.acos(r);
			var pt = ph * t;
			var t1 = Math.sin(pt) / sp;
			var t0 = Math.sin(ph - pt) / sp;
			this.w = q0.w * t0 + q1.w * t1;
			this.x = q0.x * t0 + q1.x * t1;
			this.y = q0.y * t0 + q1.y * t1;
			this.z = q0.z * t0 + q1.z * t1;
		}
	}
	
	// ----------------------------------------------------------------
	// ユーティリティ
	
	// 正規化的な関数
	this.hoge = function(){
		
	}
	
	// ----------------------------------------------------------------
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

