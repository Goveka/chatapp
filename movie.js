const express=require('express')
const app=express()
const http=require('http')
const {Server}= require('socket.io');
const server=http.createServer(app)
const io=new Server(server)
const port=process.env.PORT || 3009


  app.use(express.static('public'))



io.on('connection', (socket)=>{
  socket.on('chat message', msg =>{
    io.emit('chat message', msg);
  });
});



server.listen(port, ()=>{
  console.log('server is on port:'+port);
})
