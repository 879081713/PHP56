;(function($){
    $.fn.extend({
        hoverClass : function(class_name, time){
            var _class_name = class_name || "hover";
            return this.each(function(){
                var $this = $(this), mouse_out_timer;
                $this.hover(function(){
                    if (mouse_out_timer){
                        clearTimeout(mouse_out_timer);
                    }
                    $this.addClass(_class_name);
                },function(){
                    mouse_out_timer = setTimeout(function(){
                        $this.removeClass(_class_name);
                    }, time||10);
                });
            });
        },
        focusClass : function(class_name, time){
            var _class_name = class_name || "focus";
            return this.each(function(){
                var $this = $(this), mouse_out_timer;
                $this.off('blur').off('focus')
                .on('blur', function(){
                    mouse_out_timer = setTimeout(function(){
                        $this.removeClass(_class_name);
                    }, time||10);
                })
                .on('focus', function(){
                    if (mouse_out_timer){
                        clearTimeout(mouse_out_timer);
                    }
                    $this.addClass(_class_name);
                })
            });
        }
    });
})(jQuery)