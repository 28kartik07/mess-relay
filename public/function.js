let loaded=false;
var likedata = [];

var likebutton = document.querySelectorAll(".val");

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
    var arr = [];
    arr.push(button.getAttribute("data-value3"));
    // console.log(id);
    // likes.userid=id;
    var index=arr.find(i => i === u_id);
    if(index !== undefined){
      votes--;
      likes.add="";
      likes.remove=u_id;
    }
    else{
      votes++;
      likes.add=u_id;
      likes.remove="";
    }
    likes.userid=c_id;
    likes.upvote=votes;
    loaded=true;
    document.getElementById("like_"+c_id).innerHTML = votes;
    var ind = likedata.find(i => i.userid === c_id);
    if(ind !== undefined)
    {
      ind.upvote = votes;
      ind.add=likes.add;
      ind.remove=likes.remove;
    }
    else
    { 
      likedata.push(likes);
    }
  });
}); 


// var dislikebutton=document.querySelectorAll(".dec");

// dislikebutton.forEach(function(i){
//     var clicks=0;
//     var dislikes={
//         userid : "",
//         downvote : 0
//     };
//     i.addEventListener("click",function(){
//       var id = i.getAttribute("data-val1");
//       var votes = i.getAttribute("data-val2");
//       if(clicks%2 == 0){
//         votes++;
//       }
//       dislikes.userid=id;
//       dislikes.downvote=votes;
//       clicks++;
//       document.getElementById("dislike_"+id).innerHTML = votes;
//       loaded=true;
//       var index=likedata.find(j => j.userid===id);
//       if(index!=undefined){
//         index.downvote=votes;
//       }
//       else{
//         likedata.push(dislikes);
//       }
//     });
//   });
  

  window.addEventListener('beforeunload', function () {
    if(loaded){
      console.log(likedata);
      const payload = { likedata };
    
      // Perform the fetch operation to send data to the server
      fetch('/userprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      loaded=false;
    }
  });


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

const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [12, 19, 3],
        backgroundColor: ['#FFA07A ', '#90EE90', '#87CEFA'],
        borderWidth: 1
      }]
    }
  });