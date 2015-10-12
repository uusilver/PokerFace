/**
 * Created by lijunying on 15/9/27.
 */
$(function(){
    $("#roomname").val("room123");
    $("#copy-input").zclip({
        path: "js/ZeroClipboard.swf",
        copy: function(){
            return $("#roomname").val();
        },
        afterCopy:function(){/* 复制成功后的操作 */
            var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>☺ 复制成功</div></div>");
            $("body").find(".copy-tips").remove().end().append($copysuc);
            $(".copy-tips").fadeOut(3000);
        }
    });

});
