(function ($) {
	
	"use strict";

	$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  var box = $('.header-text').height();
	  var header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	});
	

	$('.filters ul li').click(function(){
	  $('.filters ul li').removeClass('active');
	  $(this).addClass('active');
	  
	  var data = $(this).attr('data-filter');
	  $grid.isotope({
	    filter: data
	  })
	});

	var $grid = $(".grid").isotope({
	  itemSelector: ".all",
	  percentPosition: true,
	  masonry: {
	    columnWidth: ".all"
	  }
	})

	// Images and web fonts can change card heights after the initial layout.
	function layoutGrid() {
		$grid.isotope('layout');
	}
	$grid.find('img').one('load error', layoutGrid);
	$(window).on('load', layoutGrid);
	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(layoutGrid);
	}

	$(".Modern-Slider").slick({
	    autoplay:true,
	    autoplaySpeed:10000,
	    speed:600,
	    slidesToShow:1,
	    slidesToScroll:1,
	    pauseOnHover:false,
	    dots:true,
	    pauseOnDotsHover:true,
	    cssEase:'linear',
	   // fade:true,
	    draggable:false,
	    prevArrow:'<button class="PrevArrow"></button>',
	    nextArrow:'<button class="NextArrow"></button>', 
	  });

	$('.search-icon a').on("click", function(event) {
	    event.preventDefault();
	    $("#search").addClass("open");
	    $('#search > form > input[type="search"]').focus();
	  });

	  $("#search, #search button.close").on("click keyup", function(event) {
	    if (
	      event.target == this ||
	      event.target.className == "close" ||
	      event.keyCode == 27
	    ) {
	      $(this).removeClass("open");
	    }
	  });

	  $("#search-box").submit(function(event) {
	    event.preventDefault();
	    return false;
	  });


	$('.owl-carousel').owlCarousel({
	    loop:true,
	    margin:30,
	    nav:false,
	    pagination:true,
	    responsive:{
	        0:{
	            items:1
	        },
	        600:{
	            items:2
	        },
	        1000:{
	            items:3
	        }
	    }
	})

	// Window Resize Mobile Menu Fix
	mobileNav();


	// Scroll animation init
	window.sr = new scrollReveal();
	

	// Menu Dropdown Toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}


	// Menu elevator animation
	$('a[href*=\\#]:not([href=\\#])').on('click', function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				var width = $(window).width();
				if(width < 991) {
					$('.menu-trigger').removeClass('active');
					$('.header-area .nav').slideUp(200);	
				}				
				$('html,body').animate({
					scrollTop: (target.offset().top) - 80
				}, 700);
				return false;
			}
		}
	});

	$(document).ready(function () {
	    $(document).on("scroll", onScroll);
	    
	    //smoothscroll
	    $('a[href^="#"]').on('click', function (e) {
	        var hash = this.hash;
	        var target = $(document.getElementById(hash.slice(1)));
	        if (!hash || !target.length) return;
	        e.preventDefault();
	        $(document).off("scroll");
	        
	        $('a').each(function () {
	            $(this).removeClass('active');
	        })
	        $(this).addClass('active');
	      
	        $('html, body').stop().animate({
	            scrollTop: (target.offset().top) - 79
	        }, 500, 'swing', function () {
	            window.location.hash = hash;
	            $(document).on("scroll", onScroll);
	        });
	    });
	});

	function onScroll(event){
	    var scrollPos = $(document).scrollTop();
	    $('.nav a').each(function () {
	        var currLink = $(this);
	        var href = currLink.attr('href') || '';
	        if (href.charAt(0) !== '#' || href.length < 2) return;
	        var refElement = $(document.getElementById(href.slice(1)));
	        if (!refElement.length) return;
	        if (refElement.offset().top <= scrollPos && refElement.offset().top + refElement.height() > scrollPos) {
	            $('.nav ul li a').removeClass("active");
	            currLink.addClass("active");
	        }
	        else{
	            currLink.removeClass("active");
	        }
	    });
	}


	// Page loading animation
	$(window).on('load', function() {
		if($('.cover').length){
			$('.cover').parallax({
				imageSrc: $('.cover').data('image'),
				zIndex: '1'
			});
		}

		$("#preloader").animate({
			'opacity': '0'
		}, 600, function(){
			setTimeout(function(){
				$("#preloader").css("visibility", "hidden").fadeOut();
			}, 300);
		});
	});


	// Window Resize Mobile Menu Fix
	$(window).on('resize', function() {
		mobileNav();
	});


	// Window Resize Mobile Menu Fix
	function mobileNav() {
		var width = $(window).width();
		$('.submenu').on('click', function() {
			if(width < 767) {
				$('.submenu ul').removeClass('active');
				$(this).find('ul').toggleClass('active');
			}
		});
	}


})(window.jQuery);
