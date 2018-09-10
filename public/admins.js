$(function f() {

    $('.submit').on('click',function () {

        $.ajax({
            url: '/xinwen/admin1.php',
            data: {
                c:'News',
                m:'insert',
                title:$('#title').val(),
                dsc:$('#dsc').val(),
                text:$('#text').val()
            },

            success: function(data) {
                if (data == '1') {
                    console.log(data["title"]);
                    alert('添加成功')
                    location.reload();
                } else {
                    alert('网络出了点问题')
                }
            }
            //
        })

   })

    //修改

    $('.table').on('blur', 'input', function() {
        var k = $(this).attr('data-type');
        var id = $(this).closest('tr').attr('data-id');
        var v = $(this).val( );
        // update.php
        $.ajax({
            url: './admin1.php',
            data: {
                c:'News',
                m:'update',
                id: id,
                k:k,
                v:v,
            },
            success:function(data){
                console.log(data);
            }
        })
    })



    //删除

    $('.table').on('click', '.remove', function() {

        var id = $(this).closest('tr').attr('data-id');
        // alert(1);
        // delete.php
        $.ajax({
            url: '/xinwen/admin1.php',
            data: {
                c:'News',
                m:'delete',
                id: id
            },
            success: function(data) {
                if (data == '1') {
                    console.log(data["title"]);
                    alert('删除成功')
                    location.reload();
                } else {
                    alert('网络出了点问题')
                }
            }
            //
        })

    });


})