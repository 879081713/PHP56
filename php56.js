var PHP56 = {
    version : '1.0.0',

    timer : {
        show_msg_timer : null
    },

    keycode : {
        ENTER: 13, ESC: 27, END: 35, HOME: 36,
        SHIFT: 16, TAB: 9,
        LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40,
        DELETE: 46, BACKSPACE:8
    },

    // login: {
    //     type : CONF.login.type || 1,
    //     url : CONF.login.url
    // },

    // app : {
    //     h5 : CONF.app.h5 || true
    // },

    ajaxcode : {
        success : 200,
        timeout : 300
    },

    noop : function(){},

    ajax_post       : function(url, data, sfunc, bfunc, ext){
        var ext = ext || {};
        var opt = {
            url : url,
            type : 'POST',
            data : data,
            success : sfunc,
            beforeSend : bfunc
        }
        opt = $.extend(opt, ext);
        return PHP56.ajax(opt);

    },

    ajax_get        : function(url, data, sfunc, bfunc, ext){
        var ext = ext || {};
        var opt = {
            url : url,
            data : data,
            type : 'GET',
            success : sfunc,
            beforeSend:bfunc
        }
        opt = $.extend(opt, ext);
        return PHP56.ajax(opt);

    },

    ajax_html       : function(url,data,ext){
        var ext = ext || {};
        var opt = {
            url : url,
            type : 'GET',
            data : data,
            dataType : 'html'
        }
        opt = $.extend(opt, ext);
        return PHP56.ajax(opt);
    },

    ajax_form       : function(obj, bfunc, sfunc, efunc, ext){
        var $obj = $(obj);
        var _data = $obj.serialize();
        var before = $.isFunction(bfunc) ? bfunc : PHP56.form_before;
        if(!before(obj)){
            return false;
        }
        var opt = {
            url : $obj.attr("action"),
            data : _data,
            type : $obj.attr("method") || 'POST',
            success : sfunc,
            error : efunc
        }
        opt = $.extend(opt, ext);
        return PHP56.ajax(opt);
    },

    ajax            : function(opt){
        var opt = opt || {};
        var _opt = {
            async : true,
            cache : false,
            dataType : 'json',
            type : 'POST',
            timeout : 6000,
            data : {},
            success : PHP56.ajax_success,
            beforeSend : PHP56.ajax_before,
            complete : PHP56.ajax_complete,
            error : PHP56.ajax_error
        }
        opt = $.extend(_opt, opt);
        $.ajax(opt);
        return false;
    },

    ajax_before     : function(){
        PHP56.tips_msg('请求中...', 6000);
        // return false;
    },

    ajax_success    : function(json){
        if(json.code == PHP56.ajaxcode.success){
            PHP56.success_msg(json.message || '操作成功', null, function(){
                if(json.url && json.url != ''){
                    window.location.href = json.url;
                }
            });
        }else if(json.code == PHP56.ajaxcode.timeout){
            PHP56.error_msg(json.message || '请登录', null, function(){
                if(PHP56.login.type == 1){
                    PHP56.show_login();
                }else{
                    window.location.href = PHP56.login.url;
                }
            });
        }else{
            PHP56.error_msg(json.message || '操作失败');
        }
    },

    ajax_error      : function(jqXHR, textStatus, errorThrown){
        var _msg = '请求失败';
        if(textStatus == 'timeout'){
            _msg = '请求超时';
        }else if(textStatus == 'error'){
            _msg = '服务器'+jqXHR.status+'错误';
        }else if(textStatus == 'abort'){
            _msg = '请求被终止';
        }else if(textStatus == 'parsererror'){
            _msg = '解析错误';
        }
        PHP56.error_msg(_msg);
        return;
    },

    ajax_complete   : function(){
        // PHP56.hide_msg();
    },

    login_show : function(){
    },

    error_msg       : function(msg, time, callback){
        PHP56.show_msg(msg, 'error', time, callback);
        return;
    },

    tips_msg        : function(msg, time, callback){
        PHP56.show_msg(msg, 'tips', time, callback);
        return;
    },

    wrang_msg       : function(msg, time, callback){
        PHP56.show_msg(msg, 'wrang', time, callback);
        return;
    },

    success_msg     : function(msg, time, callback){
        PHP56.show_msg(msg, 'success', time, callback);
        return;
    },

    show_msg        : function(msg, type, time, callback){
        var time = time || 2000;
        if($('.ui_message').length > 0){
            var obj = $('.ui_message');
            $('.ui_msg', obj).text(msg);
            $('.ui_icon', obj).removeClass().addClass("ui_icon "+type);
        }else{
            var data = {
                msg:msg,
                type:type
            };
            var _html = '<p class="ui_message"><span class="ui_msg">'+msg+'</span><i class="ui_icon '+type+'"></i></p>';
            $('body').append(_html);
        }

        var obj = $('.ui_message');
            obj.css('margin-left', -parseInt(obj.outerWidth()/2)+'px').fadeIn();

        if(PHP56.timer.show_msg_timer){
            clearTimeout(PHP56.timer.show_msg_timer);
            PHP56.timer.show_msg_timer = null;
        }

        PHP56.timer.show_msg_timer = setTimeout(function(){
            PHP56.hide_msg(callback);
        }, time)

    },

    hide_msg        : function(callback){
        var callback = callback || PHP56.noop;
        if($.isFunction(callback)){
            callback();
        }
        $('.ui_message').fadeOut();
    },

    alert           : function(title,msg){
        var data = {

        }
        var _html = "";
        $('body').append(_html);
        return;
    },

    confirm         : function(title, msg, sfunc, cfunc){
        var data = {
            title : title,
            msg : msg
        }
        if($('.ui_confirm').length > 0){
            $('.ui_title', $('.ui_confirm')).text(title);
            $('.ui_msg', $('.ui_confirm')).text(msg);
        }else{
            var _html = PHP56.TPL.confirm(data);
            $('body').append(_html);
        }
        $('.ui_confirm').show();
        var cfunc = $.isFunction(cfunc) || PHP56.confirm_cancel ;
        $('.ui_ok_btn', $('.ui_confirm')).off('click').on('click', function(){
            if($.isFunction(sfunc)){
                PHP56.confirm_hide(sfunc);
            }
        });
        $('.ui_cancle_btn', $('.ui_confirm')).off('click').on('click', function(){
            if($.isFunction(cfunc)){
                cfunc();
            }
        });
    },

    confirm_cancel : function(){
        PHP56.confirm_hide();
    },

    confirm_hide : function(callback){
        var callback = callback || PHP56.noop;
        $('.ui_confirm').remove();
        if($.isFunction(callback)){
            callback();
        }
    },

    form_before : function(obj){
        var json = PHP56.form_check(obj);
        if(!json.status){
            var msg=json.msg || '';
            PHP56.error_msg(msg);
        }
        return json.status;
    },

    form_check  : function(obj){
        var $obj = $(obj);
        var data_array =$obj.serializeArray();
        for(i in data_array){
            var $this = $("[name='"+data_array[i]['name']+"']");
            var _val  = data_array[i]['value'];
            var $opt = $this.data();

            var $res = $opt.res ||　'';
            var $msg = $opt.msg ||　'';

            if($res && $res.indexOf('require')>=0 || $res.indexOf('require')<0 && _val !=""){
                $rules  = $res.split(" ");
                $msgs   = $msg.split(" ");
                for(k in $rules){
                    var _msgNow = $msgs[k] ? $msgs[k] : $msgs[0];
                    if($rules[k]=='repeat'){
                        var _repwd = $("#"+$opt.rel).val();
                        if(_repwd && _repwd != _val){
                            return {status:false, msg:_msgNow, obj:$this};
                        }
                    }else{
                        if(!PHP56.regex($rules[k],_val)){
                            return {status:false, msg:_msgNow, obj:$this};
                        }
                    }
                }
            }
        }
        return {status:true, msg:"验证成功", obj:$this};
    },

    regex:function(str, reg){
        var regs = {
            'require'   : /\S/,
            'email'     : /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
            'username'  : /^[0-9A-Za-z_.]{6,16}$/,
            'nickname'  : /^[\u4e00-\u9fa5_a-zA-Z0-9\s]+$/,
            'phone'     : /^0?1(3|4|5|6|7|8)\d{9}$/,
            'number'    : '',
            'int'       : '',
            'mobile'    : '',
            'money'     : '',
            'en'        : '',
            'cn'        : '',
            'lower'     : '',
            'upper'     : '',
        }
        var regex = regs[str];
        if(regex){
           return regex.test(reg);
        }else{
            return true;
        }
    },

    obj2str : function(o){
        var r = [];
        if(typeof o =="string") return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
        if(typeof o == "object"){
            if(!o.sort){
                for(var i in o){
                    r.push(i+":"+PHP56.obj2str(o[i]));
                }
                if(!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){
                    r.push("toString:"+o.toString.toString());
                }
                r="{"+r.join()+"}"
            }else{
                for(var i =0;i<o.length;i++) {
                    r.push(PHP56.obj2str(o[i]));
                }
                r="["+r.join()+"]"
            }
            return r;
        }
        return o.toString();
    },

    str2obj:function(s){
        try{
            if ($.type(s) == 'string'){
                return eval('(' + s + ')');
            }else{
                return s;
            }
        } catch (e){
            return {};
        }
    },
    load_more : function(callback){
        $(window).off('scroll').on('scroll',function(){
            var win_h = $(window).height();
            var scroll_h = $(window).scrollTop()+win_h;
            var load_h = $('#listLoading').offset().top;
            if(load_h<scroll_h){
                if($.isFunction(callback)){
                    callback();
                }
            }
        })
    },

    make_data : function(){
        var data    = data || {};
        data.uid    = CONF.uid;
        data.token  = CONF.token;
        data.time   = CONF.time;
        data.sign   = PHP56.make_sign(data);
        return data;
    },

    make_sign : function(){
        var data = data || [];
        var _arr = [];
        var _str = '';
        for(i in data){
            if(data[i] !== ''){
                _arr.push(i);
            }
        }
        _arr.sort();
        for(i in _arr){
            _str += (_arr[i]+encodeURIComponent(data[_arr[i]]));
        }
        if(_str != ''){
            return md5(_str);
        }
        return '';
    },

    set_cookie : function(name,value,days){
        var _days = days || 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/";
    },

    show_mask : function(){
        if(!$("#jsMask").length>0){
            var str='<div id="jsMask" class="mask"></div>';
            $("body").append(str);
        }
        $("#jsMask").show();
        $("#jsMask").on("touchmove",function(e){
             return false;
        })
    },

    hide_mask : function(){
         if($("#jsMask").length>0){
            $("#jsMask").hide();
        }
    },

    ui_lock : function(obj){
        if(obj.hasClass('ui_lock')){
            return false;
        }else{
            obj.addClass('ui_lock');
            return true;
        }
    },

    ui_init:function(box){
        var $box = $(box || document);

        $("a[target='_navtab']", $box).each(function(i){
            var $this = $(this);
            if(!PHP56.ui_lock($this)){
                return;
            }
            $this.off('click').on('click',function(){
                var $this = $(this);
                var navtab = $this.parents('.navtab_header').find("a[target='_navtab']");
                navtab.removeClass("active");
                var _body=$this.parents('.navtab');
                var _class=$this.data().cont;
                var _tabs=_body.find('.'+_class);
                var _id = $this.data().id;
                if(_id==0){
                    var _key = $this.data().rel;
                    var _text = $this.text();
                    $('#'+_key).text(_text);
                    _data[_key]=_id;
                    _data['nowPage'] = 1;
                    getList();
                    navtab.eq(1).addClass("active");
                    _tabs.hide().eq(1).show();
                    $('.jiansuo_content').hide();
                    PHP56.hide_mask();
                }else{
                    navtab.eq(i).addClass("active");
                    _tabs.hide().eq(i).show();
                }
                return false;
            });
        });

        $("a[target='_login']", $box).each(function(){
            var $this = $(this);
            if(!PHP56.ui_lock($this)){
                return;
            }
            $this.off('click').on('click', function(){
                if(parseInt(CONF.uid) == 0 || isNaN(parseInt(CONF.uid))){
                    alert("必须登录才能使用");
                    return false;
                }
                return true;
            });
        });

        $('.slider', $box).each(function(i){
            var $this = $(this);
            if(!PHP56.ui_lock($this)){
                return;
            }
            var _id = 'autoSliderId'+i;
            $this.attr('id', _id);
            var _autoPlay = $this.data().auto || false;
            var _delayTime = $this.data().timer || 500;
            var _interTime = $this.data().time || 4000;
            TouchSlide({
                slideCell:"#"+_id,
                titCell:".hd ul",
                mainCell:".bd ul",
                effect:"leftLoop",
                autoPage:true,
                autoPlay:_autoPlay,
                delayTime:_delayTime,
                interTime:_interTime,
                switchLoad:"data-original"
            });
        });

        $('input', $box).each(function(){
            $(this).prop('autocomplete', 'off');
        });

        $('.navtab',$box).each(function(){
            var $this = $(this);
            var _ref = $this.data().ref || '';
            var _active = $this.data().active || '';
            var _callback = $this.data().callback || '';

            if($.isFunction(window[_active])){
                _active = window[_active];
            }else{
                _active = function(){};
            }
            if($.isFunction(window[_callback])){
                _callback = window[_callback];
            }else{
                _callback = function(){};
            }
            if(_ref != ''){
                _ref = '_'+_ref;
            }
            var $btns = $('.navtab_btn'+_ref, $this);
            var $bods = $('.navtab_bod'+_ref, $this);

            $btns.each(function(i){
                var $btn = $(this);
                $btn.off('click').on('click', function(){
                    if($btn.hasClass('active')){
                        _active($this);
                        return false;
                    }
                    $btns.removeClass('active').eq(i).addClass('active');
                    $bods.hide().eq(i).show();
                    _callback($this, i);
                    return false;
                });
            });
        });

        $("a[target='_ajaxdel']", $box).each(function(){
            var $this = $(this);
            $this.off('click').on('click',function(){
                var data = $this.data();
                var url  = data.url || '';
                var title= data.title || '';
                if(!url){
                    return false;
                }
                if(!title){
                    return false;
                }
                PHP56.confirm('消息提示', title, function(){
                    PHP56.ajax_get(url, data, function(json){
                       if(json.code == 200){
                            var $remove = $this.parents('.js_ajax_del_body');
                            $remove.remove();
                       }
                    });
                });
                return false;
            });
        })
    },

    query_string: function(key){
        var regex_str = "^.+\\?.*?\\b"+ key +"=(.*?)(?:(?=&)|$|#)"
        var regex = new RegExp(regex_str,"i");
        var url = window.location.toString();
        if(regex.test(url)){
            return RegExp.$1;
        }
        return undefined;
    }
}

$(function(){
    PHP56.ui_init();
});