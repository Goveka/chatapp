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
alert('available soon')
}


function name(hi) {

if (userName.value === '') {
  alert('hey mother fucker enter your name')
}else if (userName.value.length < 3) {
  alert('hey bitch username is really short')
}else {
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
let day=new Date().getDay();
let dayWords
if (day == 1) {
  dayWords='Monday'
}else if (day ==2) {
  dayWords='Tuesday'
}else if (day == 3) {
  dayWords='Wednesday'
}else if (day == 4) {
  daywords="Thursday"
}else if (day == 5) {
  dayWords='Friday'
}else if (day == 6) {
dayWords='Saturday'
}else if (day ==7) {
  dayWords='sunday'
}

let date=dayWords + ':' +hours +':'+minutes

  if(input.value){
    socket.emit('chat message', {input:input.value, user:user, time:date});
    input.value='';
}
}


socket.on('chat message', function (msg) {

let item=document.createElement('li');
item.classList="items"
item.innerHTML=msg.user + ':' + msg.input + '</br>' + msg.time;
messages.appendChild(item);
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
