const express=require('express')
const app=express()
const assert = require('assert');
const mongoose = require('mongoose');
const ejs = require('ejs');
const url='mongodb+srv://Sizwenkala:sizwe123@cluster0.fejtt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//const url='mongodb://localhost:27017/test'
const http=require('http').Server(app);
const io=require('socket.io')(http,{transports: ['websocket', 'polling']});
const port=process.env.PORT || 2009
const bodyParser= require('body-parser');
const jwt=require('jsonwebtoken');
const cookieParser= require('cookie-parser');


// importing database models
const User= require('./model/User');
const Room= require('./model/Room');
const LiveChat= require('./model/liveChat');
const { Socket } = require('net');


// middleware
  app.use(express.static('public'));
  app.use(express.json());
  app.set('view engine', 'ejs');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true}));
  app.use(cookieParser())

  //set MIMe type for socket.io script
  app.get('/socket.io/socket.io.js', (req,res)=>{
    res.set('Content-Type', 'application/javascript');
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
  });


  // connecting to the database
mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true})

const database = mongoose.connection
//checking if our connection to database was successful
database.on('error', (error)=>{
    console.log(error)
})
database.once('connected', ()=>{
    console.log("database connected")
})

app.get('/',(req,res)=>{
  res.render('signup', {})
});


// rendering the login page
app.get('/login-page', (req,res)=>{
  res.render('login', {message: ''})
})

//rendering the recovery page
app.get('/recovery-page',(req,res)=>{
  res.render('recovery', {})
})

// user sign in function
app.post('/login', (req,res)=>{
const username= req.body.username;
const password= req.body.password;

User.findOne({ username})
.then(user => {
  if(!user){
    return res.render('login' , {message: "'username not found, create an account if you don't have an account"});
  }

  if(user.password === password){
    // creating a JWT token
    const secret= 'secret-key'
    const token= jwt.sign({username: user.username, id: user._id}, secret, {expiresIn: '2h'});
    // setting the JWT token in a cookie
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
    //rendering the home page
    return res.status(200).redirect('/home-page');
  }else{
    return res.render('login' , {message: "incorrect password, Try again or recover your'e account"});
  }
})
.catch(err => console.log(err));
})

// THE USER SIGNUP FUNCTION
app.post('/signUp', async(req,res)=>{
  const {username, password,profilePic,hobbies,selfDescription,securityQuestion} = req.body;

  //checking if the user exist
  const user= await User.findOne({$or: [{username:username}, {password:password}] })
  if(user){
    return res.status(400).send({error: 'the username or password already exist'})
  }
  // create new user
  const newUser = new User({username, password, profilePic,hobbies,selfDescription, securityQuestion})
  await newUser.save();
  res.render('login', {message: ''})
});

//RECOVERING THE USER ACCOUNT WHEN THEY HAVE FORGOTEN IT
app.post('/recovery',async (req,res)=>{
  const {username,recoveryQuestion}= req.body;

  const user= await User.findOne({username:username})
  const recovery= await User.findOne({securityQuestion:recoveryQuestion})

  if(!user || !recovery){
    return res.status(400).send({error: 'The username or the security question does not exist'})
  }

  res.render('updatePassword', {username})

})

// UPDATING THE PASSWORD 
app.post('/update-password', (req,res)=>{
  const {username,password}= req.body;

   User.findOne({username:username}, (err, object)=>{
    if (err) {
      res.sendStatus(500)
  }else {
      object.password = password;
      object.save(function(err){
          if (err){
              res.sendStatus(500)
              console.error(err)
          }else {
            return res.render('login', {message: ""})
          }
      })
  }
   })
})


//rendering the home page
app.get('/home-page', async(req,res)=>{
  const cookie= req.cookies.token;
try {
 // finding the user infomation stored in the cookie
  //decoding the token to get the user infomation
  let decode = jwt.verify(cookie, 'secret-key');
  let userId= decode.id;
  if (!decode){
    return res.render('login', {message: 'your session has expired'})
  }
  // retrieve all users from the database
  try {
      const users = await User.find({});
    //filter out the user with the decoded user id
      const filteredUsers = users.filter(user => user._id.toString() !== userId)
      const loggedInUser= users.filter(user => user._id.toString() === userId)
    // rendering each chat room based on if the user is present in the room
      const rooms= await Room.find({users: userId}).populate('users', 'username').sort({'messages.timestamp': -1})
      const roomData= await Promise.all( rooms.map( async room =>{
      const lastMessage= room.messages[room.messages.length - 1]
      const recipientId = room.users.find(user => user._id.toString() !== userId).id
      const recipient= await User.findById(recipientId);
      const recipientName = recipient ? recipient.username : 'unknown'
      return {
        roomId: room._id,
        recipientId:recipientId,
        recipientName: recipientName,
        lastMessage: lastMessage ? ` ${lastMessage.senderId}: ${lastMessage.message}`: 'no messages yet'
      }
    }))
    //render the filtered users using the ejs template
    res.render('home', {users:filteredUsers, chats: roomData, loggedInUser:loggedInUser})
  } catch (error) {
    res.status(500).send({error: error.message})
  }
 } catch (err) {
return res.render('login', {message: 'your session has expired, please login again'})
  }
   });
//
function authenticateUser(req,res,next) {
  // check if the user has a token in the cookie
  const token = req.cookies.token;
  if(!token){
    return res.status(404).redirect('/login-page');
  }
  // verify the token and extract the user information
  jwt.verify(token, "secret-key", (err,decoded)=>{
    if(err) {
      return res.status(404).redirect('/login-page');
    }
    // set the user object in the request
    req.user= decoded;
    next();
  })
}
// updating the user profile
app.get('/updateProfile', async (req,res)=>{
  const cookie= req.cookies.token;

  try {
     // finding the user infomation stored in the cookie
  //decoding the token to get the user infomation
  let decode = jwt.verify(cookie, 'secret-key');
  let userId= decode.id;
  if (!decode){
    return res.render('login', {message: 'your session has expired'})
  }

  try {
        const users = await User.find({});
        const loggedInUser= users.filter(user => user._id.toString() === userId)
        res.render('updateUser', {currentUser: loggedInUser,})
  } catch (error) {
    res.status(500).send({error: error.message}) 
  }
  } catch (error) {
    return res.render('login', {message: 'your session has expired, please login again'})
  }
})

app.post('/updateProfile', async (req,res)=>{
  const {username, hobbies, selfDescription,securityQuestion, profilePic}= req.body;

  User.findOne({username:username}, (err, object)=>{
    if (err) {
      res.sendStatus(500)
  }else {
      object.hobbies = hobbies;
      object.selfDescription= selfDescription;
      object.profilePic= profilePic
      object.securityQuestion= securityQuestion;
      object.save(function(err){
          if (err){
              res.sendStatus(500)
              console.error(err)
          }else {
            return res.status(200).send("your profile has been updated")
          }
      })
  }
   })
})


// middleware thats responsible for chaining  the requests
app.use(authenticateUser)

// handling the creation of the chat room
app.post('/chat-rooms', async (req,res)=>{
  let receiverId=req.body.receiverId;   
  const cookie= req.cookies.token;
  let decode = jwt.verify(cookie, 'secret-key');
  let senderId= decode.id;
  try {
    const existingRoom= await Room.findOne({
      $or: [
        {users: [senderId, receiverId]},
        {users: [receiverId,senderId]}
      ]
    })
    if (existingRoom){
      res.json({
        roomId: existingRoom._id,
        roomExists: true
      })
    } else{
      const newRoom = new Room({
        recipientId: receiverId,
        users: [senderId,receiverId],
        messages: []
      });

      await newRoom.save();
      res.json({
        roomId: newRoom._id,
        roomExists: false
      });
    }
  } catch (error) {
    res.status(500).send({error: error.message})   
  }
})

app.get('/private-rooms/:id/:recipientId', async (req,res)=>{
  try {
    const recipientId= req.params.recipientId;
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    const roomMessages=room.messages
  
    if(!room){
      return res.status(404).json({error: 'chat room not found'})
    }
    const token = req.cookies.token;
    const user = jwt.verify(token, 'secret-key');
    if(!room.users.includes(user.id)){
      return res.status(401).json({error: 'unAuthorized access, try logging in'})
    }
    const username= await User.findById(user.id)
    const userName= username.username;
    const recipientUsername= await User.findById(recipientId);
    const receiverUsername= recipientUsername.username;
    const receiverProfilePic= recipientUsername.profilePic;
    res.render('private-chat', {
      roomId,
       userName,
        roomMessages,
         token,
         receiverUsername,
         receiverProfilePic });

  } catch (error) {
    res.status(500).send({error: error.message})
  }
})
// rendering the live chat room
app.get('/liveChat',async (req,res)=>{
 // checking if the user is logged in
 const cookie= req.cookies.token;
 try {
   // finding the user infomation stored in the cookie
  //decoding the token to get the user infomation
  let decode = jwt.verify(cookie, 'secret-key');
  let userId= decode.id;
  if (!decode){
    return res.render('login', {message: 'your session has expired'})
  }
  try {
    const messages=await LiveChat.find({});
    const username= await User.findById(userId)
    const userName= username.username;
    res.render('liveChat', {messages:messages, userName:userName})
  } catch (error) {
    return res.render('login', {message: 'your session has expired, please login again'})
  }
 } catch (error) {
  return res.render('login', {message: 'your session has expired, please login again'})
 }
})
// THE SOCKET.IO CONNECTION THE HANDLE REAL TIME CHAT
io.on('connection', (socket)=>{

   // listen for user joining room
   socket.on('join room', ({roomId}) => {
    socket.join(roomId)
  })

  socket.on('private message', async (data)=>{
    try {
      //find the room and add a message to its arrary
      const room = await Room.findById(data.roomId)
      if (!room) {
        throw new Error('room not found');
      }

      // add the message to the rooms message array
      const newMessage = {
         message: data.message,
          senderId: data.username,
           timestamp: data.currentDate,
            imgUrl:data.file,
        };
      room.messages.push(newMessage);
      await room.save();

      //emit the message to the rooms users
      io.to(data.roomId).emit('private message', newMessage);
    } catch (error) {
      console.error(error)
      socket.emit("error", {message: 'an error occured when sending a message'})
    }
  })

  //sending messages
  socket.on('live chat', async (data)=> {
    try {
           // add the message to the rooms message array
           const newMessage = new LiveChat({
            message: data.message,
             senderId: data.username,
              timestamp: data.currentDate,
               imgUrl:data.file,
           });
         await newMessage.save();
         io.emit('live chat', newMessage);
    } catch (error) {
      socket.emit("error", {message: 'an error occured when sending a message'})
    }
  })
 
  socket.on('disconnect', ()=> {
  })
})


http.listen(port, ()=> console.log(`server is on port ${port}`));