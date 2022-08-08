// navbar
let mainNav = document.getElementById("js-menu");
let navBarToggle = document.getElementById("js-navbar-toggle");
let like = document.querySelectorAll(".likeToggle");
  openPass = document.querySelector('.openPass'),
  closePass = document.querySelector('.closePass');
  oldPass = document.querySelector('.oldPass');
  
  openPass1 = document.querySelector('.openPass1'),
  closePass1 = document.querySelector('.closePass1');
  oldPass1 = document.querySelector('.oldPass1');

  openPass2 = document.querySelector('.openPass2'),
  closePass2 = document.querySelector('.closePass2');
  oldPass2 = document.querySelector('.oldPass2');

//like
like.forEach((item, index) => {
  item.addEventListener('click',() => {
    // console.log('123');
    item.classList.toggle("likes");
    
  })
})

navBarToggle.addEventListener("click", function() {
  mainNav.classList.toggle("active");
});

// tabs

function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();

const logOut = document.getElementById('logOut'),
    EditProfile = document.getElementById('EditProfile'),
    allInput = EditProfile.querySelectorAll('input'),
    SaveChangeProfile = EditProfile.querySelector('#SaveChangeProfile');
allInput[0].value = userData.result[0].name;
allInput[1].value = userData.result[0].card;
allInput[2].value = userData.result[0].username;
allInput[3].value = userData.result[0].mail;
allInput[4].value = userData.result[0].pass_word;
allInput[5].value = "";
allInput[6].value = "";
allInput[7].value = userData.result[0].phone;

SaveChangeProfile.addEventListener('click', function (argument) {
    event.preventDefault();
     const request = new XMLHttpRequest();
     request.open('POST', '../api/v1/?do=editProfile',true);
     request.addEventListener('load', function (argument) {
         if (request.status === 200) {
            data = JSON.parse(request.responseText);
            console.log(data);
            if (data.ok === true && data.code === 200) {
                // alert('success');
                element = document.getElementById("error").innerHTML = `
                <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-success d-flex align-items-center fixed-bottom" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
                <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                </svg>
                &nbsp;
                    <div>
                        Successfuly
                    </div>
                </div>`;
              
              setTimeout(() => {
                element.style.visibility = 'hidden';
              }, 2000);
            }else{
                alert('unsuccess');
            }
         };
     });
     EditProfileForm = new FormData(EditProfile);
     request.send(EditProfileForm);
});

logOut.addEventListener('click',function (argument) {
    localStorage.removeItem('user_id');
    localStorage.removeItem('untilDate');
    window.location.href = '../';
});




//chart
var xValues = [100,200,300,400,500,600,700,800,900,1000];

new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{ 
      data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478],
      borderColor: "red",
      fill: false
    }, { 
      data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000],
      borderColor: "green",
      fill: false
    }, { 
      data: [300,700,2000,5000,6000,4000,2000,1000,200,100],
      borderColor: "blue",
      fill: false
    }]
  },
  options: {
    legend: {display: false}
  }
});

//////////////////

  
// pass_word 1
openPass.addEventListener('click', () => {
  openPass.style.display = 'none';
  closePass.style.display = 'block'; 
  oldPass.type = 'password'
})
closePass.addEventListener('click', () => {
  openPass.style.display = 'block';
  closePass.style.display = 'none';  
  oldPass.type = 'text'
})

// pass_word 2
openPass1.addEventListener('click', () => {
  openPass1.style.display = 'none';
  closePass1.style.display = 'block'; 
  oldPass1.type = 'password';
})
closePass1.addEventListener('click', () => {
  openPass1.style.display = 'block';
  closePass1.style.display = 'none';  
  oldPass1.type = 'text';
})

// pass_word 3
openPass2.addEventListener('click', () => {
  openPass2.style.display = 'none';
  closePass2.style.display = 'block'; 
  oldPass2.type = 'password';
})
closePass2.addEventListener('click', () => {
  openPass2.style.display = 'block';
  closePass2.style.display = 'none';  
  oldPass2.type = 'text';
})
