var likebutton = document.querySelectorAll(".inc");
// var likedata=[];
// var loaded=false;
  likebutton.forEach(function(button){
    var likes = {
      userid : "",
      add : "",
      remove : "",
      upvote : 0
    };
  button.addEventListener("click",function(){
    var c_id = button.getAttribute("data-value1");
    var u_id = button.getAttribute("data-value4");
    var votes = button.getAttribute("data-value2");
    var arr = button.getAttribute("data-value3").split(',');

    console.log("arr : ",arr);
    // console.log(id);
    // likes.userid=id;
    var index=arr.find(i => i === u_id); 
    console.log("u_id:", u_id);
    console.log("index:", index);
    if(index !== undefined){
      console.log("decrease");
      votes--;
      likes.add="";
      likes.remove=u_id;
    }
    else{
      console.log("increase");
      votes++;
      likes.add=u_id;
      likes.remove="";
    }
    likes.userid=c_id;
    likes.upvote=votes;
    document.getElementById("like_"+c_id).innerHTML = votes;
    var likedata=[];
    likedata.push(likes);
    likesend(likedata);
  });
}); 

function likesend(likedata){
  fetch('/userprofile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({likedata}),
  }).then((response) => response.json());
}
// window.addEventListener('beforeunload', function () {
//   if(loaded){
//     // console.log(likedata);
//     const payload = { likedata };
  
//     // Perform the fetch operation to send data to the server
//     fetch('/userprofile', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     }).then((response) => response.json());

//     loaded=false;
//   }
// });

var dislikebutton = document.querySelectorAll(".dec");

  dislikebutton.forEach(function(button){
    var likes = {
      userid : "",
      add : "",
      remove : "",
      downvote : 0
    };
  button.addEventListener("click",function(){
    var c_id = button.getAttribute("data-value1");
    var u_id = button.getAttribute("data-value4");
    var votes = button.getAttribute("data-value2");
    var arr = button.getAttribute("data-value3").split(',');

    console.log("arr : ",arr);
    // console.log(id);
    // likes.userid=id;
    var index=arr.find(i => i === u_id); 
    console.log("u_id:", u_id);
    console.log("index:", index);
    if(index !== undefined){
      console.log("decrease");
      votes--;
      likes.add="";
      likes.remove=u_id;
    }
    else{
      console.log("increase");
      votes++;
      likes.add=u_id;
      likes.remove="";
    }
    likes.userid=c_id;
    likes.downvote=votes;
    // loaded=true;
    document.getElementById("dislike_"+c_id).innerHTML = votes;
    var dislikedata=[];
      dislikedata.push(likes);
    send(dislikedata);
  });
}); 

function send(dislikedata){
  fetch('/userprofile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({dislikedata}),
  }).then((response) => response.json());
}
  // JavaScript
var tick1=document.querySelectorAll('#checkbox1');
tick1.forEach(function(i){
  // console.log(i.value);
  var senddata=[];
  i.addEventListener('click', function() {
    senddata.push(i.getAttribute("data-value1"));
    senddata.push(i.getAttribute("data-value2"));
    sendData(senddata);
  });
})

var tick2=document.querySelectorAll('#checkbox2');
tick2.forEach(function(i){
  // console.log(i.value);
  var senddata=[];
  i.addEventListener('click', function() {
    senddata.push(i.getAttribute("data-value1"));
    senddata.push(i.getAttribute("data-value2"));
    sendData(senddata);
  });
})

function sendData(formData) {
  console.log(formData);
  // Send data to the server using fetch API
  fetch('/adminprofile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({formData}),
  })
  .then(data => {
      // console.log('Data sent successfully:', data);
  })
  .catch(error => {
      console.error('Error sending data to server:', error);
  });
}

const open=document.getElementsByClassName('number')[0].innerHTML;
const close=document.getElementsByClassName('number')[1].innerHTML;
const inprogress=document.getElementsByClassName('number')[2].innerHTML;

// console.log(open,close,inprogress);

const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [open, close, inprogress],
        backgroundColor: ['#FFA07A ', '#90EE90', '#87CEFA'],
        borderWidth: 1
      }]
    }
  });
