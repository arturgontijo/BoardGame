var board = [0];
var color_blue = "rgb(0, 0, 255)";
var color_yellow = "rgb(255, 255, 0)";
var color_red = "rgb(255, 0, 0)";
var color_white = "rgb(255, 255, 255)";
var player_cell_color = color_blue;
var player_coord = [-1,-1];
var player_last_coord = [-1,-1];
var player_moves = 100;
var player_coins = 0;
var player_coins_total = 0;
var neighbor_cells = [];
var traps_cells = [];
var coins_cells = [];
var nrows = 16;
var ncols = 16;

start(ncols,nrows);

function start(ncols,nrows){
	createTable(ncols,nrows);
	board = $("table tr")
	mapInputCells()
	resetBoard();
	generateElements();
	player_coins_total = coins_cells.length;
	player_coins = 0;
	player_moves = 100;
	updateNavbar();
	var xy = getRandomCell();
	setCellColor(xy,player_cell_color);
	neighbor_cells = getVisionCells(xy);
	setVision();
	player_coord = xy;
}

function updateNavbar() {
	$("#moves").text("Moves: "+player_moves);
	$("#coins").text("Coins: "+player_coins+" ["+player_coins_total+"]");
}

function createTable(nrows,ncols){
	/* Remove previews board */
	if($('.board')) $('.board').remove();

	tbl = document.createElement('table');
    tbl.className = "board";
    var d = document.getElementsByClassName('container')[0];

    for(var tc_i = 0; tc_i < nrows; tc_i++){
        var tr = tbl.insertRow();
        for(var j = 0; j < ncols; j++){
	        var td = tr.insertCell();
	        var elem_td = document.createElement("input");
	        elem_td.setAttribute("type", "button");
	       	elem_td.style.width  = '40px';
	        elem_td.style.height  = '40px';
	        elem_td.style.border = '1px solid black';
	        elem_td.style.backgroundColor = "black";
	        elem_td.style.margin = "0px";
	        td.appendChild(elem_td);
        }
    }
    d.appendChild(tbl);
}

function resetBoard(){
	board.find("input").css("background-color","rgb(0,0,0)");
}

function generateElements() {
	traps_cells = [];
	var s = 31;
	var ntraps = (Math.floor(Math.random() * s))+10;
	for(var i=0;i<ntraps;i++)
	{
		traps_cells.push(getRandomCell());
		
	}
	coins_cells = [];
	s = 11;
	var ncoins = (Math.floor(Math.random() * s))+5;
	for(var i=0;i<ncoins;i++)
	{
		coins_cells.push(getRandomCell());
	}
}

function getRandomCell(){
	var s = ncols;
	var x = Math.floor(Math.random() * s);
	s = nrows;
	var y = Math.floor(Math.random() * s);
	return [x,y];
}

function setCellColor(xy,c){
	board.eq(xy[1]).find("td").eq(xy[0]).find("input").css("background-color",c);
}

function getVisionCells(xy) {
	var x = xy[0];
	var y = xy[1];
	var cells = [[x-1,y-1],[x-1,y],[x-1,y+1],[x,y-1],[x,y+1],[x+1,y-1],[x+1,y],[x+1,y+1]];
	return cells;
}

function setVision(){
	var cell = [-1,-1];
	for(var i=0; i<neighbor_cells.length; i++)
	{
		cell = neighbor_cells[i];
		if(!(cell[0] < 0 || cell[1] < 0 || cell[0] >= ncols || cell[1] >= nrows))
		{
			var c = getCellColor(cell)
			if(checkCoin(cell,false)) setCellColor(cell,color_yellow);
			else
			{
				if(c == color_white)
				{
					if(checkTrap(cell)) setCellColor(cell,color_red);
				}
				else if(!(c == color_red)) setCellColor(cell,color_white);
			}
		}
	}
}

function getCellColor(cell) {
	return board.eq(cell[1]).find("td").eq(cell[0]).find("input").css("background-color")
}

function compareArray(a1,a2) {
	if(a1.length == a2.length)
	{
		count = 0;
		for(var i=0;i<a1.length;i++)
		{
			if(a1[i] == a2[i]) count++;
		}
		if(count == a1.length) return true;
		else return false;
	}
	else
	{
		return false;
	}
}

function movePlayer(xy) {
	/* Avoid move backwards */
	if(xy[0] == player_last_coord[0] && xy[1] == player_last_coord[1]) return false;

	for(var j=0;j<neighbor_cells.length;j++)
	{
		if(compareArray(xy,neighbor_cells[j]))
		{
			setCellColor(player_coord,color_white);
			if(checkCoin(xy,true))
			{
				player_coins++;
			}
			if(checkTrap(xy))
			{
				player_moves-=4;
				setCellColor(xy,color_red);
				return true;
			}
			setCellColor(xy,player_cell_color);
			player_last_coord = player_coord;
			player_coord = xy;
			return true;
		}
	}
	return false;
}

function checkTrap(xy) {
	var x = xy[0];
	var y = xy[1];
	for(var i=0; i<traps_cells.length;i++)
	{
		if(x == traps_cells[i][0] && y == traps_cells[i][1])
		{
			return true;
		}
	}
	return false;
}

function checkCoin(xy,flag_get) {
	var x = xy[0];
	var y = xy[1];
	for(var i=0; i<coins_cells.length;i++)
	{
		if(x == coins_cells[i][0] && y == coins_cells[i][1])
		{
			if(flag_get)
			{
				var index = coins_cells.indexOf(coins_cells[i]);
				if (index > -1) {
				  coins_cells.splice(index,1);
				}
			}
			return true;
		}
	}
	return false;
}

function mapInputCells() {
	$("input").on("click",
		function(){
			if(player_coins>=player_coins_total)
			{
				if(confirm("Good Job! Play Again?")) start(16,16);
				else alert("Goodbye!");
			}
			else if(player_moves<=0)
			{
				if(confirm("No more Moves! Play Again?")) start(16,16);
				else alert("Goodbye!");
			}
			else
			{
				var clicked_xy = [$(this).closest("td").index(),$(this).closest("tr").index()]
				if(movePlayer(clicked_xy))
				{
					player_moves--;
					updateNavbar();
					neighbor_cells = getVisionCells(clicked_xy);
					setVision();
				}
				if(player_coins>=player_coins_total)
				{
					if(confirm("Good Job! Play Again?")) start(16,16);
					else alert("Goodbye!");
				}
			}
		}
	)
}