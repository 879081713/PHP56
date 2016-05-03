PHP56.TPL = {
    'show_msg'  : template.compile(
        '<p class="ui_message">'
        +   '<span class="ui_msg"><%=msg%></span>'
        +   '<i class="icon <%=type%>"></i>'
        +'</p>'
    ),
    'alert'     : template.compile(
        '<p class="ui_alert">'
        +   '<span class="ui_title"><%=title%></span>'
        +   '<span class="ui_msg"><%=msg%></span>'
        +   '<a class="ui_close" href="">知道了</a>'
        +'</p>'
    ),
    'confirm'   : template.compile(
        '<div class="ui_confirm">'
        +   '<div class="ui_title"><%=title%></div>'
        +   '<div class="ui_msg"><%=msg%></div>'
        +   '<div class="ui_button">'
        +       '<a class="ui_cancle_btn">取消</a>'
        +       '<a class="ui_ok_btn">确认</a>'
        +   '</div>'
        +'</div>'
    ),
}