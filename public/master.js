const socket=io();
let messages=document.getElementById("messages")
let form=document.getElementById('form');
let input=document.getElementById('input')
let button=document.getElementById('button')
let userName=document.getElementById('name').value
let namebutton= document.getElementById('namebutton')
const status=document.getElementById('status')
  let user

namebutton.addEventListener('click', name)

function name(hi) {

user=userName
console.log(user);
status.textContent= user + ":" +'joined'
}


button.addEventListener('click', emaen)


function setUsername() {
  socket.emit('setUsername', userName)
}
socket.on('userExist', function (data) {
  alert(data)
})

socket.on('userSet', function(data){
  user=data.userName;

})

function emaen(hello) {
  hello.preventDefault();
  if(input.value){
    socket.emit('chat message', {input:input.value, user:user});
    input.value='';
}

}

socket.on('chat message', function (msg) {
  console.log('user connection');
let item=document.createElement('li');
item.classList="items"
item.innerHTML=  msg.user + ':' + msg.input ;
messages.appendChild(item);
window.scrollTo(0, document.body.scrollHeight);

})
