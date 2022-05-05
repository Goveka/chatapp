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
  let user=''

namebutton.addEventListener('click', name)

function name(hi) {

user=userName.value
console.log(user);
status.textContent= user + ":" +'joined'


let safe=localStorage.getItem('messages')
let safely=JSON.parse(safe)

let objs=safely.map(easy =>{
return  easy.user
})

let bj=safely.map(easy =>{
return easy.input
})

for (var i = 0; i < objs.length && bj.length; i++) {

let item=document.createElement('li')
item.classList="items"
item.innerHTML=objs[i]+':' +bj[i]

messages.appendChild(item)
console.log( objs[i])
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

function save() {


}


socket.on('chat message', function (msg) {
  console.log('user connection');
let item=document.createElement('li');
item.classList="items"
item.innerHTML=  msg.user + ':' + msg.input ;
messages.appendChild(item);
})

socket.on('output', function (res){
  console.log(res);
  let savedName=res.map((names) => {return names.user})
  let savedInput=res.map((inputs) => {return inputs.input})
for (var i = 0; i < savedName.length && savedInput.length; i++) {
  let item=document.createElement('li');
  item.classList="items"
  item.innerHTML=savedName[i] + ':' + savedInput[i];
  messages.appendChild(item)
}

})
