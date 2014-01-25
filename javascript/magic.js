$(function() {
  	$('a[href*=#]:not([href=#])').click(function() {
   	 if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
   	   var target = $(this.hash);
   	   target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
   	   if (target.length) {
   	     $('html,body').animate({
   	       scrollTop: target.offset().top
   	     }, 1000);
  	      return false;
  	    }
  	  }
  	});
	
	$(window).load(function() {
		$(back_to_top).hide();
	});
	
	$(window).scroll(function(){
		if ($(window).scrollTop() > $("#top").offset().top + ($("#top").height() / 2)) {
			$(back_to_top).fadeIn(300);
		} else {
			$(back_to_top).fadeOut(300);
		}
		$('.radius-progress').each(function(){
			if ($(window).scrollTop() + $(window).height() >= $(this).offset().top) {
				if ($(this).attr('completed') == 'yes' || $(this).attr('working') == 'yes') return;
				$(this).raduisProgressBar();
			}
		});
		
		$(".projectBox").each(function(){
			if ($(window).scrollTop() + $(window).height() >= $(this).offset().top) {
				if ($(this).attr('shreked') != 'indeed') {
					$(this).attr('shreked', 'indeed');
					$(this).addClass('animated flipInX');
				}
			}
		});
	});
});