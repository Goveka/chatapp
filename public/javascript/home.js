 const socket = io();

const userList= document.querySelectorAll('.userList')

userList.forEach( async function(user){
    user.addEventListener('click', (event)=>{
        const receiverId = user.id;
        fetch('/chat-rooms', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({receiverId}),
        })
        .then((response)=> response.json())
        .then((data)=> {
            const roomId = data.roomId;
            if (data.roomExists) {
                window.location.href = `/private-rooms/${roomId}/${receiverId}`;  
            } else {
                window.location.href = `/private-rooms/${roomId}/${receiverId}`;
            }
        })
        .catch((error) => console.log(error))
    })
})
