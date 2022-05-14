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
  let user=''

namebutton.addEventListener('click', name)

function name(hi) {

if (userName.value === '') {
  alert('hey mother fucker enter your name')
}else if (userName.value < 3) {
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
  if(input.value){
    socket.emit('chat message', {input:input.value, user:user});
    input.value='';
}
}


socket.on('chat message', function (msg) {

let item=document.createElement('li');
item.classList="items"
item.innerHTML=  msg.user + ':' + msg.input;
messages.appendChild(item);
})

socket.on('output', function (res){

  let savedName=res.map((names) => {return names.user})
  let savedInput=res.map((inputs) => {return inputs.input})
for (var i = 0; i < savedName.length && savedInput.length; i++) {
  let item=document.createElement('li');
  item.classList="items"
  item.innerHTML=savedName[i] + ':' + savedInput[i]  ;
  messages.appendChild(item)
}

})
