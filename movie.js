const express=require('express')
const app=express()
const assert = require('assert');
const mongoose = require('mongoose');
const url='mongodb+srv://Sizwenkala:sizwe123@cluster0.fejtt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//const url='mongodb://localhost:27017/test'
const http=require('http')
const {Server}= require('socket.io');
const server=http.createServer(app)
const io=new Server(server);
const port=process.env.PORT || 2009


//
  app.use(express.static('public'))
  app.use(express.json());
//  app.use(require('body-parser')());

app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/movie.html')
})


// connecting to database
mongoose.connect(url, (err,db)=>{
  {useNEWUrlParser:true}
if (err) {
  throw err
}
console.log('connected to database....');
//connect to socket.io
let use=[]
io.on('connection', socket =>{

  let chat=db.collection('chats')

  //get all chats from mongodb
  chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
    if (err) {
      throw err;

    }
    // emit the Messages
    socket.emit('output', res)
  });

//sending messages
  socket.on('chat message', msg =>{
let name=msg.user;
let input=msg.input;
let time=msg.time;
      chat.insertOne(msg, function(){
        io.emit('chat message', msg);
      })
    });

    socket.on('setUsername', function (data) {
      if(users.indexOf(data)> -1){
        use=data;
        socket.emit('userSet', {userName:data});
      }else{
        socket.emit('userExist', data + 'user is taken')
      }
    })
});
});

server.listen(port, ()=>{
  console.log('server is on port:'+port);
})
