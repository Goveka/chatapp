const profilePics= document.querySelectorAll(".profilePics").forEach((profile)=>{
    profile.addEventListener('click', (event)=>{
        const imgSrcInput= document.getElementById("profilePic");
        const src= event.target.src
        imgSrcInput.value=src;
        alert('the image has been selected')
    })
})