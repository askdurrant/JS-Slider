var slideFunc = function(container, config){

	var container = container;
	
	//Config Attributes
	var delay = config['delay'];
	var interval = config['interval'];
	var direction = config['direction'];
	var animSpeed = config['animSpeed'];
	var controls = config['controls'];

	//Set default values for config attributes
	var defaultDelay = 1000;
	var defaultInterval = 1000;
	var defaultDirection = 'left';
	var defaultAnimSpeed = 800;
	var defaultControls = false;

	//Animate by default
	var availableForAnimating = true;

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

	//Set width of container
	var totalContainerWidth = pictureNum * 100 + '%';
	$(container).width(totalContainerWidth);

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

	containerOffsetFn();

	//Set Interval
	var time = setInterval(function(){slide()},interval);

	if (direction === 'top'){
		//Positions bottom of container div to bottom of viewport
		var topStyle = {}
		bottomPercentage = (pictureNum - 1) * 100 + '%';
		topStyle['bottom'] = bottomPercentage;
		$(container).css(topStyle);
	}

	//Add class
	if(direction === 'left'){
		$('.box').addClass('box-left');
	}
	else if(direction === 'right'){
		$('.box').addClass('box-right');
	}

	//Change direction of slider
	var queueDirection;

	var changeDirection = function(){
		if (animInProgress === true || availableForAnimating === false){
			queueDirection = 'queue';
			return queueDirection;
		}

		else{
			if(direction === 'left'){
				direction = 'right';
				$(container).removeClass('left').addClass('right').css('left',containerOffset);
				$('.box').removeClass('box-left').addClass('box-right');
				$('.box').css('left', '').css('right','')
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

	$('.slider-switch').on('click', changeDirection);

	//Slide Function
	var slide = function(){
		if (availableForAnimating === false){
			return false;
		}

		if (queueDirection !== undefined){
			changeDirection();
			queueDirection = undefined;
		}

		//Set container offset for right animation
		containerOffsetFn();

		availableForAnimating = false;
		var slideTimer = setTimeout(function(){
			var first = $(container + ' .box')[0];
			var second = $(container + ' .box')[1];
			var secondLast = $(container + ' .box')[lastPic - 1];
			var last = $(container + ' .box')[lastPic];

			//Set animate end point
			var animReset = {};
			animReset[direction] = '0%';

			//Set slide functions
			var slideAll = function(){
				$(first).animate(animDirec,animSpeed, function(){
					$(first).insertAfter(last);
					$(first).css(animReset);
					$(first).addClass('first');
				});
				$(second).animate(animDirec,animSpeed, function(){
					$(second).css(animReset);
					$(second).addClass('second');
					availableForAnimating = true;
				});
			};

			//Slide down from top function
			var slideTop = function(){

				//Positions bottom of container div to bottom of viewport
				var topStyle = {}
				bottomPercentage = (pictureNum - 1) * 100 + "%";
				topStyle['bottom'] = bottomPercentage;
				$(container).css(topStyle);

				//Animation
				$(last).animate(animDirec,animSpeed, function(){
					$(last).insertBefore(first);
					$(last).css(animReset);
					$(last).addClass('first');
				});
				$(secondLast).animate(animDirec,animSpeed, function(){
					$(secondLast).css(animReset);
					$(secondLast).addClass('second');
					availableForAnimating = true;
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
		console.log('blaj');
		clearInterval(time);
	});
	$('.viewport').on('mouseleave',function(){
		time = setInterval(function(){slide()},interval);
	});

	//Manual Slide	
	if (controls === true) {
		var animReset = {};
		animReset[direction] = '0%';

		var animInProgress = false;

		$(window).on('keydown', keyPressFunction);

		$('.slider-left').on('click', keyPressFunction);
		$('.slider-right').on('click', keyPressFunction);

		function keyPressFunction(e){

			var keyPressLeft = (typeof e.which != 'undefined' && e.which === 37);
			var keyPressRight = (typeof e.which != 'undefined' && e.which === 39);

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
						$(container).css({'left': -(pictureNum - 2)*100 + '%'})

					$(first).animate(animDirec,animSpeed);

					$(last).animate(animDirec,animSpeed, function(){
						$(container).css({'left':containerOffset});
						$(last).css(animReset);
						$('.box').css({'right':'0%'});
						animInProgress = false;
						availableForAnimating = true;
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
						});
						$(second).animate(animDirec,animSpeed, function(){
							$(second).css(animReset);
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