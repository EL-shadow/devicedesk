/**
 * Created by EL on 16.04.2016.
 */
$(function () {
    var $beep = $('#beep');
    $('#reader').html5_qrcode(function(data){
            // do something when code is read
            $('#read').html(data);
            $beep[0].play();
            $('#error').html();
        },
        function(error){
            //show read errors
            $('#error').html('<p style="color:red;">Uknown error:</p> debug info ' + error);
        }, function(videoError){
            //the video stream could be opened
            $('#error').html('<p style="color:red;">Video error:</p>' + videoError + '<br>May be not found Camera.');
        }
    );
});