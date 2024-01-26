var likedata = [];

var likebutton = document.querySelectorAll(".val");

  likebutton.forEach(function(button){
    var clicks = 0;
    var likes = {
      userid : "",
      upvote : 0
    };
  button.addEventListener("click",function(){
    var id = button.getAttribute("data-value1");
    var votes = button.getAttribute("data-value2");
    if(clicks%2 == 0)
    {
      likes.userid = id;
      votes++;
      likes.upvote = votes;
    }
    else
    {
      likes.userid = id;
      likes.upvote = votes;
    }
    clicks++;
    document.getElementById("like_"+id).innerHTML = votes;
    var index = likedata.find(i => i.userid === id);
    if(index !== undefined)
    {
      index.upvote = votes;
    }
    else
    { 
      likedata.push(likes);
    }
  });
}); 

var dislikedata = [];

var dislikebutton=document.querySelectorAll(".dec");

dislikebutton.forEach(function(i){
    var clicks=0;
    var dislikes={
        userid : "",
        downvote : 0
    };
    i.addEventListener("click",function(){
      var id = i.getAttribute("data-val1");
      var votes = i.getAttribute("data-val2");
      if(clicks%2 == 0){
        votes++;
      }
      dislikes.userid=id;
      dislikes.downvote=votes;
      clicks++;
      console.log(votes);
      document.getElementById("dislike_"+id).innerHTML = votes;
      
      var index=dislikedata.find(j => j.userid===id);
      if(index!=undefined){
        index.downvote=votes;
      }
      else{
        dislikedata.push(dislikes);
      }
    });
});

const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    }
  });
// document.addEventListener('DOMContentLoaded', function() {
//   window.addEventListener('beforeunload', function() {
//       // Perform an AJAX request to your server to store data
//       fetch('/complaint', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(likedata)
//       });
//   });
// });


