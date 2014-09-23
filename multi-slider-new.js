var slideFunc = function(container, config){

	var container = container;
	
	//Config Attributes
	var delay = config['delay'];
	var interval = config['interval'];
	var direction = config['direction'];
	var animSpeed = config['animSpeed'];
	var controls = config['controls'];

	//Set default values for config attributes
	var defaultDelay = 0;
	var defaultInterval = 1000;
	var defaultDirection = 'left';
	var defaultAnimSpeed = 800;
	var defaultControls = true;

	//Available for animating. Sets default value to true
	var availableForAnimating = true;

	//Stores value if a change of direction is requested during an animation is active
	var queueDirectionChange;

	//Test to see if any attributes are undefined.
	//If undefined set to default value
	delay = (typeof delay === "undefined") ? defaultDelay : delay;
	interval = (typeof interval === "undefined") ? defaultInterval : interval;
	direction = (typeof direction === "undefined") ? defaultDirection : direction;
	animSpeed = (typeof animSpeed === "undefined") ? defaultAnimSpeed : animSpeed;
	controls = (typeof controls === "undefined") ? defaultControls : controls;

	//Find number of pics and last pic position
	var pictureNum = $(container + ' .box').length;
	var lastPic = pictureNum - 1;

	//Sets width of container
	var totalContainerWidth = pictureNum * 100 + '%';
	$(container).width(totalContainerWidth);

	//Calculates the offset for the container if the direction is 'right'
	var containerOffset;
	var containerOffsetFn = function(){
		if(direction === 'right'){
			containerOffset = -(pictureNum - 1) * 100 + '%';
			$(container).css('left', containerOffset);
		}
		else{
			return false;
		}
	};

	//Calls function in case direction is 'right' intially
	containerOffsetFn();

	//Sets interval for slide function
	var time = setInterval(function(){slide()},interval);

	//Positions bottom of container div to bottom of viewport
	if (direction === 'top'){
		var topStyle = {}
		bottomPercentage = (pictureNum - 1) * 100 + '%';
		topStyle['bottom'] = bottomPercentage;
		$(container).css(topStyle);
	}

	//Adds class for left and right directions for initial direction definition
	if(direction === 'left'){
		$('.box').addClass('box-left');
	}
	else if(direction === 'right'){
		$('.box').addClass('box-right');
	}

	//Changes direction of slide on mouse click
	//Checks if animation is already in progress. If so, stroes string in
	//queueDirectionChange
	var changeDirection = function(){
		if (animInProgress === true || availableForAnimating === false){
			queueDirectionChange = 'queue';
			return queueDirectionChange;
		}
		else{
			if(direction === 'left'){
				direction = 'right';
				$(container).removeClass('left').addClass('right').css('left',containerOffset);
				$('.box').removeClass('box-left').addClass('box-right');
				$('.box').css('left', '').css('right','');
				containerOffsetFn();
				return direction;
			}
			else if(direction === 'right'){
				direction = 'left';
				$(container).removeClass('right').addClass('left').css('left', '');
				$('.box').removeClass('box-right').addClass('box-left');
				$(container).css('right', '');
				return direction;
			}
		}
	};

	//Slide Function. If animation is progress, will not animate
	var slide = function(){
		if (availableForAnimating === false){
			return false;
		}

		if (queueDirectionChange !== undefined){
			changeDirection();
			queueDirectionChange = undefined;
		}

		//Check if 'right', sets container offset for right animation
		containerOffsetFn();

		//Flag so no further animations will take place
		availableForAnimating = false;

		//If a delay is required for multiple slide animations
		//slideTImer function is used. Default = 0ms
		var slideTimer = setTimeout(function(){
			//Defines positions of .boxes in container array
			var first = $(container + ' .box')[0];
			var second = $(container + ' .box')[1];
			var secondLast = $(container + ' .box')[lastPic - 1];
			var last = $(container + ' .box')[lastPic];

			//Set animate end point
			var animReset = {};
			animReset[direction] = '0%';

			//Set slide functions for left, right, bottom
			var slideAll = function(){
				$(first).animate(animDirec,animSpeed, function(){
					$(first).insertAfter(last);
					$(first).css(animReset);
					$(first).addClass('first');
				});
				$(second).animate(animDirec,animSpeed, function(){
					$(second).css(animReset);
					$(second).addClass('second');
					availableForAnimating = true; //Avaiable for animating again
				});
			};

			//Slide down from top function
			var slideTop = function(){

				//Positions bottom of container div to bottom of viewport
				var topStyle = {}
				bottomPercentage = (pictureNum - 1) * 100 + "%";
				topStyle['bottom'] = bottomPercentage;
				$(container).css(topStyle);

				$(last).animate(animDirec,animSpeed, function(){
					$(last).insertBefore(first);
					$(last).css(animReset);
					$(last).addClass('first');
				});
				$(secondLast).animate(animDirec,animSpeed, function(){
					$(secondLast).css(animReset);
					$(secondLast).addClass('second');
					availableForAnimating = true; //Avaiable for animating again
				}); 					
			};

			//Set animate CSS Direction
			if(direction === 'bottom'){
				var animDirec = {};
				animDirec[direction] = '100%';
				slideAll();
			}
			
			else if(direction === 'left'){
				var animDirec = {};
				animDirec[direction] = -100 / pictureNum + "%";
				slideAll();
			}

			else if(direction === 'right'){
				var animDirec = {};
				animDirec[direction] = -100 / pictureNum + "%";
				slideAll();
			}

			else if(direction === 'top'){
				var animDirec = {};
				animDirec[direction] = '100%';
				slideTop();
			}

 		}, delay);
	};

	//Stop on hover
	$('.viewport').on('mouseenter', function(){
		clearInterval(time);
	});
	$('.viewport').on('mouseleave',function(){
		time = setInterval(function(){slide()},interval);
	});

	//Change direction
	$('.slider-switch').on('click', changeDirection);

	//Manual Slide function on click or keyboard event
	//Controls are on by default
	if (controls === true) {
		var animReset = {};
		animReset[direction] = '0%';

		var animInProgress = false;

		$(window).on('keydown', keyPressFunction);

		$('.slider-left').on('click', keyPressFunction);
		$('.slider-right').on('click', keyPressFunction);

		function keyPressFunction(e){

			var keyPressLeft = (typeof e.which != 'undefined' && e.which === 37); //Left arrow
			var keyPressRight = (typeof e.which != 'undefined' && e.which === 39); //Right arrow

			var clickPressVarLeft = (typeof e.which != 'undefined' && $(this).is(".slider-left") === true);
			var clickPressVarRight = (typeof e.which != 'undefined' && $(this).is(".slider-right") === true);

			if ( keyPressLeft || clickPressVarLeft ){

				if (animInProgress === true || availableForAnimating === false){
					return false;
				}

				animInProgress = true;
				availableForAnimating = false;
			
				var first = $(container + ' .box')[0];
				var second = $(container + ' .box')[1];
				var secondLast = $(container + ' .box')[lastPic - 1];
				var last = $(container + ' .box')[lastPic];

				if (direction === "left"){

					var manualSlideAll = function(){
						$(first).animate(animDirec,animSpeed, function(){
							$(first).insertAfter(last);
							$(first).css(animReset);
						});
						$(second).animate(animDirec,animSpeed, function(){
							$(second).css(animReset);
							animInProgress = false;
							availableForAnimating = true;
							$('.box').css('left', '').css('right','')
						});
						slide();
					};
					
					var animDirec = {};
					animDirec[direction] = -100 / pictureNum + "%";
					manualSlideAll();
				}
				else if (direction === "right"){
					var manualSlideAll = function(){
						$(last).insertBefore(first);
						$(container).css({'left': -(pictureNum - 2)*100 + '%'});

					$(first).animate(animDirec,animSpeed);

					$(last).animate(animDirec,animSpeed, function(){
						$(container).css({'left':containerOffset});
						$(last).css(animReset);
						$('.box').css({'right':'0%'});
						animInProgress = false;
						availableForAnimating = true;
						$('.box').css({'left': ''});
						});
						slide();
					};
					
					var animDirec = {};
					animDirec[direction] = 100 / pictureNum + "%";
					manualSlideAll();
				}
			
			} else if ( keyPressRight || clickPressVarRight ) {
				
				if (animInProgress === true || availableForAnimating === false){
					return false;
				}

				animInProgress = true;
				availableForAnimating = false;
			
				var first = $(container + ' .box')[0];
				var second = $(container + ' .box')[1];
				var secondLast = $(container + ' .box')[lastPic - 1];
				var last = $(container + ' .box')[lastPic];

				if (direction === "left"){
					var manualSlideAll = function(){
						$(last).insertBefore(first);
						$(container).css({'left':'-100%'});
						
						$(first).animate(animDirec,animSpeed);

						$(last).animate(animDirec,animSpeed, function(){
							$(container).css({'left':'0%'});
							$(last).css(animReset);
							$('.box').css({'left':'0%'});
							animInProgress = false;
							availableForAnimating = true;
						});
						slide();

					};
						
					var animDirec = {};
					animDirec[direction] = 100 / pictureNum + "%";
					manualSlideAll();
				}
				else if (direction === "right"){
					var manualSlideAll = function(){
						$(first).animate(animDirec,animSpeed, function(){
							$(first).insertAfter(last);
							$(first).css(animReset);
							$(first).css('left', '').css('right', '');
						});
						$(second).animate(animDirec,animSpeed, function(){
							$(second).css(animReset);
							$(second).css('left', '').css('right', '');
							animInProgress = false;
							availableForAnimating = true;
						});
						slide();
					};
					
					var animDirec = {};
					animDirec[direction] = -100 / pictureNum + "%";
					manualSlideAll();
				}
				
			}
			else{
				return false;
			}
		};
	};
};

$(document).ready(
slideFunc('.container', {direction: 'left', interval:3000, delay:0, animSpeed:800, controls: true})
);