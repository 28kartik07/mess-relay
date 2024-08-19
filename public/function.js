var likebutton = document.querySelectorAll(".inc");

likebutton.forEach(function(button){
    
  button.addEventListener("click",function(){
    var likes = {
      userid : "",
      add : "",
      remove : "",
      upvote : 0
    };
    var c_id = button.getAttribute("data-value1");
    var u_id = button.getAttribute("data-value4");
    var votes = button.getAttribute("data-value2");
    var arr = button.getAttribute("data-value3").split(',');

    console.log("Initial arr : ", arr);

    var index = arr.indexOf(u_id); 
    console.log("u_id:", u_id);
    console.log("index:", index);

    if(index !== -1){  
      console.log("decrease");
      votes--;
      arr.splice(index, 1); 
      button.setAttribute("data-value3", arr.join(',')); 
      button.setAttribute("data-value2", votes); 
      likes.add="";
      likes.remove=u_id;
    } else {
      console.log("increase");
      votes++;
      arr.push(u_id); 
      button.setAttribute("data-value3", arr.join(',')); // Update the array
      button.setAttribute("data-value2", votes);
      likes.add=u_id;
      likes.remove="";
    }

    console.log("Updated arr:", arr); 
    likes.userid=c_id;
    likes.upvote=votes;
    document.getElementById("like_" + c_id).innerHTML = votes;
    var likedata = [];
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

/////////////////////////// FOR DISLIKE /////////////////////////////////////

var dislikebutton = document.querySelectorAll(".dec");

dislikebutton.forEach(function(button) {
  button.addEventListener("click", function() {
    var dislikes = {
      userid: "",
      add: "",
      remove: "",
      downvote: 0
    };
    var c_id = button.getAttribute("data-value1");
    var u_id = button.getAttribute("data-value4");
    var votes = parseInt(button.getAttribute("data-value2"), 10);
    var arr = button.getAttribute("data-value3").split(',');

    console.log("Initial arr : ", arr);

    // Use indexOf instead of find to get the index
    var index = arr.indexOf(u_id); 
    console.log("u_id:", u_id);
    console.log("index:", index);

    if(index !== -1) {  // User has already disliked, so remove the dislike
      console.log("decrease");
      votes--;
      arr.splice(index, 1); 
      button.setAttribute("data-value3", arr.join(',')); 
      button.setAttribute("data-value2", votes); 
      dislikes.add = "";
      dislikes.remove = u_id;
    } else {  // User has not disliked, so add the dislike
      console.log("increase");
      votes++;
      arr.push(u_id); 
      button.setAttribute("data-value3", arr.join(',')); // Update the array
      button.setAttribute("data-value2", votes);
      dislikes.add = u_id;
      dislikes.remove = "";
    }

    console.log("Updated arr:", arr); 
    dislikes.userid = c_id;
    dislikes.downvote = votes;
    document.getElementById("dislike_" + c_id).innerHTML = votes;
    var dislikedata = [];
    dislikedata.push(dislikes);
    send(dislikedata);
  });
});
//   dislikebutton.forEach(function(button){
//     var likes = {
//       userid : "",
//       add : "",
//       remove : "",
//       downvote : 0
//     };
//   button.addEventListener("click",function(){
//     var c_id = button.getAttribute("data-value1");
//     var u_id = button.getAttribute("data-value4");
//     var votes = button.getAttribute("data-value2");
//     var arr = button.getAttribute("data-value3").split(',');

//     console.log("arr : ",arr);
//     // console.log(id);
//     // likes.userid=id;
//     var index=arr.find(i => i === u_id); 
//     console.log("u_id:", u_id);
//     console.log("index:", index);
//     if(index !== undefined){
//       console.log("decrease");
//       votes--;
//       likes.add="";
//       likes.remove=u_id;
//     }
//     else{
//       console.log("increase");
//       votes++;
//       likes.add=u_id;
//       likes.remove="";
//     }
//     likes.userid=c_id;
//     likes.downvote=votes;
//     // loaded=true;
//     document.getElementById("dislike_"+c_id).innerHTML = votes;
//     var dislikedata=[];
//       dislikedata.push(likes);
//     send(dislikedata);
//   });
// }); 

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
