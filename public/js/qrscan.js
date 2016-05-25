/**
 * Created by EL on 16.04.2016.
 */

var qrRead = {
    prev: null,
    successMessage: function(response) {
        var mess = this.page === 'lock' ? 'Вы заняли' : 'Устройство возвращено.'
        $('#log').prepend('<p><span class="text-info">' + response + '</span> &ndash; ' + mess + '</p>');
    },
    errorMessage: function (jqXHR) {
        $('#log').prepend('<p class="text-warning">' + jqXHR.responseText + '</p>');
    },
    lock: function (data) {
        this.prev = data;
        $.ajax({
            type: 'POST',
            url: '/lock',
            data: {
                deviceCode: data
            },
            success: this.successMessage,
            error: this.errorMessage
        });
    },
    unlock: function (data) {
        this.prev = data;
        $.ajax({
            type: 'POST',
            url: '/unlock',
            data: {
                deviceCode: data
            },
            success: this.successMessage,
            error: this.errorMessage
        });
    },
    page: null
};
$(function () {
    var $beep = $('#beep');
    $('#reader').html5_qrcode(
        function (data) {
            // do something when code is read
            $('#read').html(data);
            if (qrRead.prev !== data) {
                $beep[0].play();
                qrRead.page === 'lock' ? qrRead.lock(data) : qrRead.unlock(data);
            }
            //$('#error').html();
        },
        function (error) {
            //show read errors
            //$('#error').html('<p style="color:red;">Uknown error:</p> debug info ' + error);
        }, function (videoError) {
            //the video stream could be opened
            $('#error').html('<p style="color:red;">Video error:</p>' + videoError + '<br>May be not found Camera.');
        }
    );
});