// メニュークラス
function Menu(){
	this.vertBuffer1;
	this.clorBuffer1;
	this.texcBuffer1;
	this.faceBuffer1;
	
	this.vertBuffer2;
	this.clorBuffer2;
	this.texcBuffer2;
	this.faceBuffer2;
	
	// ----------------------------------------------------------------
	// 初期化
	
	var pushBuffer = function(vert, texc, clor, face, r, g, b, vx0, vy0, vx1, vy1, tx0, ty0, tx1, ty1){
		var index = vert.length / 3;
		vert.push(vx1); vert.push(vy0); vert.push(0.0);
		vert.push(vx0); vert.push(vy0); vert.push(0.0);
		vert.push(vx0); vert.push(vy1); vert.push(0.0);
		vert.push(vx1); vert.push(vy1); vert.push(0.0);
		clor.push(r); clor.push(g); clor.push(b);
		clor.push(r); clor.push(g); clor.push(b);
		clor.push(r); clor.push(g); clor.push(b);
		clor.push(r); clor.push(g); clor.push(b);
		texc.push(tx1); texc.push(ty0);
		texc.push(tx0); texc.push(ty0);
		texc.push(tx0); texc.push(ty1);
		texc.push(tx1); texc.push(ty1);
		face.push(index + 0);
		face.push(index + 1);
		face.push(index + 2);
		face.push(index + 0);
		face.push(index + 2);
		face.push(index + 3);
	}
	
	this.init = function(e3d){
		// 黒幕その他
		var vert = new Array();
		var clor = new Array();
		var texc = new Array();
		var face = new Array();
		pushBuffer(vert, texc, clor, face, 0, 0, 0, 0, 0, 1, 1, 0.0625, 0.25, 0.0625, 0.25);
		pushBuffer(vert, texc, clor, face, 1, 1, 1, -8, -8, 8, 8, 0.125, 0, 0.25, 0.5);
		pushBuffer(vert, texc, clor, face, 1, 1, 1, 16, 8, 32, 24, 0.750, 0, 0.875, 0.5);
		pushBuffer(vert, texc, clor, face, 1, 1, 1, 32, 8, 48, 24, 0.875, 0, 1.000, 0.5);
		pushBuffer(vert, texc, clor, face, 1, 1, 1, 0, 8, 16, 24, 0.000, 0.5, 0.125, 1);
		pushBuffer(vert, texc, clor, face, 1, 1, 1, 0, 8, 16, 24, 0.125, 0.5, 0.250, 1);
		pushBuffer(vert, texc, clor, face, 1, 1, 1, 0, 8, 16, 24, 0.250, 0.5, 0.375, 1);
		pushBuffer(vert, texc, clor, face, 1, 1, 1, 0, 8, 16, 24, 0.375, 0.5, 0.500, 1);
		pushBuffer(vert, texc, clor, face, 1, 1, 1, 0, 8, 16, 24, 0.500, 0.5, 0.625, 1);
		pushBuffer(vert, texc, clor, face, 1, 1, 1, 0, 8, 16, 24, 0.625, 0.5, 0.750, 1);
		pushBuffer(vert, texc, clor, face, 1, 1, 1, 0, 8, 16, 24, 0.750, 0.5, 0.875, 1);
		pushBuffer(vert, texc, clor, face, 1, 1, 1, 0, 8, 16, 24, 0.875, 0.5, 1.000, 1);
		this.vertBuffer1 = e3d.createVBO(vert);
		this.clorBuffer1 = e3d.createVBO(clor);
		this.texcBuffer1 = e3d.createVBO(texc);
		this.faceBuffer1 = e3d.createIBO(face);
		
		// キューブ
		var vert = new Array();
		var clor = new Array();
		var face = new Array();
		vert.push(-1); vert.push( 1); vert.push(-1); vert.push(-1); vert.push( 1); vert.push( 1); vert.push( 1); vert.push( 1); vert.push( 1); vert.push( 1); vert.push( 1); vert.push(-1);
		vert.push(-1); vert.push(-1); vert.push( 1); vert.push(-1); vert.push(-1); vert.push(-1); vert.push( 1); vert.push(-1); vert.push(-1); vert.push( 1); vert.push(-1); vert.push( 1);
		vert.push(-1); vert.push( 1); vert.push( 1); vert.push(-1); vert.push(-1); vert.push( 1); vert.push( 1); vert.push(-1); vert.push( 1); vert.push( 1); vert.push( 1); vert.push( 1);
		vert.push( 1); vert.push( 1); vert.push(-1); vert.push( 1); vert.push(-1); vert.push(-1); vert.push(-1); vert.push(-1); vert.push(-1); vert.push(-1); vert.push( 1); vert.push(-1);
		vert.push( 1); vert.push( 1); vert.push( 1); vert.push( 1); vert.push(-1); vert.push( 1); vert.push( 1); vert.push(-1); vert.push(-1); vert.push( 1); vert.push( 1); vert.push(-1);
		vert.push(-1); vert.push( 1); vert.push(-1); vert.push(-1); vert.push(-1); vert.push(-1); vert.push(-1); vert.push(-1); vert.push( 1); vert.push(-1); vert.push( 1); vert.push( 1);
		clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0);
		clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0);
		clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0);
		clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0);
		clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0);
		clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0); clor.push(1.0);
		face.push( 0); face.push( 1); face.push( 2); face.push( 0); face.push( 2); face.push( 3);
		face.push( 4); face.push( 5); face.push( 6); face.push( 4); face.push( 6); face.push( 7);
		face.push( 8); face.push( 9); face.push(10); face.push( 8); face.push(10); face.push(11);
		face.push(12); face.push(13); face.push(14); face.push(12); face.push(14); face.push(15);
		face.push(16); face.push(17); face.push(18); face.push(16); face.push(18); face.push(19);
		face.push(20); face.push(21); face.push(22); face.push(20); face.push(22); face.push(23);
		this.vertBuffer2 = e3d.createVBO(vert);
		this.clorBuffer2 = e3d.createVBO(clor);
		this.faceBuffer2 = e3d.createIBO(face);
		this.texcBuffer2 = new Array();
		for(var i = 0; i < 64; i++){
			var texc = new Array();
			var v0 = Math.floor(i / 4) * 0.0625;
			var v1 = v0 + 0.0625;
			var u = (i % 4) * 0.2500;
			var u0 = u + 0.0000; var u1 = u0 + 0.0625;
			texc.push(u0); texc.push(v0); texc.push(u0); texc.push(v1); texc.push(u1); texc.push(v1); texc.push(u1); texc.push(v0);
			var u0 = u + 0.1875; var u1 = u0 + 0.0625;
			texc.push(u0); texc.push(v0); texc.push(u0); texc.push(v1); texc.push(u1); texc.push(v1); texc.push(u1); texc.push(v0);
			var u0 = u + 0.0625; var u1 = u0 + 0.0625;
			texc.push(u0); texc.push(v0); texc.push(u0); texc.push(v1); texc.push(u1); texc.push(v1); texc.push(u1); texc.push(v0);
			texc.push(u0); texc.push(v0); texc.push(u0); texc.push(v1); texc.push(u1); texc.push(v1); texc.push(u1); texc.push(v0);
			var u0 = u + 0.1250; var u1 = u0 + 0.0625;
			texc.push(u0); texc.push(v0); texc.push(u0); texc.push(v1); texc.push(u1); texc.push(v1); texc.push(u1); texc.push(v0);
			texc.push(u0); texc.push(v0); texc.push(u0); texc.push(v1); texc.push(u1); texc.push(v1); texc.push(u1); texc.push(v0);
			this.texcBuffer2[i] = e3d.createVBO(texc);
		}
	}
	
	// ----------------------------------------------------------------
	// 描画
	var tmpmat = new Matrix();
	
	this.draw1 = function(e3d, mat, ctrl){
		e3d.bindBuf(this.vertBuffer1, this.clorBuffer1, this.texcBuffer1, this.faceBuffer1);
		// 黒幕
		tmpmat.copy(mat);
		tmpmat.mulScale(320, 32, 1);
		e3d.setMatrix(tmpmat);
		e3d.draw(0, 6);
		tmpmat.copy(mat);
		tmpmat.mulTranslate(0, 288, 0);
		tmpmat.mulScale(320, 32, 1);
		e3d.setMatrix(tmpmat);
		e3d.draw(0, 6);
		// バツ印
		tmpmat.copy(mat);
		if(ctrl.selectedChip == 8){
			tmpmat.mulTranslate(ctrl.mousex, ctrl.mousey, 0);
		}else{
			tmpmat.mulTranslate(256, 16, 0);
		}
		e3d.setMatrix(tmpmat);
		e3d.draw(6, 6);
		// 矢印
		e3d.setMatrix(mat);
		e3d.draw(12, 6);
		e3d.draw(18, 6);
		// スクロールゲージ
		e3d.draw(24 + ctrl.selectedLine * 6, 6);
	}
	
	this.draw2 = function(e3d, mat, ctrl){
		e3d.bindVertBuf(this.vertBuffer2);
		e3d.bindClorBuf(this.clorBuffer2);
		e3d.bindFaceBuf(this.faceBuffer2);
		
		var fuga = 2;
		
		for(var i = 0; i < 8; i++){
			e3d.bindTexcBuf(this.texcBuffer2[i + ctrl.selectedLine * 8]);
			tmpmat.copy(mat);
			if(i == ctrl.selectedChip){
				if(ctrl.selectedx >= 0){continue;}
				tmpmat.mulTranslate(ctrl.mousex, ctrl.mousey, 0);
				tmpmat.mulScale(1.3, 1.3, 0);
			}else{
				tmpmat.mulTranslate(64 + i * 24, 16, 0);
				tmpmat.mulScale(1, 1, 0);
			}
			tmpmat.mulRotX(-ctrl.roth);
			tmpmat.mulRotY(ctrl.rotv + Math.PI);
			tmpmat.mulScale(-6, -6, -6);
			e3d.setMatrix(tmpmat);
			e3d.draw(0, 36);
		}
	}
	
	this.draw3 = function(e3d, mat, ctrl){
		if(ctrl.selectedx < 0 || ctrl.selectedChip < 0 || 8 < ctrl.selectedChip){return;}
		var texid = 0;
		if(ctrl.selectedChip < 8){texid = ctrl.selectedLine * 8 + ctrl.selectedChip;}
		e3d.bindBuf(this.vertBuffer2, this.clorBuffer2, this.texcBuffer2[texid], this.faceBuffer2);
		tmpmat.copy(mat);
		tmpmat.mulTranslate(ctrl.selectedx + 0.5, ctrl.selectedy + 0.5, ctrl.selectedz + 0.5);
		if(ctrl.selectedChip < 8){
			tmpmat.mulScale(0.3, 0.3, 0.3);
		}else{
			tmpmat.mulScale(0.55, 0.55, 0.55);
		}
		e3d.setMatrix(tmpmat);
		e3d.draw(0, 36);
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

