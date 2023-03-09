// get gridContainerMax width and heigh
// get number of divisions in grid
gamePaused = false;
gridX_num = 0;
gridY_num = 25;
gridContainerMax = document.getElementById('gridContainerMax');
gridContainer = document.getElementById('gridContainer');
function pauseUnpause(){
	gamePaused = !gamePaused;
}
function drawGrid(){
	gridX_num = parseInt(Math.floor((gridContainerMax.clientWidth)/20))
	gridElemNum = gridX_num*25;
	gridElems = "";
	for (let i = 0; i<gridElemNum; i++){
		gridElems += "<div class='gridElem'></div>";
	}
	gridContainer.innerHTML = gridElems;
}
drawGrid()
window.onresize = drawGrid;

//Grid
class grid{
	constructor(){
		this.grid = document.getElementsByClassName('gridElem');
	}
	colorPos(x, y, color='black'){
		this.grid[(y)*gridX_num + x].style = 'background-color:'+color;
	}
	clearPos(x, y){
		this.colorPos(x, y, '');
	}
	update(){
		for (let i = 0; i < this.grid.length; i++){
			this.grid[i].style = 'background-color:none';
		}
	}
	//glowPos(x, y, color = 'linear-gradient(40deg, yellow, red'){}

}

class snakeBodyPart{
	constructor(x, y, dir){
		this.x = x;
		this.y = y;
		this.dir = dir;
	}
	moveDir(dir){
		if(dir == "up"){
			this.y -= 1;
		}
		if(dir == "down"){
			this.y += 1;
		}
		if(dir == "left"){
			this.x -= 1;
		}
		if(dir == "right"){
			this.x += 1;
		}
		this.x %= gridX_num;
		this.y %= gridY_num;
		if(this.x < 0){
			this.x += gridX_num
		}
		if(this.y < 0){
			this.y += gridY_num
		}
		this.dir = dir;

	}
	goto(x, y){
		this.x = x;
		this.y = y;
	}
	checkCollition(x, y){
		return this.x == x && this.y == y;
	}

}
class snake{
	constructor(x, y, grid, color = 'green'){
		this.body = [new snakeBodyPart(x, y, 'up')];
		this.target = grid;
		this.color = color;
		this.score = 0;
		this.update();
	}
	addScore(score){
		this.score += score;
	}
	update(){
		this.target.update();
		for (let i = 0; i < this.body.length; i++){
			this.target.colorPos(this.body[i].x, this.body[i].y, this.color);
			if(i==0){
				this.target.colorPos(this.body[i].x, this.body[i].y, "black");
			}
		}
	}
	grow(){
		if(this.body[this.body.length-1].dir == 'up'){
			this.body.push(new snakeBodyPart(this.body[this.body.length-1].x, this.body[this.body.length-1].y+1, 'up'))
		}
		else if(this.body[this.body.length-1].dir == 'down'){
			this.body.push(new snakeBodyPart(this.body[this.body.length-1].x, this.body[this.body.length-1].y-1, 'down'))
		}
		else if(this.body[this.body.length-1].dir == 'left'){
			this.body.push(new snakeBodyPart(this.body[this.body.length-1].x+1, this.body[this.body.length-1].y, 'left'))
		}
		else if(this.body[this.body.length-1].dir == 'right'){
			this.body.push(new snakeBodyPart(this.body[this.body.length-1].x-1, this.body[this.body.length-1].y, 'right'))
		}
		this.update()
	}
	move(){
		let tmpPos = [this.body[0].x, this.body[0].y];
		this.body[0].moveDir(this.body[0].dir);
		if(this.body.length>1){
			for (let i = 1; i<this.body.length; i++){
				let tmpInterPos = [this.body[i].x, this.body[i].y];
				this.body[i].goto(tmpPos[0], tmpPos[1]);
				tmpPos = tmpInterPos;
			}
		}
		this.update();
	}
	checkAlive(){
		if(this.body.length>1){
			for (let i = 1; i < this.body.length; i++){
				if(this.body[i].checkCollition(this.body[0].x, this.body[0].y)){
					return false;
				}
			}
		}
		return true;
	}
}
class object{
	constructor(x, y, color, pointNumber, target, isBlock = false){
		this.x=x;
		this.y=y;
		this.target = target;
		this.color = color;
		this.pointNumber = pointNumber;
		this.isBlock = isBlock;
		this.update();
	}
	update(){
		this.target.colorPos(this.x, this.y, this.color);
	}
	checkCollition(x, y){
		return this.x == x && this.y == y;
	}
}
//grid and player and food objects
let mainGrid = new grid();
let player = new snake(10,10,mainGrid);
let food = new object(...[Math.random()*gridX_num, Math.random()*gridY_num].map(x => parseInt(x)), 'yellow', 80, mainGrid);
//listen for keystrokes
leftArrow = 37;
upArrow = 38;
rightArrow = 39;
downArrow = 40;
document.addEventListener("keypress", function(key){
	if(key.keyCode == 32){
		pauseUnpause();
	}else if(key.keyCode == 71){
		player.grow();
	}
});
//event listen to test input
function gameLost(){
	player = new snake(10, 20%gridX_num, mainGrid);
}
document.addEventListener("keydown", function(key){
	if(!gamePaused && key.keyCode == leftArrow && ((player.body.length == 1)||(player.body[0].dir != "right"))){
		setTimeout(()=>{player.body[0].dir = "left";},50);
		document.getElementById("debug").innerHTML += (key.keyCode) + "<br>";
	}
	else if(!gamePaused && key.keyCode == rightArrow && ((player.body.length == 1)||(player.body[0].dir != "left"))){
		setTimeout(()=>{player.body[0].dir = "right";},50);
		document.getElementById("debug").innerHTML += (key.keyCode) + "<br>";
	}
	else if(!gamePaused && key.keyCode == upArrow && ((player.body.length == 1)||(player.body[0].dir != "down"))){
		setTimeout(()=>{player.body[0].dir = "up";},50);
		document.getElementById("debug").innerHTML += (key.keyCode) + "<br>";
	}
	else if(!gamePaused && key.keyCode == downArrow && ((player.body.length == 1)||(player.body[0].dir != "up"))){
		setTimeout(()=>{player.body[0].dir = "down";},50);
		document.getElementById("debug").innerHTML += (key.keyCode) + "<br>";
	}
});
scoreBoard = document.getElementById("scoreBoard");

//main loop
setInterval(()=>{
	if(!gamePaused){
		player.move();
		food.update();
		if(player.body[0].x == food.x && player.body[0].y == food.y){
			player.addScore(food.pointNumber);
			food = 0;
			food = new object(...[Math.random()*gridX_num, Math.random()*gridY_num].map(x => parseInt(x)), 'yellow', 10, mainGrid);

			player.grow()
		}
		if(!player.checkAlive()){
			pauseUnpause();
			gameLost();
			alert("you lost, press space to continue !")
		}
		scoreBoard.innerHTML = "score : " + player.score;
	}
},100);
