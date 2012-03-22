// グローバル変数
var e3d = new Engine3d();
var map = new Map();
var ctrl = new Controller();
var character = new BillboardCharacter();
var shadow = new Shadow();
var player = new Player();
var menu = new Menu();

// テクスチャ
var mapTexture;
var ctrlTexture;
var utilTexture;
var playerTexture;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

window.onload = function(){
	// 初期化
	var canvas = document.getElementById("screen");
	e3d.init(canvas);
	ctrl.init(e3d, canvas);
	character.init(e3d);
	shadow.init(e3d);
	menu.init(e3d);
	
	mapTexture = e3d.loadTexture("mapchip.png");
	ctrlTexture = e3d.loadTexture("ctrl.png");
	utilTexture = e3d.loadTexture("util.png");
	playerTexture = e3d.loadTexture("player.png");
	
	map.init(e3d, [[
		[ 4,  4,  4,  4,  4],
		[ 4,  4,  4,  4,  4],
		[ 4,  4,  4,  4,  4],
		[ 4,  4,  4,  4,  4],
		[ 4,  4,  4,  4,  4],
	],[
		[ 0,  0,  0, 10, 10],
		[ 0, 13,  0,  0, 10],
		[ 0,  0,  0,  0,  0],
		[ 0,  0,  0,  0,  0],
		[ 0,  0,  0,  0,  0],
	],[
		[ 0, 14,  0,  0, 10],
		[14, 13, 14,  0,  0],
		[ 0, 14,  0,  0,  0],
		[ 0,  0,  0,  0,  0],
		[ 0,  0,  0,  0,  0],
	],[
		[ 0, 14,  0,  0,  0],
		[14, 13, 14,  0,  0],
		[ 0, 14,  0,  0,  0],
		[ 0,  0,  0, 17,  0],
		[ 0,  0,  0,  0,  0],
	],[
		[ 0,  0,  0,  0,  0],
		[ 0, 14,  0,  0,  0],
		[ 0,  0,  0,  0,  0],
		[ 0,  0,  0,  0,  0],
		[ 0,  0,  0,  0,  0],
	],[
		[ 0,  0,  0,  0,  0],
		[ 0,  0,  0,  0,  0],
		[ 0,  0,  0,  0,  0],
		[ 0,  0,  0,  0,  0],
		[ 0,  0,  0,  0,  0],
	]]);
	
	ctrl.roth = Math.PI / 180 *  30;
	ctrl.distance = 10;
	
	// 描画処理を毎秒 30 回呼び出す
	setInterval(redrawScene, 1000 / 30);
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// メインループ
function redrawScene(){
	// 計算
	player.calc();
	
	// ----------------------------------------------------------------
	// 3D描画
	e3d.clear();
	e3d.setDepthMode(true);
	e3d.setAlphaMode(0);
	// カメラ
	var mat = new Matrix();
	ctrl.createWorldMatrix(mat, player.x, player.y, player.z);
	// マップ
	e3d.bindTex(mapTexture, 1);
	map.draw(e3d, mat);
	// メニュー準備
	map.select(ctrl, (ctrl.selectedChip != 8));
	// メニュー
	menu.draw3(e3d, mat, ctrl);
	// キャラクター
	e3d.bindTex(playerTexture, 0);
	player.draw(character, e3d, mat);
	shadow.draw(e3d, mat, player.x, player.y, player.z - player.altitude, player.hsize);
	
	// ----------------------------------------------------------------
	// 2D描画
	e3d.setDepthMode(false);
	mat.ortho(0, 0, ctrl.w, ctrl.h);
	// メニュー
	e3d.bindTex(utilTexture, 1);
	menu.draw1(e3d, mat, ctrl);
	e3d.bindTex(mapTexture, 1);
	menu.draw2(e3d, mat, ctrl);
	// コントローラ
	e3d.bindTex(ctrlTexture, 0);
	ctrl.draw(e3d, mat);
	
	// ----------------------------------------------------------------
	// ページに反映させる
	e3d.flush();
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// プレイヤークラス
function Player(){
	this.action = 0;
	this.rotate = Math.PI / 180 *  90;
	// あたり判定用キャラクタサイズ
	this.hsize = 0.6;
	this.vsize = 1.0;
	// キャラクタ画像倍率
	this.size = 1.5;
	// 位置
	this.x = 2.5;
	this.y = 2.5; 
	this.z = 1;
	// 速度
	this.vx = 0;
	this.vy = 0; 
	this.vz = 0;
	// 地面との距離
	this.altitude = 0;
	
	// ----------------------------------------------------------------
	// 計算
	this.calc = function(){
		this.action++;
		// 方向の計算
		if(ctrl.kup){
			if(ctrl.krt){this.rotate = Math.PI * 1.75 + ctrl.rotv;}
			else if(ctrl.klt){this.rotate = Math.PI * 1.25 + ctrl.rotv;}
			else{this.rotate = Math.PI * 1.50 + ctrl.rotv;}
		}else if(ctrl.kdn){
			if(ctrl.krt){this.rotate = Math.PI * 0.25 + ctrl.rotv;}
			else if(ctrl.klt){this.rotate = Math.PI * 0.75 + ctrl.rotv;}
			else{this.rotate = Math.PI * 0.50 + ctrl.rotv;}
		}else if(ctrl.krt){this.rotate = Math.PI * 0.00 + ctrl.rotv;
		}else if(ctrl.klt){this.rotate = Math.PI * 1.00 + ctrl.rotv;
		}else{this.action = 0;}
		// 水平軸方向速度の計算
		if(this.action > 0){
			var speed = 3 / 30;
			this.vx = speed * Math.cos(this.rotate);
			this.vy = speed * Math.sin(this.rotate);
		}else{
			this.vx = 0;
			this.vy = 0;
		}
		// 垂直軸方向速度の計算
		if(this.altitude > 0.1){
			// 地面との距離がある場合は空中
			this.action = 1;
			this.vz -= 1.2 / 30;
			if(ctrl.k_z && this.vz < 0){
			// 多段ジャンプ
				this.vz = 15 / 30;
			}
		}else if(ctrl.k_z){
			// ジャンプ
			this.vz = 15 / 30;
		}else if(ctrl.k_x){
			this.action = 1;
			this.vx = 0;
			this.vy = 0;
		}
		// あたり判定
		map.collision(this);
		// 位置の計算
		this.x += this.vx;
		this.y += this.vy;
		this.z += this.vz;
	}
	
	// ----------------------------------------------------------------
	// 描画
	this.draw = function(character, e3d, mat){
		character.draw(e3d, mat, ctrl, this.rotate, this.action, this.x, this.y, this.z, this.size);
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

