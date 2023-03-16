const profilePics= document.querySelectorAll(".profilePics").forEach((profile)=>{
    profile.addEventListener('click', (event)=>{
        const imgSrcInput= document.getElementById("profilePic");
        const src= event.target.src
        imgSrcInput.value=src;
        alert('the image has been selected')
    })
})


 async function addProfilePic(){
    const profilePicInput= document.getElementById('profilePicInput');
    const file= profilePicInput.files[0];

    // Create a new form data object
    const formData = new FormData();
    formData.append('image', file);

    // Use Axios to upload the image to ImgBB
    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: {
        'content-type': 'multipart/form-data'
      },
      params: {
        key: '6ec3827f4865e3031a08d0cabde77286'
      }
    });

    // Get the image URL from the ImgBB API response
    const imgSrcInput= document.getElementById("profilePic");
    const imageUrl = response.data.data.url;
    imgSrcInput.value=imageUrl;
    alert('Your profile picture has been added, you can continue with creating youre account')
}
