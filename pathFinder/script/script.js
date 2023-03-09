///////////////////// MACROS /////////////////
let gridWidth 			 = 50;
let gridHeight 			 = 50;
let gridElemSize 		 = 18; // 18 + 1px border on two sides = 20px
let borderSize			 = 1;
let wallColor			 = "rgb(20, 20, 30)";
let startColor			 = "rgb(10, 200, 50)";
let endColor			 = "rgb(0, 255, 200)";
let pathClr				 = "rgb(0, 55, 200)";
let lookupClr			 = "rgba(80, 80, 100, 0)";
let visitedClr			 = "rgba(180, 40, 40, 0)";
let gridContainer		 = document.getElementById("grid");
let state				 = 0; // 0 : wall | 1 : start | 2 : end | 3 : remove
let paused 				 = false;
let disableDiagnalSearch = false;
let FLM 				 = true;
let debug				 = false;
let lookupDebug 		 = false;
let fullScreenOn		 = false;


/// making grid elements and their parent ///

function createGrid(width = gridWidth, height = gridHeight, elemSize = gridElemSize + borderSize*2){

	//holder for grid (to overflow width correct rectangular shape)
	gridContainer.innerHTML = "<div id='gridHolder'></div>";
	let target = document.getElementById("gridHolder");
	target.style = "width:"+(width*elemSize)+"px;height:"+(height*elemSize)+"px;background-color:#aaa";

	//adding grid elems
	tmpElems = "";
	for(let i = 0; i < height*width; i++){
		tmpElems += "<div class='gridElem'></div>";
	}
	target.innerHTML = tmpElems;
}
createGrid();


/// grid (linear referring object)

elemsColl = document.getElementsByClassName("gridElem");

//////////////////////////////////////////////
/// state checking ///
mouseClicked = false;
startSet	 = false;
endSet	 	 = false;
startElem	 = "";
endElem		 = "";
function stateClr(elem, useStartEnd=true){
	elem=window.event? event.srcElement: elem.target; // srcElement for old IE
	if(getComputedStyle(elem).getPropertyValue('background-color')=='rgba(0, 0, 0, 0)'){
	if(elem.className.indexOf('gridElem')!=-1){
		if(!state){
			elem.style = "background-color:" + wallColor;
		}
		else if(state == 1 && useStartEnd){
			elem.style = "background-color:" + startColor;
			startSet = true;
			document.getElementById("start").className = "startEndDisabled";
			state = 0;
			document.getElementById("wall").disabled = true;
			startElem = elem;

		}
		else if(state == 2 && useStartEnd){
			elem.style = "background-color:" + endColor;
			endSet = true;
			document.getElementById("end").className = "startEndDisabled";
			state = 0;
			document.getElementById("wall").disabled = true;
			endElem = elem;
		}
	}
	}
	else if(elem.className == "gridElem"){
		if(state == 3){
			elem.style = "background-color:rgba(0,0,0,0)";
			if(getComputedStyle(elem).backgroundColor==startColor){
				startElem = "";
				startSet = false;
				document.getElementById("start").disabled=false;
				document.getElementById("start").className = "control-btn";

			}
			else if(getComputedStyle(elem).backgroundColor==endColor){
				endElem = "";
				endSet = false;
				document.getElementById("end").disabled=false;
				document.getElementById("end").className = "control-btn";
			}
		}
	}
}
document.onmousedown= function(clickedElem){
	clickedElem=window.event? event.srcElement: clickedElem.target; // srcElement for old IE
	stateClr(clickedElem);
	if(clickedElem.className.indexOf('gridElem')!=-1){
		mouseClicked = true;
	}
}
document.onmouseover = function(elem){
	if (mouseClicked){
		stateClr(elem, false);
	}
}
document.onmouseup = function(){
	mouseClicked = false;
}
document.onkeypress = function(k){
	if(k.code == "KeyP"){
		paused = !paused;
		paused?cardinal.notification("paused!"):cardinal.notification("unpaused!");
	}
	else if(k.code == "KeyS") stateStart();
	else if(k.code == "KeyW") stateWall();
	else if(k.code == "KeyR") reset();
	else if(k.code == "KeyE") stateEnd();
	else if(k.code == "KeyD") remove();
	else if(k.code == "NumpadAdd") cardinal.alterSpeed(-100);
	else if(k.code == "NumpadSubtract") cardinal.alterSpeed(100);
	else if(k.code == "KeyF") fullScreen();
	else if(k.code == "KeyL") toggleLookupDebug();
	else if(k.code == "KeyC") toggleCostDebug();
}
/////////////////////////////////////////////////
//// state changing ////////////////////////////
function stateWall(){
	state = 0;
	document.getElementById("wall").disabled=true;
	document.getElementById("start").disabled=startSet || false;
	document.getElementById("end").disabled=endSet || false;
	document.getElementById("remove").disabled=false;
}
function stateStart(){
	state = 1;
	document.getElementById("start").disabled=true;
	document.getElementById("wall").disabled=false;
	document.getElementById("end").disabled=endSet || false;
	document.getElementById("remove").disabled=false;
	if(!startSet) document.getElementById("start").className = "control-btn";
	if(!endSet) document.getElementById("end").className = "control-btn";
}
function stateEnd(){
	state = 2;
	document.getElementById("end").disabled=true;
	document.getElementById("wall").disabled=false;
	document.getElementById("start").disabled=startSet || false;
	document.getElementById("remove").disabled=false;
	if(!startSet) document.getElementById("start").className = "control-btn";
	if(!endSet) document.getElementById("end").className = "control-btn";
}
function reset(){
	createGrid();
	startSet=endSet=false;
	document.getElementById("start").disabled=false;
	document.getElementById("end").disabled=false;
	document.getElementById("remove").disabled=false;
	document.getElementById("start").className = "control-btn";
	document.getElementById("end").className = "control-btn";
	document.getElementById("load").value = 0;
}
function remove(){
	state = 3;
	document.getElementById("wall").disabled=false;
	document.getElementById("remove").disabled=true;
	document.getElementById("start").disabled=startSet || false;
	document.getElementById("end").disabled=endSet || false;
	if(!startSet) document.getElementById("start").className = "control-btn";
	if(!endSet) document.getElementById("end").className = "control-btn";
}
function fullScreen(){
	if(!fullScreenOn){
		document.getElementById("target").style="position:absolute;inset:0;height:100%;width:100%;z-index:10;";
		document.getElementsByTagName("body")[0].style="overflow:hidden;";
	}
	else{
		document.getElementById("target").style="";
		document.getElementsByTagName("body")[0].style="overflow:auto;";
	}
	fullScreenOn = !fullScreenOn;
}
function toggleLookupDebug(){
	if(lookupDebug){
		lookupClr = "rgba(80, 80, 100, 0)";
		visitedClr = "rgba(180, 40, 40, 0)";
		cardinal.notification("lookup debug off.");
	}else{
		lookupClr = "rgba(80, 80, 100, 0.6)";
		visitedClr = "rgba(180, 40, 40, 0.6)";
		cardinal.notification("lookup debug on.");
	}
	lookupDebug = !lookupDebug;
}
function toggleCostDebug(){
	debug = !debug;
	debug?cardinal.notification("cost debug on."):cardinal.notification("cost debug off.");
}

///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////

function del(elem, arr){
    tmp = arr.indexOf(elem);
    for (let i = tmp; i < arr.length-1; i++){
        arr[i] = arr[i+1];
    }
    arr.pop();
    return elem;
}
function dist(a, b){
	return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2);
}
const cardinal = {
	grid : elemsColl,
	lookupSpeed : 0,
	saveState : function(){
		s = [];
		for (let i = 0; i < cardinal.grid.length; i++){
			s[i] = getComputedStyle(cardinal.grid[i]).backgroundColor==wallColor?1:undefined;
			document.getElementById("saved").innerHTML = s;
			cardinal.notification("state saved, refer to the console or click <a href='#saved'>here</a> to view", 8000);
		}
	},
	loadState : function(data){
		if(data=="clear"){
			for (i in cardinal.grid){
				cardinal.grid[i].style="background-color:"+"rgb(0, 0, 0, 0)";
			}
		}
		else{
			for (i in data){
				if(data[i] == 1)
					cardinal.grid[i].style="background-color:"+wallColor;
			}
		}
		
	},
	alterSpeed : function(amt){
		if(cardinal.lookupSpeed+amt >= 0 && cardinal.lookupSpeed+amt<=1500){
			FLM = false;
			cardinal.lookupSpeed += amt;
			document.getElementById("spd").innerHTML = cardinal.lookupSpeed==0?"speed : Max":"speed : " + (1500-cardinal.lookupSpeed);
		}else if(cardinal.lookupSpeed+amt<0){
			FLM = true;
			cardinal.lookupSpeed = -100;
			document.getElementById("spd").innerHTML = "speed : FLM";
		}
	},
	getElem : function(x){
		return this.grid[x];
	},
	getElemXY : function(x, y){
		return this.grid[y * gridWidth + x];
	},
	calCost : function(x, y){
		return dist(x, y);
	},
	setMin : function(set){
		min = Infinity; //must be greater than all costs to come
		for (let i = 0; i < set.length; i++){
			if(set[i] == undefined) continue;
			if(set[i] < min) min = set[i];
		}
		return min;
	},
	toPos : function(x, y){
		return y*gridWidth + x;
	},
	toXY : function(pos){
		return [pos%gridWidth, Math.floor(pos/gridWidth)];
	},
	findPath : function(startTime, startPos, endPos){
		let visited = [], unvisited = [], parentMap = [], current, found = false;
		unvisited[startPos] = cardinal.calCost(cardinal.toXY(startPos), cardinal.toXY(endPos)); //holds cost for given pos

		let loop=setInterval(()=>{
			if(!paused){
			current = unvisited.indexOf(cardinal.setMin(unvisited)); // chooses smallest node
			if(current==-1) {cardinal.notification("no possible path!", 8000); clearInterval(loop);clearInterval(draw);return}
			if(current != startPos){
				cardinal.getElem(current).style = 'background-color:'+visitedClr;
			}
			visited[current] = unvisited[current]; //visit node with smallest cost
			unvisited[current] = undefined; // deletes cost of choosen node
			// evaluate surrounding nodes
			for (let i = -1; i < 2; i++){
				for (let j = -1; j < 2; j++){
					if(disableDiagnalSearch){
						// disable diagnal movement
						if(i!=0 && j!=0) continue;
					}
					if(j==i && i == 0) continue; //skip current node (middle)
					let neighbour = current + i*gridWidth + j; // current surrounding node
					if(cardinal.getElem(neighbour) == undefined || (current%gridWidth==0 && j==-1) || (current%gridWidth==gridWidth-1 && j==1)) continue; // check boundries
					// skip walls already visied and start Pos & skip start pos
					if(visited[neighbour] != undefined || neighbour == startPos || [wallColor, startPos, visitedClr].includes(getComputedStyle(cardinal.getElem(neighbour)).backgroundColor)) continue;

					let currentTcost = cardinal.calCost(cardinal.toXY(neighbour), cardinal.toXY(endPos)),
						currentFcost = (visited[current] - cardinal.calCost(cardinal.toXY(current), cardinal.toXY(endPos))) + cardinal.calCost(cardinal.toXY(neighbour), cardinal.toXY(current));

					if(unvisited[neighbour] == undefined || unvisited[neighbour] - currentTcost > currentFcost){
						unvisited[neighbour] =  currentTcost + currentFcost;
						neighbour != endPos?cardinal.getElem(neighbour).style = 'background-color:' + lookupClr:undefined;
						debug?cardinal.getElem(neighbour).innerHTML = Math.ceil(unvisited[neighbour]):undefined;
						parentMap[neighbour] = current;
						//stop if found
						if(neighbour == endPos) {found=true;clearInterval(loop);}
					}

				}
			}}
		},cardinal.lookupSpeed);
		let draw = setInterval(()=>{
			if(found){
				clearInterval(draw);
				current = endPos;
				do{
					if(parentMap[current]==current-gridWidth-1){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&searr;"
					}else if(parentMap[current]==current-gridWidth){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&darr;"
					}else if(parentMap[current]==current-gridWidth+1){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&swarr;"
					}else if(parentMap[current]==current+gridWidth-1){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&nearr;"
					}else if(parentMap[current]==current+gridWidth){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&uarr;"
					}else if(parentMap[current]==current+gridWidth+1){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&nwarr;"
					}else if(parentMap[current]==current-1){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&rarr;"
					}else if(parentMap[current]==current+1){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&larr;"
					}
					current = parentMap[current];
					cardinal.getElem(current).style='color:#fff;background-color:'+pathClr;
				}while(parentMap[current] != startPos)
				found = false;
				cardinal.notifTime(startTime, (new Date).getTime());
			}
		},100);
	},
	findPathFLM : function(startTime, startPos, endPos){
		let visited = [], unvisited = [], parentMap = [], current, found = false;
		unvisited[startPos] = cardinal.calCost(cardinal.toXY(startPos), cardinal.toXY(endPos)); //holds cost for given pos


		while(!found){
			current = unvisited.indexOf(cardinal.setMin(unvisited)); // chooses smallest node
			if(current==-1) {cardinal.notification("no possible path!", 8000);return;}
			if(current != startPos){
				cardinal.getElem(current).style = 'background-color:'+visitedClr;
			}
			visited[current] = unvisited[current]; //visit node with smallest cost
			unvisited[current] = undefined; // deletes cost of choosen node
			// evaluate surrounding nodes
			for (let i = -1; i < 2; i++){
				for (let j = -1; j < 2; j++){
					if(disableDiagnalSearch){
						// disable diagnal movement
						if(i!=0 && j!=0) continue;
					}
					if(j==i && i == 0) continue; //skip current node (middle)
					let neighbour = current + i*gridWidth + j; // current surrounding node
					if(cardinal.getElem(neighbour) == undefined || (current%gridWidth==0 && j==-1) || (current%gridWidth==gridWidth-1 && j==1)) continue; // check boundries

					// skip walls already visied and start Pos & skip start pos
					if(visited[neighbour] != undefined || neighbour == startPos || [wallColor, startPos, visitedClr].includes(getComputedStyle(cardinal.getElem(neighbour)).backgroundColor)) continue;

					let currentTcost = cardinal.calCost(cardinal.toXY(neighbour), cardinal.toXY(endPos)),
						currentFcost = (visited[current] - cardinal.calCost(cardinal.toXY(current), cardinal.toXY(endPos))) + cardinal.calCost(cardinal.toXY(neighbour), cardinal.toXY(current));

					if(unvisited[neighbour] == undefined || unvisited[neighbour] - currentTcost > currentFcost){
						unvisited[neighbour] =  currentTcost + currentFcost;
						neighbour != endPos?cardinal.getElem(neighbour).style = 'background-color:' + lookupClr:undefined;
						debug?cardinal.getElem(neighbour).innerHTML = Math.ceil(unvisited[neighbour]):undefined;
						parentMap[neighbour] = current;
						//stop if found
						if(neighbour == endPos) {found=true;break;}
					}

				}
				if(found) break;
			}
		}
		let draw = setInterval(()=>{
			if(found){
				clearInterval(draw);
				current = endPos;
				do{
					if(parentMap[current]==current-gridWidth-1){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&searr;"
					}else if(parentMap[current]==current-gridWidth){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&darr;"
					}else if(parentMap[current]==current-gridWidth+1){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&swarr;"
					}else if(parentMap[current]==current+gridWidth-1){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&nearr;"
					}else if(parentMap[current]==current+gridWidth){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&uarr;"
					}else if(parentMap[current]==current+gridWidth+1){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&nwarr;"
					}else if(parentMap[current]==current-1){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&rarr;"
					}else if(parentMap[current]==current+1){ // north west
						cardinal.getElem(parentMap[current]).innerHTML = "&larr;"
					}
					current = parentMap[current];
					cardinal.getElem(current).style='color:#fff;background-color:'+pathClr;
				}while(parentMap[current] != startPos)
				found = false;
				cardinal.notifTime(startTime, (new Date).getTime());
			}
		}, 100);
	},
	notification : function(text, time=4000){
		document.getElementById("notif").style = "bottom:10px;";
		document.getElementById("notif").innerHTML = text;
		setTimeout(()=>{
			document.getElementById("notif").style += "opacity:0; bottom:-50%;";
		}, time)
	},
	notifTime : function(t1, t2){
		time = t2 - t1;
		cardinal.notification("time spent searching : " + (time>1000?((time/1000) + "s"):(time+"ms")) +"<br>time is affected by pause duration & UX draw time", 8000)
	}
}
setInterval(function(){
	if(startElem != "" && endElem != ""){
		if(paused) cardinal.notification("check if paused<br>if FLM is not selected unpause is necessary to start");
		t1 = (new Date).getTime();
		FLM?cardinal.findPathFLM(t1, Array.from(elemsColl).indexOf(startElem),Array.from(elemsColl).indexOf(endElem)):cardinal.findPath(t1, Array.from(elemsColl).indexOf(startElem),Array.from(elemsColl).indexOf(endElem));
		startElem = endElem = "";
	}
}, 100);




/* OLD FINDPATH FUNCTION 2/5/2022 (V1)

//transforming startPos and endPos to XY format
		startPos = [startPos%gridWidth, Math.floor(startPos/gridWidth)];
		endPos = [endPos%gridWidth, Math.floor(endPos/gridWidth)];
		//Fcost(cost from start pos) and Tcost(cost to end pos) 'array where cost index = elem index'
		Unvisited = [];
		Visited = [];
		Fcost = [];
		Tcost = [];
		ParentMap = [];
		found = false;
		ready = false;
		currentPos = tmpFcost = tmpTcost = 0;
		current = startPos;
		mainLoop = setInterval(function(){
			for (let i = -1; i<2; i++){
				if(found) break;
				for (let j = -1; j<2; j++){
					// if(i==j || i==-j) continue; // don't move diagnally
					if(j==i && i==0) continue;
					currentPos = (current[1]+j)*gridWidth + current[0]+i;
					if((current[0]+i)<0 || (current[1]+j)<0 || (current[0]+i)>gridWidth || (current[1]+j)>gridHeight || currentPos > cardinal.grid.length-1) continue;
					tmpFcost = cardinal.calCost([current[0]+i, current[1]+j], startPos)*10;
					tmpTcost = cardinal.calCost([current[0]+i, current[1]+j], endPos)*10;
					if(getComputedStyle(cardinal.getElem(currentPos)).backgroundColor!=endColor && getComputedStyle(cardinal.getElem(currentPos)).backgroundColor != 'rgba(0, 0, 0, 0)' && getComputedStyle(cardinal.getElem(currentPos)).backgroundColor != lookupClr){
						Unvisited[currentPos] = undefined;
						continue;
					}
					if(getComputedStyle(cardinal.getElem(currentPos)).backgroundColor=="rgba(0, 0, 0, 0)") cardinal.getElem(currentPos).style = "background-color:" + lookupClr;
					if(Unvisited[currentPos]>tmpFcost+tmpTcost){
						alert("change")
						Unvisited[currentPos] = tmpFcost + tmpTcost;
						//replace parent
						ParentMap[currentPos] = current[1]*gridWidth+current[0];
						cardinal.getElem(currentPos).style="background-color:purple";
					}
					if(Visited[currentPos]==undefined){
						if(Fcost[currentPos]==undefined) Fcost[currentPos] = tmpFcost;
						if(Tcost[currentPos]==undefined) Tcost[currentPos] = tmpTcost;
						ParentMap[currentPos] = current[1]*gridWidth+current[0];
						Unvisited[currentPos] = Fcost[currentPos] + Tcost[currentPos];
					}
					if(currentPos==cardinal.toPos(...endPos)) {found=true;break;}
					console.log("current : "+ current +"\npos : " + currentPos%gridWidth + ',' + Math.floor(currentPos/gridWidth) + ' : \nFcost = ', Fcost[currentPos] + "\nTcost : " + Tcost[currentPos] + "\ncost : " + Unvisited[currentPos]);
					cardinal.getElem(currentPos).innerHTML = Math.floor(Unvisited[currentPos]);
				}
			}
			if(found){
				clearInterval(mainLoop);
				found = false;
				ready = true;
			}
			else{
				if(cardinal.setMin(Unvisited)==Infinity){alert("no possible path!");clearInterval(mainLoop);}
				else{
					currentPos = Unvisited.indexOf(cardinal.setMin(Unvisited)); // choose smallest cost
					current = [currentPos%gridWidth, Math.floor(currentPos/gridWidth)];
					Visited[currentPos] = Unvisited[currentPos];
					Unvisited[currentPos] = undefined;
					cardinal.getElem(currentPos).style = "background-color:"+visitedClr;
				}
			}
		}, 50)
		draw = setInterval(function(){
			if(ready){
				i = 0; //calc path numbers
				clearInterval(draw);
				tmpPos = endPos[1]*gridWidth+endPos[0];
				while(true){
					ready = false;
					tmpPos = ParentMap[tmpPos];
					if(tmpPos == startPos)break;
					cardinal.getElem(tmpPos).innerHTML = i; //write path numbers
					cardinal.getElem(tmpPos).style='background-color:'+pathClr;
					i+=1; //calc path numbers
				}
			}
			
		},100)
*/