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

var findDevice = {
    find: function (id) {
        $.ajax({
            type: 'POST',
            url: '/find',
            data: {
                deviceId: id
            },
            success: function (json) {
                var res = '<dl>';
                var d = json.device;
                res += '<dt>Тип: </dt><dd>' + d.type + '</dd>'+
                        '<dt>Модель:</dt><dd>' + d.model + '</dd>' +
                        '<dt>Описание:</dt><dd>' + d.name + '</dd>';
                if (json.user) {
                    var u = json.user;
                    res += '<dt>Занятость:</dt><dd class="text-warning">Устройство Занято</dd>'+
                        '<dt>Время:</dt><dd>' + d.leaseTime + '</dd>' +
                            '<dt>Имя:</dt><dd>' + u.firstname + '</dd>' +
                            '<dt>Фамилия:</dt><dd>' + u.lastname + '</dd>' +
                            '<dt>E-mail:</dt><dd>' + u.email + '</dd>';
                } else {
                    res += '<dt>Занятость:</dt><dd class="text-success">Устройство свободно</dd>'
                }
                res+='</dl>';
                $('#result').html(res);
            },
            error: function (err) {
                $('#result').html('<p class="text-warning">Error: ' + err.statusCode + '</p>')
            }
        });
        
    }
};