var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

//lines with rounded edges
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

ctx.lineWidth = 5; //default size
ctx.strokeStyle = 'black'; //default is black
ctx.globalAlpha = 1; //no transparency

var nowColor = 'black'; //color currently selected. default is black

//pattern currently selected. Default is marker pattern.
var patternIsPaint = false;
var patternIsSpray = false;

var nowColorSel = document.getElementById('blackButton'); //color button currently selected. default is blackButton
var prevColorSel = document.getElementById('blackButton'); //previous color button selected. default is blackButton
nowColorSel.style.backgroundColor = 'gray'; //gray background means tool is selected

var nowSizeSel = document.getElementById('smallButton'); //size button currently selected. default is smallButton
var prevSizeSel = document.getElementById('smallButton'); //previous size button selected. default is smallButton
nowSizeSel.style.backgroundColor = 'gray'; 

var nowToolSel = document.getElementById('marker'); //tool button currently selected. default is marker
var prevToolSel = document.getElementById('marker'); //previous tool button selected. default is marker
nowToolSel.style.backgroundColor = 'gray'; 

var ptbuck = document.getElementById('paintBucket'); //to show selection of paint bucket 
var ers = document.getElementById('eraser'); //to show selection of eraser
var ref = document.getElementById('refresh');//to show selection of refresh

/* When you use the eraser, you drop other tools. 
So after you use the eraser, you must reset the tools you were using. 
The following booleans are used to do this: */
var justUsedEraser = false; 
var drawAfterEraser = false;
var colorAfterEraser = false;
var paintbuckAfterEraser = false;

//if you used a drawing tool before the paint bucket, that tool selection must be reset
var justUsedDrawTool = true;

//if there's no stroke on the canvas, you cannot use paint bucket. alert the user.
var noStroke = true;

//to display the google logo
var background = new Image();
background.src = "Images/googleHomepage.png";
background.onload = function(){
    ctx.drawImage(background, 0, 0);   
}

// ---- COLOR TOOL FUNCTIONS ---- //
function showColorSelect(btn)
{
	//you selected a color tool after you used the eraser. reset button selections.
	if(justUsedEraser === true)
	{
		colorAfterEraser = true;
		resetAfterEraser();
	}
	
	prevColorSel.style.backgroundColor = ''; //deselect previous button
	
	//change color of button to gray to show it is selected
	nowColorSel = document.getElementById(btn); 
	nowColorSel.style.backgroundColor = 'gray'; 
	
	prevColorSel = nowColorSel; //update previous button
} 

function setColor(value)
{
	ctx.strokeStyle = value; //set color
	
	nowColor = value; //update nowColor
	
	//is there a way to optimize this?
	if(patternIsPaint === true) // strictly equals === means value not just type
		setPaintBrushPattern();
	else if(patternIsSpray === true)
		setSprayPattern();
}

// ---- SIZE TOOL FUNCTIONS ---- //
function showSizeSelect(btn)
{
	prevSizeSel.style.backgroundColor = ''; //deselect previous button
	
	//change color of button to gray to show it is selected
	nowSizeSel = document.getElementById(btn); 
	nowSizeSel.style.backgroundColor = 'gray'; 
	
	prevSizeSel = nowSizeSel; //update previous button
} 

function setSize(x)
{
	ctx.lineWidth = x;
}

// ---- DRAWING TOOL FUNCTIONS ---- //
function showToolSelect(btn)
{
	//you selected a drawing tool after you used the eraser. reset button selections.
	if(justUsedEraser === true)
	{
		drawAfterEraser = true;
		resetAfterEraser();
	}
	
	prevToolSel.style.backgroundColor = ''; //deselect previous button
	
	//change color of button to gray to show it is selected
	nowToolSel = document.getElementById(btn); 
	nowToolSel.style.backgroundColor = 'gray'; 
	
	justUsedDrawTool = true; 
	
	prevToolSel = nowToolSel; //update previous button
}

function setMarkerPattern()
{
	patternIsPaint = 'false';
	patternIsSpray = 'false';
	ctx.globalAlpha = 1; //remove transparency 
	ctx.strokeStyle = nowColor; //no pattern, just color
}

function setPaintBrushPattern()
{
	patternIsPaint = true;
	patternIsSpray = false;
	ctx.globalAlpha = 0.009; //transparency for paint brush effect
	ctx.strokeStyle = nowColor; //no pattern, just color
}

function setSprayPattern()
{
	patternIsPaint = false;
	patternIsSpray = true;
	ctx.globalAlpha = 1; //remove transparency 
	var spray = new Image();
	
	//choose color of the spray
	switch(nowColor)
	{
		case 'blue':
			spray.src = "Images/blueSpray.png";
			break;
			
		case 'red':
			spray.src = "Images/redSpray.png";
			break;
		
		case 'green':
			spray.src = "Images/greenSpray.png";
			break;
			
		case 'yellow':
			spray.src = "Images/yellowSpray.png";
			break;
			
		default:
			spray.src = "Images/blackSpray.png";
	}
	
	spray.onload = function() {
	var pattern = ctx.createPattern(spray, 'repeat');
	ctx.strokeStyle = pattern;
	}
}

// ---- PAINT BUCKET FUNCTIONS ---- //
function showPaintBucketSelect()
{
	if(noStroke === true) //if there is no stroke on the canvas, tell the user to draw before they paint
	{
		alert("Draw before you paint.");
	}
	
	//you selected the paint bucket after you used the eraser. reset button selections.
	if(justUsedEraser === true)
	{
		paintbuckAfterEraser = true;
		resetAfterEraser();
		justUsedDrawTool = false; //you just used the eraser not the drawing tool
	}
	
	//change color of button to gray to show it is selected 
	ptbuck.style.backgroundColor = 'gray';

	//deselect size and drawing tools because they are irrelevant to paint bucket
	nowSizeSel.style.backgroundColor = '';
	nowToolSel.style.backgroundColor = ''; 	
	
	usePaintBucket();
	
	var delay = setTimeout(resetAfterPaintBuck,500); //half a second delay before resetting the button selections so it's visible to the human eye
	
} 
//NOTE: it always paints the last area you touched. how do I make it paint another area?
function usePaintBucket()
{
	ctx.globalAlpha = 1; //remove transparency
	ctx.fillStyle = nowColor;
	
	ctx.fill(); //fills the current drawing path with nowColor
	
	if(patternIsPaint === true) //reset transparency if you were using the paint brush tool
		ctx.globalAlpha = 0.009;
		
}
//reset button selections after you've used the paint bucket
function resetAfterPaintBuck()
{
	//deselect paint bucket
	ptbuck.style.backgroundColor = '';
	
	//restore size selection
	nowSizeSel.style.backgroundColor = 'gray';
	
	/*after you're done with the paint bucket, 
	you need to reselect the drawing tool or the eraser,
	depending on what you were using prior to paint bucket*/
	if(justUsedDrawTool === true)
		nowToolSel.style.backgroundColor = 'gray'; 
	
	else
		showEraserSelect('eraser');
}

// ---- ERASER FUNCTIONS ---- //
function showEraserSelect()
{
	//change color of button to gray to show it is selected
	ers.style.backgroundColor = 'gray';

	//deselect color and drawing tools because they are irrelevant to eraser
	nowColorSel.style.backgroundColor = '';
	nowToolSel.style.backgroundColor = ''; 	
	
	getEraser();
}

function getEraser()
{
	ctx.globalAlpha = 1; //remove transparency
	ctx.strokeStyle = 'white';
	justUsedEraser = true;
}

//reset button selections after you've used the eraser
function resetAfterEraser()
{
	//deselect eraser
	ers.style.backgroundColor = '';
	//reinitialize boolean
	justUsedEraser = false;
		
	//if you select drawing tool or paint bucket after you used the eraser, it should restore the color you were using before eraser
	if(drawAfterEraser === true || paintbuckAfterEraser === true)
	{	
		nowColorSel.style.backgroundColor = 'gray';
		
		//reinitialize booleans
		drawAfterEraser = false;
		paintbuckAfterEraser = false;
	}
	
	//if you select a color after you used the eraser, it should restore the drawing tool that you were using before eraser
	else if(colorAfterEraser === true)
	{
		
		nowToolSel.style.backgroundColor = 'gray';
		
		//reinitialize boolean
		colorAfterEraser = false;
	}
	
}

// ---- REFRESH FUNCTIONS ---- //
function showRefreshSelect()
{
	//change color of button to gray to show it is selected 
	ref.style.backgroundColor = 'gray';

	//deselect all other tools because they are irrelevant to refresh
	nowColorSel.style.backgroundColor = '';
	nowSizeSel.style.backgroundColor = '';
	nowToolSel.style.backgroundColor = ''; 
	ptbuck.style.backgroundColor = '';
	ers.style.backgroundColor = '';
	
	location.reload(); //refreshes the page
	
	// 1 second time delay before deselecting the refresh button so it's visible to the human eye
	var delay = setTimeout(resetRefrButton,1000);
}

function resetRefrButton()
{
	ref.style.backgroundColor = ''; //deselect the refresh button
}


// ---- MOUSE SENSITIVITY ---- //

//store mouse position
var mouse = {x:0, y:0};

//make it mouse sensitive
canvas.addEventListener('mousemove', getMousePos , false); //false means don't let the event bubble up to the parent function
canvas.addEventListener('mousedown', draw, false); //mousedown works whether you click left button or right button on mouse, but onClick works only for left button
canvas.addEventListener('mouseup', stopDraw, false);

//get the mouse position relative to the canvas
function getMousePos(e)
{
	mouse.x = e.clientX - this.offsetLeft;
	mouse.y = e.clientY - this.offsetTop;
}

//draw based on where the mouse is clicked 
function draw(e)
{
	ctx.beginPath();
	ctx.moveTo(mouse.x, mouse.y);
	canvas.addEventListener('mousemove', onPaint, false);
}

//stop drawing when the mouse is not clicked
function stopDraw(e)
{
	canvas.removeEventListener('mousemove', onPaint, false);
}

//function returns a value stored in the onPaint variable i.e. draw a line or stroke to position x,y
var onPaint = function()
{	
	ctx.lineTo(mouse.x, mouse.y);
	ctx.stroke();
	noStroke = false; //there is a stroke on the canvas
}