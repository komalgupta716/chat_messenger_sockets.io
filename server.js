/**
 * Created by komal on 3/8/17.
 */

//Express initializes app to be a function handler that
// you can supply to an HTTP server
const express = require('express');
const app = express();
const socket = require('socket.io');
const http = require ('http');

//initialize a new instance of socket.io by passing the
// http (the HTTP server) object
const server = http.Server(app);
const io = socket(server);

let chats=[];
let clients ={};

//listen on the connection event for incoming sockets, and I log it to the console.

//not specifying any URL when I call io(),
// since it defaults to trying to connect to the host that serves the page.
io.on("connection", function(conn){
    console.log('A client has connected' + conn.id)

    //io.to(conn.id).emit('chatlog',chats)

    conn.emit('chatlog',chats);

    conn.on("sign_up",function(data){
        clients[data] = conn.id;
        console.log(clients);
    });

    conn.on("send_msg", function (data){

        if(data.msg.charAt(0)=="@"){
            let toUser = data.msg.split(" ",1)[0].substring(1);
            let msg = data.msg.substring(data.msg.indexOf(" ") + 1);

            io.to(clients[toUser]).emit("rcv_msg", data.user + ": " + msg);
        }

        else {
            chats.push(data);
            io.emit("rcv_msg", data.user + ": " + data.msg)
        }
        //chats.push(data);
        //io.emit("rcv_msg",data.user + ": " + data.msg);
        //conn.broadcast.emit("rcv_msg",data)
    })

    conn.on("disconnect", function (data){
        console.log("A user disconnected")
    })

})

//We define a route handler / that gets called when we hit our
// website home.
app.use('/',express.static(__dirname+ "/public"));

//We make the http server listen on port 3000.
server.listen(3456, function (){
    console.log('Server Started on port 3456');
})
