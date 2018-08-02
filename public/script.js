/**
 * Created by komal on 3/8/17.
 */

var username = prompt("Enter your name");

//to load the socket.io-client, which exposes a io global, and then connect.
var con = io();

$(function (){
    //conn.emit("myevent", (new Date()).getTime())
    con.emit("sign_up", username);

    $('#send').click(function(){
        con.emit("send_msg",{
            user: username,
            msg: $('#msg').val()
        })
    })

    con.on("chatlog",function(data){
        console.log(data);
        if (data.length >0) {
            data.forEach(function(chat)
            {
                $('#chat').append("<li>" + chat.user + ":" + chat.msg + "</li>")
            }
        )
        }
    });

    con.on("rcv_msg",function(data){
        $('#chat').append('<li>'+data +'</li>')
    })
});