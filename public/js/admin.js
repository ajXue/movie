$(function () {
    $('.del').on('click', function (e) {
        var e = window.event || e
        var target = $(e.target);
        var id = target.data('id');
        var tr = $(".item-id-"+ id);

        $.ajax({
            type: 'delete',
            url: '/admin/delete?id='+ id,
        })
        .done(function (data) {
            if(data.stateCode) {
                if( tr.length > 0) {
                    tr.remove()
                }
            }
        })
    })
})