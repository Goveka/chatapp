const express=require('express')
const app=express()
const http=require('http')
const {Server}= require('socket.io');
const server=http.createServer(app)
const io=new Server(server)
const port=process.env.PORT || 3009


  app.use(express.static('public'))

app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/movie.html')



})

save=[]
users=[]

  io.on('connection', socket =>{
    socket.on('chat message', msg =>{
      io.emit('chat message', msg);
      save.push(msg)
      });
      socket.on('setUsername', function (data) {
        if(users.indexOf(data)> -1){
          users.push(data);
          socket.emit('userSet', {userName:data});
        }else{
          socket.emit('userExist', data + 'user is taken')
        }
      })
  });




server.listen(port, ()=>{
  console.log('server is on port:'+port);
})
