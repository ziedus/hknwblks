// ビルボードによるキャラクタ表示クラス
function BillboardCharacter(){
	this.vertBuffer;
	this.clorBuffer;
	this.faceBuffer;
	this.texcBufferList;
	
	// ----------------------------------------------------------------
	// 初期化
	this.init = function(e3d){
		var vert = new Array();
		var clor = new Array();
		var face = new Array();
		vert.push( 0.5, 1.0, 0.0);
		vert.push(-0.5, 1.0, 0.0);
		vert.push(-0.5, 0.0, 0.0);
		vert.push( 0.5, 0.0, 0.0);
		clor.push(1.0, 1.0, 1.0);
		clor.push(1.0, 1.0, 1.0);
		clor.push(1.0, 1.0, 1.0);
		clor.push(1.0, 1.0, 1.0);
		face.push(0, 1, 2);
		face.push(0, 2, 3);
		// VBOとIBOを作成し、データを転送
		this.vertBuffer = e3d.createVBO(vert);
		this.clorBuffer = e3d.createVBO(clor);
		this.faceBuffer = e3d.createIBO(face);
		
		// テクスチャバッファリスト
		this.texcBufferList = new Array();
		for(var i = 0; i < 4; i++){
			for(var j = 0; j < 4; j++){
				var texc = new Array();
				var u0 = 0.25 * i;
				var v0 = 0.25 * j;
				var u1 = u0 + 0.25;
				var v1 = v0 + 0.25;
				texc.push(u1, v0);
				texc.push(u0, v0);
				texc.push(u0, v1);
				texc.push(u1, v1);
				// VBOを作成し、データを転送
				this.texcBufferList[i * 4 + j] = e3d.createVBO(texc);
			}
		}
	}
	
	// ----------------------------------------------------------------
	// 描画
	var tmpmat = new Matrix();
	this.draw = function(e3d, mat, ctrl, rotate, action, x, y, z, size){
		// 歩行アクション
		var index = 0;
		if(action > 0){
			switch(Math.floor(action / 4) % 4){
				case 0: index = 4; break;
				case 2: index = 12; break;
				default: index = 8; break;
			}
		}
		// 回転
		rotate = (rotate - ctrl.rotv) / Math.PI * 180;
		while(rotate > 360 - 45){rotate -= 360;}
		while(rotate <=  0 - 45){rotate += 360;}
		if(rotate < 45){index += 3;}
		else if(rotate <= 135){index += 0;}
		else if(rotate < 225){index += 1;}
		else{index += 2;}
		// 行列作成
		tmpmat.copy(mat);
		tmpmat.mulTranslate(x, z, y);
		tmpmat.mulRotY(-ctrl.rotv);
		tmpmat.mulScale(size, size, size);
		e3d.setMatrix(tmpmat);
		// 描画
		e3d.bindBuf(this.vertBuffer, this.clorBuffer, this.texcBufferList[index], this.faceBuffer);
		e3d.draw(0, 6);
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// ビルボードでできたボールの組み合わせによるキャラクタ表示クラス
function BillballCharacter(){
	this.vertBuffer;
	this.clorBuffer;
	this.faceBuffer;
	this.texBufStruct_head;
	this.texBufStruct_body;
	this.texBufStruct_foot1;
	this.texBufStruct_foot2;
	this.texBufStruct_hand;
	this.texBufStruct_hairr;
	this.texBufStruct_hairl;
	this.texBufStruct_tail;
	
	// ----------------------------------------------------------------
	// 初期化
	this.init = function(e3d){
		var vert = new Array();
		var clor = new Array();
		var face = new Array();
		vert.push( 0.5,  0.5, 0.0);
		vert.push(-0.5,  0.5, 0.0);
		vert.push(-0.5, -0.5, 0.0);
		vert.push( 0.5, -0.5, 0.0);
		clor.push(1.0, 1.0, 1.0);
		clor.push(1.0, 1.0, 1.0);
		clor.push(1.0, 1.0, 1.0);
		clor.push(1.0, 1.0, 1.0);
		face.push(0, 1, 2);
		face.push(0, 2, 3);
		// VBOとIBOを作成し、データを転送
		this.vertBuffer = e3d.createVBO(vert);
		this.clorBuffer = e3d.createVBO(clor);
		this.faceBuffer = e3d.createIBO(face);
		
		// テクスチャバッファ構造体
		var texuv = function(u0, v0, uw, vh){
			var texc = new Array();
			var u1 = u0 + uw;
			var v1 = v0 + vh;
			texc.push(u1, v0);
			texc.push(u0, v0);
			texc.push(u0, v1);
			texc.push(u1, v1);
			// VBOを作成し、データを転送
			var texcBuffer = e3d.createVBO(texc);
			this.getbuf = function(){return texcBuffer;}
		}
		// テクスチャバッファリスト構造体
		var texuvList = function(u0, v0, uw, vh, swap){
			var texcBufferList = new Array();
			for(var i = 0; i < 12; i++){
				var texc = new Array();
				var iw = (i % 4);
				var ih =  Math.floor(i / 4)
				if(swap){iw = (4 - iw) % 4;}
				var u1 = u0 + uw * iw;
				var v1 = v0 + vh * ih;
				var u2 = u1 + uw;
				var v2 = v1 + vh;
				if(swap){var tmp = u1; u1 = u2; u2 = tmp;}
				texc.push(u2, v1);
				texc.push(u1, v1);
				texc.push(u1, v2);
				texc.push(u2, v2);
				// VBOを作成し、データを転送
				texcBufferList[i] = e3d.createVBO(texc);
			}
			this.getbuf = function(h, v){return texcBufferList[h * 4 + v];}
		}
		// 各パーツのテクスチャバッファリスト
		this.texBufStruct_head = new texuvList(0.0, 0.000, 0.125, 0.125, 0);
		this.texBufStruct_body = new texuvList(0.0, 0.375, 0.125, 0.125, 0);
		this.texBufStruct_foot1 = new texuvList(0.00, 0.75, 0.0625, 0.0625, 0);
		this.texBufStruct_foot2 = new texuvList(0.25, 0.75, 0.0625, 0.0625, 0);
		this.texBufStruct_hand = new texuv(0, 0.9375, 0.0625, 0.0625);
		this.texBufStruct_hairr = new texuvList(0.5, 0.000, 0.125, 0.125, 0);
		this.texBufStruct_hairl = new texuvList(0.5, 0.000, 0.125, 0.125, 1);
		this.texBufStruct_tail = new texuvList(0.5, 0.375, 0.125, 0.125, 0);
	}
	
	// ----------------------------------------------------------------
	// 描画
	var tmpmat1 = new Matrix();
	var tmpmat2 = new Matrix();
	this.draw = function(e3d, mat, ctrl, rotate, action, x, y, z, size){
		// 行列作成
		tmpmat1.copy(mat);
		tmpmat1.mulTranslate(x, z, y);
		tmpmat1.mulRotY(-rotate);
		tmpmat1.mulScale(size, size, size);
		
		// テクスチャ水平軸角度フレーム
		var angleh = 180 / Math.PI * ctrl.roth;
		if(angleh < -30){angleh = 2;}else if(angleh < 30){angleh = 1;}else{angleh = 0;}
		// テクスチャ垂直軸角度フレーム
		var anglev = 45 + 180 / Math.PI * (ctrl.rotv - rotate);
		while(anglev > 360){anglev -= 360;} while(anglev <= 0){anglev += 360;}
		if(anglev < 90){anglev = 1;}else if(anglev <= 180){anglev = 2;}else if(anglev < 270){anglev = 3;}else{anglev = 0;}
		
		// 描画関数
		var drawParts = function(texBufStruct, size, x, y, z, rot, transposed){
			tmpmat2.copy(tmpmat1);
			tmpmat2.mulTranslate(x, z, y);
			tmpmat2.mulRotY(-ctrl.rotv + rotate);
			tmpmat2.mulRotX(-ctrl.roth);
			if(!transposed){
				var temph = angleh;
				var tempv = (anglev + rot) % 4;
				tmpmat2.mulScale(size, size, size);
			}else{
				// 上下回転逆さ状態
				var temph = 2 - angleh;
				var tempv = (4 - anglev + rot) % 4;
				tmpmat2.mulScale(-size, -size, size);
			}
			e3d.setMatrix(tmpmat2);
			e3d.bindTexcBuf(texBufStruct.getbuf(temph, tempv));
			e3d.draw(0, 6);
		}
		// 描画
		e3d.bindBuf(this.vertBuffer, this.clorBuffer, null, this.faceBuffer);
		
		if(action > 0){
			// 走る
			switch(Math.floor(action / 6) % 4){
				case 0:
					drawParts(this.texBufStruct_head,  0.5,   0.12,  0.00, 0.45, 0, 0);
					drawParts(this.texBufStruct_body,  0.5,   0.00,  0.00, 0.23, 0, 0);
					drawParts(this.texBufStruct_foot2, 0.25, -0.20, -0.07, 0.20, 0, 0);
					drawParts(this.texBufStruct_foot1, 0.25,  0.10,  0.07, 0.10, 0, 0);
					drawParts(this.texBufStruct_hand,  0.25,  0.10, -0.15, 0.25, 0, 0);
					drawParts(this.texBufStruct_hand,  0.25, -0.10,  0.15, 0.25, 0, 0);
					drawParts(this.texBufStruct_hairr, 0.5,   0.06,  0.20, 0.43, 0, 0);
					drawParts(this.texBufStruct_hairl, 0.5,   0.06, -0.20, 0.43, 0, 0);
					drawParts(this.texBufStruct_tail,  0.5,  -0.07,  0.00, 0.36, 0, 0);break;
				case 1:
					drawParts(this.texBufStruct_head,  0.5,   0.12,  0.00, 0.47, 0, 0);
					drawParts(this.texBufStruct_body,  0.5,   0.00,  0.00, 0.26, 0, 0);
					drawParts(this.texBufStruct_foot1, 0.25, -0.00, -0.07, 0.15, 0, 0);
					drawParts(this.texBufStruct_foot1, 0.25,  0.00,  0.07, 0.10, 0, 0);
					drawParts(this.texBufStruct_hand,  0.25,  0.05, -0.18, 0.25, 0, 0);
					drawParts(this.texBufStruct_hand,  0.25, -0.05,  0.18, 0.25, 0, 0);
					drawParts(this.texBufStruct_hairr, 0.5,   0.06,  0.20, 0.45, 0, 0);
					drawParts(this.texBufStruct_hairl, 0.5,   0.06, -0.20, 0.45, 0, 0);
					drawParts(this.texBufStruct_tail,  0.5,  -0.07,  0.00, 0.38, 0, 0);break;
				case 2:
					drawParts(this.texBufStruct_head,  0.5,   0.12,  0.00, 0.45, 0, 0);
					drawParts(this.texBufStruct_body,  0.5,   0.00,  0.00, 0.23, 0, 0);
					drawParts(this.texBufStruct_foot1, 0.25,  0.10, -0.07, 0.10, 0, 0);
					drawParts(this.texBufStruct_foot2, 0.25, -0.20,  0.07, 0.20, 0, 0);
					drawParts(this.texBufStruct_hand,  0.25, -0.10, -0.15, 0.25, 0, 0);
					drawParts(this.texBufStruct_hand,  0.25,  0.10,  0.15, 0.25, 0, 0);
					drawParts(this.texBufStruct_hairr, 0.5,   0.06,  0.20, 0.43, 0, 0);
					drawParts(this.texBufStruct_hairl, 0.5,   0.06, -0.20, 0.43, 0, 0);
					drawParts(this.texBufStruct_tail,  0.5,  -0.07,  0.00, 0.36, 0, 0);break;
				case 3:
					drawParts(this.texBufStruct_head,  0.5,   0.12,  0.00, 0.47, 0, 0);
					drawParts(this.texBufStruct_body,  0.5,   0.00,  0.00, 0.26, 0, 0);
					drawParts(this.texBufStruct_foot1, 0.25,  0.00, -0.07, 0.10, 0, 0);
					drawParts(this.texBufStruct_foot1, 0.25, -0.00,  0.07, 0.15, 0, 0);
					drawParts(this.texBufStruct_hand,  0.25, -0.05, -0.18, 0.25, 0, 0);
					drawParts(this.texBufStruct_hand,  0.25,  0.05,  0.18, 0.25, 0, 0);
					drawParts(this.texBufStruct_hairr, 0.5,   0.06,  0.20, 0.45, 0, 0);
					drawParts(this.texBufStruct_hairl, 0.5,   0.06, -0.20, 0.45, 0, 0);
					drawParts(this.texBufStruct_tail,  0.5,  -0.07,  0.00, 0.38, 0, 0);break;
			}
		}else{
			// 静止状態
			drawParts(this.texBufStruct_head,  0.50,  0.00,  0.00, 0.52, 0, 0);
			drawParts(this.texBufStruct_body,  0.50, -0.02,  0.00, 0.27, 0, 0);
			drawParts(this.texBufStruct_foot1, 0.25, -0.02, -0.10, 0.10, 0, 0);
			drawParts(this.texBufStruct_foot1, 0.25,  0.02,  0.10, 0.10, 0, 0);
			drawParts(this.texBufStruct_hand,  0.25,  0.02, -0.20, 0.25, 0, 0);
			drawParts(this.texBufStruct_hand,  0.25, -0.02,  0.20, 0.25, 0, 0);
			drawParts(this.texBufStruct_hairr, 0.50, -0.05,  0.20, 0.50, 0, 0);
			drawParts(this.texBufStruct_hairl, 0.50, -0.05, -0.20, 0.50, 0, 0);
			drawParts(this.texBufStruct_tail,  0.50, -0.15,  0.00, 0.40, 0, 0);
		}
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 影クラス
function Shadow(texFile){
	this.vertBuffer;
	this.clorBuffer;
	this.texcBuffer;
	this.faceBuffer;
	this.texture;
	
	// ----------------------------------------------------------------
	// 初期化
	this.init = function(e3d){
		var vert = new Array();
		var clor = new Array();
		var texc = new Array();
		var face = new Array();
		vert.push(-0.5, 0.05,  0.5);
		vert.push( 0.5, 0.05,  0.5);
		vert.push( 0.5, 0.05, -0.5);
		vert.push(-0.5, 0.05, -0.5);
		texc.push(1.0, 0.0);
		texc.push(0.0, 0.0);
		texc.push(0.0, 1.0);
		texc.push(1.0, 1.0);
		clor.push(1.0, 1.0, 1.0);
		clor.push(1.0, 1.0, 1.0);
		clor.push(1.0, 1.0, 1.0);
		clor.push(1.0, 1.0, 1.0);
		face.push(0, 1, 2);
		face.push(0, 2, 3);
		// VBOとIBOを作成し、データを転送
		this.vertBuffer = e3d.createVBO(vert);
		this.clorBuffer = e3d.createVBO(clor);
		this.texcBuffer = e3d.createVBO(texc);
		this.faceBuffer = e3d.createIBO(face);
		
		// 影画像作成
		var canvas = document.createElement("canvas");
		canvas.width = canvas.height = 32;
		var g = canvas.getContext("2d");
		g.fillStyle = "#000000";
		g.arc(16, 16, 15, 0, Math.PI * 2.0, true);
		g.fill();
		this.texture = e3d.createTexture(canvas);
	}
	
	// ----------------------------------------------------------------
	// 描画
	var tmpmat = new Matrix();
	this.draw = function(e3d, mat, x, y, z, size){
		// 行列作成
		tmpmat.copy(mat);
		tmpmat.mulTranslate(x, z, y);
		tmpmat.mulScale(size, 1, size);
		e3d.setMatrix(tmpmat);
		// 描画
		e3d.bindTex(this.texture, 0);
		e3d.bindBuf(this.vertBuffer, this.clorBuffer, this.texcBuffer, this.faceBuffer);
		e3d.draw(0, 6);
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

