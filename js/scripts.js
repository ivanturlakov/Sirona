$(function(){

	var win = $(window);
	var scrollTop = win.scrollTop();
	var isTouchDevice = 'ontouchstart' in document.documentElement;
	
	
	//Mobile Nav
	var navToggle = $("a.nav-toggle");
	navToggle.click(function(){
		$(".navbar ul").slideToggle("slow");
		navToggle.toggleClass("open");
		return false;
	});


	/* auth box */
	var overlay = $("#overlay");
	var authBox = $("#auth-box");

	$("a.login-link:not(.active)").click(function(){
		$(".auth-form", authBox).hide().eq(0).show();
		overlay.fadeIn(500);
		authBox.addClass("opened");
		return false;
	});

	$("a.btn-close", authBox).add(overlay).click(function(){
		$("input[type='password']", authBox).val("");
		authBox.removeClass("opened");
		overlay.fadeOut(300);
		return false;
	});


	/* contact box */
	var contactBox = $(".contact-holder");
	$("a.lnk-contact").add("a.btn-close", contactBox).click(function(){
		$("a.lnk-contact").toggleClass("active");
		contactBox.slideToggle(300);
		return false;
	});


	/* video */
	var videoOverlay = $("#video-overlay");
	var jsPlayer = null;
	var replay;

	videojs.Replay = videojs.Button.extend({
    	init: function(player, options){
      		videojs.Button.call(this, player, options);
      		this.on('click', this.onClick);
    	}
  	});

  	videojs.Replay.prototype.onClick = function() {
    	jsPlayer.currentTime(0);
			jsPlayer.play();
  	};

  	var createReplayButton = function() {
    	var props = {
        	className: 'vjs-replay-button vjs-control',
        	innerHTML: '<div class="vjs-control-content"></div>',
        	role: 'button',
        	tabIndex: 0
      	};
    	return videojs.Component.prototype.createEl(null, props);
  	};

  	videojs.plugin('replay', function() {
    	var options = { 'el' : createReplayButton() };
    	replay = new videojs.Replay(this, options);
    	this.controlBar.el().appendChild(replay.el());
  	});

	$(".video-box").click(function(){
		var playerId = $(this).data("player");
		if(typeof playerId == "undefined") return false;

		var playerBox = $("#" + playerId);
		if(!playerBox.length) return false;

		videoOverlay.fadeIn(500);
		
		//videojs
  		jsPlayer = videojs( playerId + "_video", { 
  			width: "100%", 
  			height: "100%", 
  			autoplay: true,
  			plugins: { 
  				replay: {}
  			},
  			children: {
			    controlBar: {
			        children: [
			        	'progressControl',
			        	'fullscreenToggle',
			        	'currentTimeDisplay',
			        	'durationDisplay',
			            'volumeControl'
			        ]
			    }
			}
  		});

  		jsPlayer.currentTime(0);
  		jsPlayer.play();
  		playerBox.show();

		return false;
	});

	$("a.btn-video-close").add(videoOverlay).click(function(){
		$(".video-player").hide();
		videoOverlay.fadeOut(300);

		if(jsPlayer != null){
			jsPlayer.pause();
	  	}

		return false;
	});



	/* sliders */
    $(".slider").each(function(){
		var slider = $(this);
      	slider.cycle({
			fx: "fade",
			speed: 1000,
			timeout: 5000,
			swipe: true,
			pauseOnHover: true,
			slides: $(".slide", slider),
			pagerActiveClass: "active",
			pager: $(".slider-nav div", slider),
			pagerTemplate: "<span><em>{{slideNum}}</em></span>",
			log: false
		});

	});

	/* mini slides */
	/**/
	$(".slide-point").click(function(){
		var btn = $(this),
			slider = $("#" + btn.data("for")),
			slide = $("#" + btn.data("slide"));

		if(btn.hasClass("active") || !slider.length || !slide.length) return false;

		$(".col-slide", slider).hide();
		slide.fadeIn(500);

		btn.parent(".slide-points").find(".active").removeClass("active");
		btn.addClass("active");

		return false;
	});


	if(!device.mobile() && window.innerWidth >= 768){


		/* home tiles */
		var showTiles = function(){}
		var homeTiles = $(".home-tiles .tile").css({opacity:0});
		showTiles = function(){
			if(scrollTop >= 300 && scrollTop <= 1000) {
				$.shuffle(homeTiles).each(function(index){
					$(this).delay(index * 200).animate({opacity: 1}, 1000);
				});
				showTiles = function(){}
			}
		}
		

		/* fixed nav */
		var navSection = $("div.navbar");
		if(!navSection.hasClass("navbar-fixed")){
			var debounceScrollTimeout,
				subNavOffset = navSection.offset().top,
				shouldBeFixed = isFixed = false;

		    win.bind("scroll", function() {
			    clearTimeout(debounceScrollTimeout);
				debounceScrollTimeout = setTimeout(function(){
					scrollTop = win.scrollTop();
			        shouldBeFixed = scrollTop >= subNavOffset;
			        if(shouldBeFixed && !isFixed){
						navSection.addClass("navbar-fixed");
			            isFixed = true;
			        } else if(!shouldBeFixed && isFixed){
						navSection.removeClass("navbar-fixed");
			            isFixed = false;
			        }

			        showTiles(scrollTop);

				}, 10);
		    }).trigger("scroll");
		}



	    /* resize full-height sections */
	    var fullHeightSections = $(".full-height");

	    if(fullHeightSections.length){
		    win.bind("resize", function(){
		    	var newHeight = Math.max(700, win.height());
		    	fullHeightSections.height(newHeight);
		    	subNavOffset = navSection.offset().top;
		    }).trigger("resize");
		}


		/* skrollr */
		if(!isTouchDevice && typeof skrollr !== "undefined"){

			var s;
			setTimeout(function(){
				s = skrollr.init({
					constants: {
		        		offset: -400,
		        		offset2t: 700,
		        		offset2b: -700
		    		},
		    		forceHeight: false,
		    		beforerender: function(data){
			            //one way animation
			            return data.direction == 'down';
			        }/*,
			        render: showTiles*/
				});
				//s.refresh($('.section-black, .section-white, .section-blue'));
			}, 100);

		}

	}


});


/*
 * jQuery shuffle
 *
 * Copyright (c) 2008 Ca-Phun Ung 
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://yelotofu.com/labs/jquery/snippets/shuffle/
 *
 * Shuffles an array or the children of a element container.
 * This uses the Fisher-Yates shuffle algorithm 
 */
(function($){

    $.fn.shuffle = function() {
        return this.each(function(){
            var items = $(this).children().clone(true);
            return (items.length) ? $(this).html($.shuffle(items)) : this;
        });
    }

    $.shuffle = function(arr) {
        for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    }

})(jQuery);


/*! device.js 0.2.7 */
(function(){var a,b,c,d,e,f,g,h,i,j;b=window.device,a={},window.device=a,d=window.document.documentElement,j=window.navigator.userAgent.toLowerCase(),a.ios=function(){return a.iphone()||a.ipod()||a.ipad()},a.iphone=function(){return!a.windows()&&e("iphone")},a.ipod=function(){return e("ipod")},a.ipad=function(){return e("ipad")},a.android=function(){return!a.windows()&&e("android")},a.androidPhone=function(){return a.android()&&e("mobile")},a.androidTablet=function(){return a.android()&&!e("mobile")},a.blackberry=function(){return e("blackberry")||e("bb10")||e("rim")},a.blackberryPhone=function(){return a.blackberry()&&!e("tablet")},a.blackberryTablet=function(){return a.blackberry()&&e("tablet")},a.windows=function(){return e("windows")},a.windowsPhone=function(){return a.windows()&&e("phone")},a.windowsTablet=function(){return a.windows()&&e("touch")&&!a.windowsPhone()},a.fxos=function(){return(e("(mobile;")||e("(tablet;"))&&e("; rv:")},a.fxosPhone=function(){return a.fxos()&&e("mobile")},a.fxosTablet=function(){return a.fxos()&&e("tablet")},a.meego=function(){return e("meego")},a.cordova=function(){return window.cordova&&"file:"===location.protocol},a.nodeWebkit=function(){return"object"==typeof window.process},a.mobile=function(){return a.androidPhone()||a.iphone()||a.ipod()||a.windowsPhone()||a.blackberryPhone()||a.fxosPhone()||a.meego()},a.tablet=function(){return a.ipad()||a.androidTablet()||a.blackberryTablet()||a.windowsTablet()||a.fxosTablet()},a.desktop=function(){return!a.tablet()&&!a.mobile()},a.television=function(){var a;for(television=["googletv","viera","smarttv","internet.tv","netcast","nettv","appletv","boxee","kylo","roku","dlnadoc","roku","pov_tv","hbbtv","ce-html"],a=0;a<television.length;){if(e(television[a]))return!0;a++}return!1},a.portrait=function(){return window.innerHeight/window.innerWidth>1},a.landscape=function(){return window.innerHeight/window.innerWidth<1},a.noConflict=function(){return window.device=b,this},e=function(a){return-1!==j.indexOf(a)},g=function(a){var b;return b=new RegExp(a,"i"),d.className.match(b)},c=function(a){var b=null;g(a)||(b=d.className.replace(/^\s+|\s+$/g,""),d.className=b+" "+a)},i=function(a){g(a)&&(d.className=d.className.replace(" "+a,""))},a.ios()?a.ipad()?c("ios ipad tablet"):a.iphone()?c("ios iphone mobile"):a.ipod()&&c("ios ipod mobile"):a.android()?c(a.androidTablet()?"android tablet":"android mobile"):a.blackberry()?c(a.blackberryTablet()?"blackberry tablet":"blackberry mobile"):a.windows()?c(a.windowsTablet()?"windows tablet":a.windowsPhone()?"windows mobile":"desktop"):a.fxos()?c(a.fxosTablet()?"fxos tablet":"fxos mobile"):a.meego()?c("meego mobile"):a.nodeWebkit()?c("node-webkit"):a.television()?c("television"):a.desktop()&&c("desktop"),a.cordova()&&c("cordova"),f=function(){a.landscape()?(i("portrait"),c("landscape")):(i("landscape"),c("portrait"))},h=Object.prototype.hasOwnProperty.call(window,"onorientationchange")?"orientationchange":"resize",window.addEventListener?window.addEventListener(h,f,!1):window.attachEvent?window.attachEvent(h,f):window[h]=f,f(),"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return a}):"undefined"!=typeof module&&module.exports?module.exports=a:window.device=a}).call(this);

