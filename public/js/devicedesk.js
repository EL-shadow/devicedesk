/**
 * Created by EL on 12.04.2016.
 */
$(function() {
    $(window).bind("load resize", function() {
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('#myNavbar').addClass('collapse');
        } else {
            $('#myNavbar').removeClass('collapse');
        }
    });
});

var printQr = {
    sticker: 1,
    switchDouble: function () {
        
    }
}