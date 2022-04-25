const socket=io();
let messages=document.getElementById("messages")
let form=document.getElementById('form');
let input=document.getElementById('input')
let button=document.getElementById('button')


button.addEventListener('click', emaen)

function emaen(hello) {
  hello.preventDefault();
  if(input.value){
    socket.emit('chat message', input.value);
    input.value='';
}

}



socket.on('chat message', function (msg) {
  console.log('user connection');
let item=document.createElement('li');
item.classList="items"
item.textContent=msg;
messages.appendChild(item);
window.scrollTo(0, document.body.scrollHeight);

})
