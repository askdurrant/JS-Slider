var slideFunc = function(container, config){

    var container = container;
    
    //Config Attributes
    var delay = config['delay'];
    var interval = config['interval'];
    var direction = config['direction'];
    var animSpeed = config['animSpeed'];
    var controls = config['controls'];
    var pauseOnHover = config['pauseOnHover'];
    var animSlide = config ['animSlide'];
    var animFade = config ['animFade'];
    var anim = config ['anim'];
    var progressBar = config ['progressBar'];
    var changeDir = config ['changeDir'];

    //Set default values for config attributes
    var defaultDelay = 0;
    var defaultInterval = 1000;
    var defaultDirection = 'left';
    var defaultAnimSpeed = 800;
    var defaultControls = true;
    var defaultPauseOnHover = true;
    var defaultAnimSlide = false;
    var defaultAnimFade = false;
    var defaultAnim = true;
    var defaultProgress = false;
    var defaultChangeDir = false;

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
    pauseOnHover = (typeof pauseOnHover === "undefined") ? defaultPauseOnHover : pauseOnHover;
    animSlide = (typeof animSlide === "undefined") ? defaultAnimSlide : animSlide;
    animFade = (typeof animFade === "undefined") ? defaultAnimFade : animFade;
    anim = (typeof anim === "undefined") ? defaultAnim : anim;
    progressBar = (typeof progressBar === "undefined") ? defaultProgress : progressBar;

    //Find number of pics and last pic position
    var pictureNum = $(container + ' .box').length;
    var lastPic = pictureNum - 1;

    if(animSlide === true){

        if(progressBar === true){
            $('.button').prepend('<ul class="progress-bar"></ul>');
            for(i=0; i < pictureNum; i++){
                boxNumber = 'position' + (i+1);
                boxElement = $('.box')[i];
                $('.progress-bar').append('<li class="' + boxNumber + '">' + (i + 1) + '</li>');
                $(boxElement).addClass(boxNumber);
            }
            var selectedBox = $('.box')[0];
            $(selectedBox).addClass('selected');      

            if($(container + ' > div').hasClass('selected') === true){
                console.log($('.selected').attr("class"));
            }       

            var blah = 'position' + [0];
            var blahCont = $(container + ' .box')[0];

        }

        
        // Adds Controls
        if (controls === true && (direction === 'left' || direction === 'right')){
            $(container).after('<div class="controls"><div class="slider-left"></div><div class="slider-right"></div></div>');
        }

        var animSlideFn = function(){
            //Sets width of container
            if (direction === "left" || direction === "right"){
                var totalContainerWidth = pictureNum * 100 + '%';
                $(container).width(totalContainerWidth);
            }

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
            if(anim === true){
                var time = setInterval(function(){slide();},interval);
            }
            //Positions bottom of container div to bottom of viewport
            if (direction === 'top'){
                var topStyle = {}
                bottomPercentage = (pictureNum - 1) * 100 + '%';
                topStyle['bottom'] = bottomPercentage;
                $(container).css(topStyle);
                // Reverse order of divs so 1st div is in 1st position
                reverseOrder = $(container).children('div');
                $(container).append(reverseOrder.get().reverse());
            };

            //Adds class for left and right directions for initial direction definition
            if(direction === 'left'){
                $(container + '> .box').addClass('box-left');
                var boxWidth = (100 / pictureNum) + '%';
                $('.box-left').css('width', boxWidth);
            }
            else if(direction === 'right'){
                $(container + '> .box').addClass('box-right');
                var boxWidth = (100 / pictureNum) + '%';
                $('.box-right').css('width', boxWidth);
            }
            else{
                console.log(direction)
            }

            //Changes direction of slide on mouse click
            //Checks if animation is already in progress. If so, stroes string in
            //queueDirectionChange
            if(changeDir === true){

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
                            $(container).css('left', '').css('right', '');
                            return direction;
                        }
                    }
                };
            }
            
            // Automatic animation option
            if(anim === true){
                //Slide Function. If animation is progress, will not animate
                var slide = function(){
                    if (availableForAnimating === false){
                        return false;
                    }

                    //Test to see if direction change has been queued up
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
                        animReset[direction] = '';
                        var animDirec;

                        //Set slide functions for left, right, bottom
                        var slideAll = function(){
                            $(first).animate(animDirec,animSpeed, function(){
                                $(first).insertAfter(last);
                                $(first).css(animReset);
                            });
                            $(second).animate(animDirec,animSpeed, function(){
                                $(second).css(animReset);
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
                                $(this).css(animReset);
                            });
                            $(secondLast).animate(animDirec,animSpeed, function(){
                                $(secondLast).css(animReset);
                                $(secondLast).addClass('second');
                                $(this).css(animReset);
                                availableForAnimating = true; //Avaiable for animating again
                            });                     
                        };

                        //Set animate CSS Direction
                        if(direction === 'bottom'){
                            animDirec = {};
                            animDirec[direction] = '100%';
                            slideAll();
                        }
                        else if(direction === 'left'){
                            animDirec = {};
                            animDirec[direction] = -100 / pictureNum + "%";
                            slideAll();
                        }
                        else if(direction === 'right'){
                            animDirec = {};
                            animDirec[direction] = -100 / pictureNum + "%";
                            slideAll();
                        }
                        else if(direction === 'top'){
                            animDirec = {};
                            animDirec[direction] = '100%';
                            slideTop();
                        }

                    }, delay);
                };                
            }


            //Pause on hover functions
            if (pauseOnHover === true){
                //Add controls
                $(container).after('<div class="status"><div class="slider-play slider-button"></div><div class="slider-pause slider-button"></div></div>');
                //Hide and show play and pause buttons
                var playButton = function(){
                    $('.slider-pause').css('display','none');
                    $('.slider-play').css('display','block').fadeOut(1500, function(){
                        $(this).css('display', 'none');
                    });
                };

                var pauseButton = function(){
                    $('.slider-pause').css('display', 'block');
                };  

                //Stop on hover
                $('.viewport').on('mouseenter', function(){
                    window.clearInterval(time);
                    pauseButton();
                });
                $('.viewport').on('mouseleave',function(){
                    time = setInterval(function(){slide()},interval);
                    playButton();
                });

                playButton();
            }

            //Change direction
            $('.slider-switch').on('click', changeDirection);

            //Manual Slide function on click or keyboard event
            //Controls are on by default
            var animReset = {};
            animReset[direction] = '0%';
            var keyPressFunction;

            var animInProgress = false;

            $(window).on('keydown', keyPressFunction);

            $('.slider-left').on('click', keyPressFunction);
            $('.slider-right').on('click', keyPressFunction);



            function keyPressFunction(e){

            if (controls === true) {
                var keyPressLeft = (typeof e.which != 'undefined' && e.which === 37); //Left arrow
                var keyPressRight = (typeof e.which != 'undefined' && e.which === 39); //Right arrow

                var clickPressVarLeft = (typeof e.which != 'undefined' && $(this).is(".slider-left") === true);
                var clickPressVarRight = (typeof e.which != 'undefined' && $(this).is(".slider-right") === true);

                if ( keyPressLeft === true || clickPressVarLeft === true){

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
                                if(anim === true){
                                    slide();
                                }
                            };
                            
                            var animDirec = {};
                            animDirec[direction] = -100 / pictureNum + "%";
                            manualSlideAll();
                        }
                        else if (direction === "right"){
                            var manualSlideAll = function(){
                                $(last).insertBefore(first);
                                $(container).css({'left': -(pictureNum - 2)*100 + '%'});

                                // console.log(-(pictureNum - 2)*100);  REMMMMMOOOVVVVEEEEEEEEEEEE

                            $(first).animate(animDirec,animSpeed);

                            $(last).animate(animDirec,animSpeed, function(){
                                $(container).css({'left':containerOffset});
                                $(last).css(animReset);
                                $('.box').css({'right':'0%'});
                                animInProgress = false;
                                availableForAnimating = true;
                                $('.box').css({'left': ''});
                                });
                                if(anim === true){
                                    slide();
                                }
                            };
                            
                            var animDirec = {};
                            animDirec[direction] = 100 / pictureNum + "%";
                            manualSlideAll();
                        }
                    
                    } else if ( keyPressRight === true || clickPressVarRight === true ) {
                        
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
                                
                                $(first).animate(animDirec,animSpeed, function(){
                                    $(this).css({'left' : ''});
                                });

                                $(last).animate(animDirec,animSpeed, function(){
                                    $(container).css({'left':'0%'});
                                    $(last).css(animReset);
                                    $(this).css({'left':''});
                                    animInProgress = false;
                                    availableForAnimating = true;
                                });
                                if(anim === true){
                                    slide();
                                }

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
                                if(anim === true){
                                    slide();
                                }
                            };
                            
                            var animDirec = {};
                            animDirec[direction] = -100 / pictureNum + "%";
                            manualSlideAll();
                        }
                    }
                }
            }
        }
        animSlideFn();
    }
    //Fade functionality
    //Images will cycle through with a fade animation.
    else if (animFade === true){

        $(container + ' .box').css("position", "absolute");
        $(container + ' .box:not(:first)').css("display","none");
        var fadeInterval = setInterval(function(){fade()},interval);
        var fade = function(){
            
                var first = $(container + ' .box')[0];
                var second = $(container + ' .box')[1];
                var last = $(container + ' .box')[lastPic];

                $(first).css("display","block").fadeOut(animSpeed, function(){
                    $(first).css("display", "none");
                    $(first).insertAfter(last);
                });
                $(second).fadeIn(animSpeed, function(){
                    $(second).css("display","block");                       
            });
        }
        //Pause on hover function - As above
        if (pauseOnHover === true){
            //Add controls
            $(container).after('<div class="status"><img class="slider-play slider-button" src="http://riverisland.scene7.com/is/image/RiverIsland/play?$PNG%20Alpha%20Transparency$" style="display:none"/><img class="slider-pause slider-button" src="http://riverisland.scene7.com/is/image/RiverIsland/pause?$PNG%20Alpha%20Transparency$" style="display:none"/></div>');
            //Hide and show play and pause buttons
            var playButton = function(){
                $('.slider-pause').css('display','none');
                $('.slider-play').css('display','block').fadeOut(animSpeed, function(){
                    $(this).css('display', 'none');
                });
            };

            var pauseButton = function(){
                $('.slider-pause').css('display', 'block');
            };  

            //Stop on hover
            $('.viewport').on('mouseenter', function(){
                window.clearInterval(fadeInterval);
                pauseButton();
            });
            $('.viewport').on('mouseleave',function(){
                fadeInterval = setInterval(function(){fade()},interval);
                playButton();
            });

            playButton();
        }
    }
};

$(document).ready( 
	slideFunc('.container', {direction: 'left', interval:1000, delay:0, animSpeed:800, controls: true, pauseOnHover: true, animSlide: true, anim: true, progressBar: true, changeDir: true})
);






