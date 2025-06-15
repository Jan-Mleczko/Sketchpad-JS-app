var IMAGE_WIDTH                   = 640;
var IMAGE_HEIGHT                  = 480;
var STATUSBAR_HEIGHT              = 20;
var BUTTON_SIZE                   = 20;
var BUTTON_SPACING                = 5;
var TOOLBAR_XMAX                  = BUTTON_SIZE + BUTTON_SPACING * 2;
var XSIZE                         = IMAGE_WIDTH + TOOLBAR_XMAX;
var YSIZE                         = IMAGE_HEIGHT + STATUSBAR_HEIGHT;
var STATUSBAR_WIDTH               = XSIZE - TOOLBAR_XMAX;
var STATUSBAR_YMIN                = YSIZE - STATUSBAR_HEIGHT;
var IMAGE_WIDTH                   = XSIZE - TOOLBAR_XMAX;
var IMAGE_HEIGHT                  = YSIZE - STATUSBAR_HEIGHT;
var BUTTON_STEP                   = BUTTON_SIZE + BUTTON_SPACING;
var ERASER_RANGE                  = 7;
var ERASER_SIZE                   = ERASER_RANGE * 2;
var ERASIBLE_XMIN                 = TOOLBAR_XMAX + ERASER_RANGE;
var ERASIBLE_YMAX                 = STATUSBAR_YMIN - ERASER_RANGE;
var IMAGE_BG                      = "white";
var IMAGE_FG                      = "black";
var TOOLBAR_COLOR                 = "gray";
var BUTTON_COLOR                  = "silver";
var ICON_COLOR                    = "black";
var STATUSBAR_COLOR               = "silver";
var STATUSTEXT_COLOR              = "black";
var COLOR_PALETTE                 = new Array ();
var NCOLORS                       = 0;
COLOR_PALETTE[NCOLORS++]          = IMAGE_FG;
COLOR_PALETTE[NCOLORS++]          = IMAGE_BG;
COLOR_PALETTE[NCOLORS++]          = "blue";
COLOR_PALETTE[NCOLORS++]          = "red";
COLOR_PALETTE[NCOLORS++]          = "green";
COLOR_PALETTE[NCOLORS++]          = "#C0C000";
var CHOOSER_YMAX                  = YSIZE - BUTTON_SPACING;
var CHSFIELD_SIZE                 = 15;
var CHOOSER_YMIN                  = CHOOSER_YMAX - CHSFIELD_SIZE * NCOLORS;

var canvas = document.createElement ("CANVAS");
canvas.setAttribute ("WIDTH", "" + XSIZE);
canvas.setAttribute ("HEIGHT", "" + YSIZE);
var placeholder;
if (!(placeholder = document.getElementById ("sketchpad")))
	placeholder = document.body;
placeholder.appendChild (canvas);
var ctx = canvas.getContext ("2d");

ctx.fillStyle = TOOLBAR_COLOR;
ctx.fillRect (0, 0, TOOLBAR_XMAX, YSIZE);

var buttonpos = BUTTON_SPACING;
var buttonid = 0;
var btnhelp = new Array ();
var iconbase;
function appendbtn (helpmsg) {
	ctx.fillStyle = BUTTON_COLOR;
	ctx.fillRect (BUTTON_SPACING, buttonpos, BUTTON_SIZE, BUTTON_SIZE);
	iconbase = buttonpos;
	buttonpos += BUTTON_STEP;
	ctx.fillStyle = ICON_COLOR;
	btnhelp[buttonid++] = helpmsg;
	}

function iconscale (a) {
	return Math.floor (a * 0.05 * BUTTON_SIZE);
	}
function iconscalex (x) {
	return BUTTON_SPACING + iconscale (x);
	}
function iconscaley (y) {
	return iconbase + iconscale (y);
	}
function iconmove (relx, rely) {
	ctx.moveTo (iconscalex (relx), iconscaley (rely));
	}
function iconline (relx, rely) {
	ctx.lineTo (iconscalex (relx), iconscaley (rely));
	}

var tbdraw = buttonid;
appendbtn ("Drawing tool");
ctx.beginPath ();
iconmove (5, 1);
iconline (18, 14);
iconline (18, 18);
iconline (14, 18);
iconline (1, 5);
iconline (5, 1);
ctx.fill ();

var tberase = buttonid;
appendbtn ("Erasing tool");
ctx.beginPath ();
iconmove (4, 5);
iconline (19, 5);
iconline (16, 15);
iconline (1, 15);
iconline (4, 5);
ctx.fill ();

var tberall = buttonid;
appendbtn ("Erase all");
ctx.beginPath ();
iconmove (4, 1);
iconline (10, 7);
iconline (16, 1);
iconline (19, 4);
iconline (13, 10);
iconline (19, 16);
iconline (16, 19);
iconline (10, 13);
iconline (4, 19);
iconline (1, 16);
iconline (7, 10);
iconline (1, 4);
iconline (4, 1);
ctx.fill ();


var tbautoline = buttonid;
appendbtn ("Automatic line tool");
ctx.beginPath ();
iconmove (18, 1);
iconline (19, 2);
iconline (2, 19);
iconline (1, 18);
iconline (18, 1);
ctx.fill ();

var tbautorect = buttonid;
appendbtn ("Automatic rectangle tool");
ctx.beginPath ();
iconmove (3, 3);
iconline (17, 3);
iconline (17, 17);
iconline (3, 17);
iconline (3, 3);
ctx.fill ();

function circle (cx, cy, r) {
	ctx.arc (cx, cy, r, 0, Math.PI * 2);
	}

var tbautocircle = buttonid;
appendbtn ("Automatic circle tool");
ctx.beginPath ();
circle (iconscalex (10), iconscaley (10), iconscale (8));
ctx.fill ();

var chsfieldpos = CHOOSER_YMIN;
var fieldidx = 0;
while (chsfieldpos < CHOOSER_YMAX) {
	ctx.fillStyle = COLOR_PALETTE[fieldidx++];
	ctx.fillRect (BUTTON_SPACING, chsfieldpos,
		BUTTON_SIZE, CHSFIELD_SIZE);
	chsfieldpos += CHSFIELD_SIZE;
	}

function clrstatus () {
	ctx.fillStyle = STATUSBAR_COLOR;
	ctx.fillRect (TOOLBAR_XMAX, STATUSBAR_YMIN, XSIZE, YSIZE);
	}
clrstatus ();

function eraseimg () {
	ctx.fillStyle = IMAGE_BG;
	ctx.fillRect (TOOLBAR_XMAX, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
	}
eraseimg ();

function showstatus (msg) {
	clrstatus ();
	if (msg) {
		ctx.textBaseline = "top";
		ctx.textAlign = "left";
		ctx.font = "12px sans-serif";
		ctx.fillStyle = STATUSTEXT_COLOR;
		ctx.fillText (msg, TOOLBAR_XMAX + 2,
			STATUSBAR_YMIN + 4);
		}
	}

var backstatus = "";

function updstatus (msg) {
	backstatus = msg;
	showstatus (backstatus);
	}

showstatus ("Szkicownik - Jan Mleczko, 2023.");

var T_DRAWING = 1, T_ERASING = 2,
	T_RECT = 3, T_LINE = 4, T_CIRCLE = 5;
var tool = T_DRAWING;

var A_OTHER = 0, A_IMAGE = 1, A_TOOLBAR = 2, A_CHOOSER = 3;

function area (x, y) {
	if (x < TOOLBAR_XMAX) {
		if (y >= CHOOSER_YMIN && y < CHOOSER_YMAX)
			return A_CHOOSER;
		return A_TOOLBAR;
		}
	if (y < STATUSBAR_YMIN)
		return A_IMAGE;
	return A_OTHER;
	}

var colornum, colorval;

function choosecolor (n) {
	colornum = n;
	colorval = COLOR_PALETTE[n];
	}
choosecolor (0);

function setfill () {
	ctx.fillStyle = colorval;
	}

function setstroke () {
	ctx.strokeStyle = colorval;
	}

function absline (x1, y1, x2, y2) {
	ctx.beginPath ();
	ctx.moveTo (x1, y1);
	ctx.lineTo (x2, y2);
	ctx.stroke ();
	}

function dragline (x, y) {
	if (islastm) {
		setstroke ();
		absline (mlastx, mlasty, x, y);
		}
	else
		islastm = true;
	mlastx = x;
	mlasty = y;
	}

function eraseat (x, y) {
	if (x < ERASIBLE_XMIN)
		x = ERASIBLE_XMIN;
	if (y > ERASIBLE_YMAX)
		y = ERASIBLE_YMAX;
	ctx.fillStyle = IMAGE_BG;
	ctx.fillRect (x - ERASER_RANGE, y - ERASER_RANGE,
		ERASER_SIZE, ERASER_SIZE);
	}

function usetool (x, y) {
	if (tool == T_DRAWING) {
		dragline (x, y);
		return;
		}
	if (tool == T_ERASING) {
		eraseat (x, y);
		return;
		}
	}

function divide (a, b) {
	return Math.floor (a / b);
	}

var E_CLICK = 1, E_DRAGGING = 2, E_DRAGGED = 3, E_HOVER = 4;

function distance (x1, y1, x2, y2) {
	var xdiff = x2 - x1;
	var ydiff = y2 - y1;
	return Math.round (Math.sqrt (xdiff * xdiff + ydiff * ydiff));
	}

function circletool (centerx, centery, edgex, edgey) {
	var radius = distance (centerx, centery, edgex, edgey);
	var radiuslim;
	radiuslim = centerx - TOOLBAR_XMAX;
	if (radius > radiuslim)
		radius = radiuslim;
	radiuslim = STATUSBAR_YMIN - centery;
	if (radius > radiuslim)
		radius = radiuslim;
	setfill ();
	ctx.beginPath ();
	circle (centerx, centery, radius);
	ctx.fill ();
	}

function imgevent (type, x, y, oldx, oldy) {
	if (tool == T_DRAWING) {
		if (type == E_DRAGGING) {
			setstroke ();
			absline (oldx, oldy, x, y);
			}
		}
	else if (tool == T_ERASING) {
		if (type == E_DRAGGING)
			eraseat (x, y);
		}
	else if (tool == T_LINE) {
		if (type == E_DRAGGED) {
			setstroke ();
			absline (oldx, oldy, x, y);
			}
		}
	else if (tool == T_RECT) {
		if (type == E_DRAGGED) {
			setfill ();
			ctx.fillRect (oldx, oldy, x - oldx, y - oldy);
			}
		}
	else if (tool == T_CIRCLE) {
		if (type == E_DRAGGED)
			circletool (x, y, oldx, oldy);
		}
	}

var tooltip;

function toolbtnevent (type, b) {
	if (type == E_CLICK) {
		if (b == tbdraw)
			tool = T_DRAWING;
		else if (b == tberase)
			tool = T_ERASING;
		else if (b == tberall)
			eraseimg ();
		else if (b == tbautoline)
			tool = T_LINE;
		else if (b == tbautorect)
			tool = T_RECT;
		else if (b == tbautocircle)
			tool = T_CIRCLE;
		}
	else if (type == E_HOVER)
		tooltip = btnhelp[b];
	}

function toolbarevent (type, x, y, oldx, oldy) {
	if (y < buttonpos && y % BUTTON_STEP >= BUTTON_SPACING)
		toolbtnevent (type, divide (y, BUTTON_STEP));
	}

function chooserevent (type, x, y) {
	if (type == E_CLICK)
		choosecolor (divide (y - CHOOSER_YMIN, CHSFIELD_SIZE));
	else if (type == E_HOVER)
		tooltip = "Choose drawing color";
	}

function genevent (type, x, y, oldx, oldy) {
	var a = area (x, y);
	if (a == A_IMAGE)
		imgevent (type, x, y, oldx, oldy);
	else if (a == A_TOOLBAR)
		toolbarevent (type, x, y);
	else if (a == A_CHOOSER)
		chooserevent (type, x, y);
	}

var mpressed = false;
var lastx, lasty, origx, origy;

function xcoord (event) {
	return event.offsetX;
	}
function ycoord (event) {
	return event.offsetY;
	}

canvas.onmousedown = function (evt) {
	var x = xcoord (evt);
	var y = ycoord (evt);
	genevent (E_CLICK, x, y, 0, 0);
	origx = lastx = x;
	origy = lasty = y;
	mpressed = true;
	}

canvas.onmousemove = function (evt) {
	var x = xcoord (evt);
	var y = ycoord (evt);
	if (mpressed) {
		if (area (x, y) == area (lastx, lasty)) {
			genevent (E_DRAGGING, x, y, lastx, lasty);
			lastx = x;
			lasty = y;
			}
		}
	else {
		tooltip = backstatus;
		genevent (E_HOVER, x, y, 0, 0);
		showstatus (tooltip);
		}
	}

canvas.onmouseup = function (evt) {
	var x = xcoord (evt);
	var y = ycoord (evt);
	if (mpressed && (area (x, y) == area (origx, origy))) {
		genevent (E_DRAGGED, x, y, origx, origy);
		mpressed = false;
		}
	}

canvas.onmouseout = function () {
	mpressed = false;
	showstatus (backstatus);
	}

