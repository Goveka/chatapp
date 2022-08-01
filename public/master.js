const socket=io();
let messages=document.getElementById("messages")
let form=document.getElementById('form');
let input=document.getElementById('input')
let button=document.getElementById('button')
let userName=document.getElementById('name')
let namebutton= document.getElementById('namebutton')
const status=document.getElementById('status')
const saveElement=document.getElementById('saved')
let chats=document.getElementById('chats')
let userId=document.getElementById('userId')
let time=document.getElementById('time').innerHTML='Time:'+ new Date()
let theme=document.getElementById('theme')
  let user=''

namebutton.addEventListener('click', name)
theme.addEventListener('click', change)

function change(changeTheme){
let body=document.getElementById('body');
body.style.background="#A17602";
let header=document.getElementById('header');
header.style.background="#A13B7A";
header.style.border="#A13B7A";
chats.style.background="#8FA156";
form.style.background="#A13B7A"
}


function name(hi) {

if (userName.value === '') {
  alert('hey, please enter your name')
}else if (userName.value.length <= 3) {
  alert('hey, your name is really short')
}else if (userName.value === 'undifined' || userName.value === 'unknown') {
  alert("hey, that's no a valid name")
}
else {
  chats.style.display='block';
  form.style.display="flex";
  userId.style.display="none";
  user=userName.value
  status.innerHTML= user + ":" +'joined'
}
}


button.addEventListener('click', emaen)


function setUsername() {
  socket.emit('setUsername', userName)
}
socket.on('userExist', function (data) {
  alert(data)
})

socket.on('userSet', function(data){
  users=data.userName;

})


function emaen(hello) {
  hello.preventDefault();

let minutes=new Date().getMinutes();
let hours=new Date().getHours();
let week=new Date().getDay();
let day=new Date().getDate();
let month=new Date().getMonth();
let dayWords

if (week == 1 ) {
  dayWords='Monday'
}else if (week ==2 ) {
  dayWords='Tuesday'
}else if (week == 3 ) {
  dayWords='Wednesday'
}else if (week == 4 ) {
  dayWords="Thursday"
}else if (week == 5 ) {
  dayWords='Friday'
}else if (week == 6 ) {
dayWords='saturday'
}else if (week ==7 ) {
  dayWords='sunday'
}


let date= dayWords + ':' +hours +':'+minutes

  if(input.value){
    socket.emit('chat message', {input:input.value, user:user, time:date});
    input.value='';
}
}


socket.on('chat message', async function (msg) {

let item=document.createElement('li');
item.classList="items"
item.innerHTML=msg.user + ':' + msg.input + '</br>' + msg.time;
messages.appendChild(item);


//create and show notification
const showNotification =() =>{
  //create new showNotification
  const notification= new Notification('SIZWE CHAT APP', {
    body: 'You have a new messages',
    icon: 'FB_IMG_16521914196812297.jpg'
  })

  notification.addEventListener('click', ()=>{
    window.open('https://chatsizwe.herokuapp.com/')
    notification.close()
  })
}

// check notification permission
let granted= false;
if(Notification.permission === 'granted'){
  granted = true;
}else if (Notification.permission !== 'denied') {
  let permission= await Notification.requestPermission();
  granted = permission === 'granted' ? true : false;
}
granted ? showNotification() : console.log('error');
})

socket.on('output', function (res){


  let savedName=res.map((names) => {return names.user})
  let savedInput=res.map((inputs) => {return inputs.input})
  let savedTime=res.map((times)=>{ return times.time})
for (var i = 0; i < savedName.length && savedInput.length && savedTime.length; i++) {
  let item=document.createElement('li');
  item.classList="items"
  item.innerHTML= savedName[i] + ':' + savedInput[i]+ '</br>'+ savedTime[i]  ;
  messages.appendChild(item)
}

})
