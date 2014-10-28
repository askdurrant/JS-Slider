MULTI PURPOSE SLIDER / FADER
============================

A small, multi-purpose javascript plug-in for easy to use animated sliders and faders.


Available Options
-----------------

* delay (default = 0) - Sets a delay in starting animation (integer in ms)
* interval (default = 0) - Sets time between each animation (integer in ms)
* direction (default = left) - Sets direction of movement (Possible values: top, bottom, left, right)
* animSpeed (default = 800) - Sets speed of animation transition (integer in ms)
* controls (default = true) - Defines if you want left/right controls. Keypress left and right also work (Possible values: true, false)
* pauseOnHover (default = true) - Defines whether the animation will pause when you hover your mouse (Possible values: true, false)
* animSlide (default = false) - Sets the animation type to a slider (Possible values: true, false)
* animFade (default = false) - Sets the animation type to a fader (Possible values: true, false)
* anim (default = true) - Defines if you want animations to happen automatically (Possible values: true, false)
* progress(default = false) - Defines if you want a progress bar to show which slide you are on (NOT AVAILABLE YET)


Setup
-----

Include the jQuery library in your document.

### Example layout:

__HTML__

<div class="viewport">
	<div class="example-container">
		<div class="box slide1">
		</div>
		<div class="box slide2">
		</div>
		<div class="box slide3">
		</div>
		<div class="box slide4">
		</div>
	</div>
</div>

__CSS__

/* REQUIRED CSS */

.viewport{
	height:100%;
	width:100%;
	overflow: hidden;
	position:relative;
}

.container{
	position:relative;
	height:100%;
}

.box{
	display:block;
	position:relative;
}

.box-left{
	float: left;
}
.box-right{
	float:right;
}

/* CSS FOR PLAY/PAUSE & CONTROLS */

.controls{
	margin: auto;
	position: absolute;
	height: 80px;
	top: 0; left: 0; bottom: 0; right: 0;
}

.controls .slider-left,
.controls .slider-right{
	height:80px;
	width:80px;
	background-repeat: no-repeat;
	opacity: 0.3;
	filter: alpha(opacity=30);
	transition: opacity .25s ease-in-out;
   -moz-transition: opacity .25s ease-in-out;
   -webkit-transition: opacity .25s ease-in-out;
}

.controls .slider-left{
	background: url('images/left.png');
	float: left;
}

.controls .slider-right{
	background: url('images/right.png');
	float: right;
}

.controls .slider-left:hover,
.controls .slider-right:hover
{
	opacity: 1;
	filter: alpha(opacity=100);
}

/* CHANGE DIRECTION */

.change-direction{
	background: url('images/switch.png');
	height: 60px;
	width: 60px;
	position: absolute;
	left: 0;
	bottom: 0;
	opacity: 0.3;
	filter: alpha(opacity=30);
	transition: opacity .25s ease-in-out;
   -moz-transition: opacity .25s ease-in-out;
   -webkit-transition: opacity .25s ease-in-out;
}

.change-direction:hover{
	opacity: 1;
	filter: alpha(opacity=100);	
}

.slider-switch{
	height: 100%;
	width: 100%;
}

/* PLAY / PAUSE */

.slider-button{
	height:60px;
	width: 60px;	
	position: absolute;
	margin: auto;
	right: 2%;
	bottom: 2%;
	z-index: 999;
}

.slider-play{
	background: url(images/play.png);
}

.slider-pause{
	background: url(images/pause.png);
}



Images can either be put directly inside the .box divs or can be set as background images of .slide1, .slide2 etc.

### Calling the Script


$(document).ready( 
	slideFunc('//Class of the container', { //OPTIONS HERE })
);

To define options, put inside the {} seperated by a comma.

Eg.

$(document).ready( 
	slideFunc('.example-container', { delay: 2000, animFade: true, pauseOnHover: true })
);

### Requirements

1. The container class must be defined on calling the script
2. Each slide must have the class '.box' for the slider to work