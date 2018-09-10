$(
    function () {
        $(".icon-xinfengyoujian").on("click",function () {
           //添加一个div然后添加点击事件
            if (!$("body").is("emile")
            ) {
                $('<div></div>').addClass("emile").appendTo('body').append($(".popup").css("display",'block'))
            }
        })

        //电机的时候删除
        $(".popup .close").on("click",function () {
            $("body .emile").removeClass('emile')
            $(".popup").css("display",'none')
        })

    }

)
