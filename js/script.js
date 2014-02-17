$('a').click(function() {
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top
    }, 500);
    return false;
});

var repaint = $(".section");

$(window).resize(function() {
    repaint.css("z-index", 1);
});
