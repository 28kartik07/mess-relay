// let loaded=false;
var likedata = {
  complaint_id : "",
  likearray : [],
};

var likebutton = document.querySelectorAll(".val");
  
var arr = [];
  likebutton.forEach(function(button){
    var flag = true;
  button.addEventListener("click",function(){
    
    var c_id = button.getAttribute("data-value1");
    var u_id = button.getAttribute("data-value4");
    var votes = button.getAttribute("data-value2");
    localStorage.setItem("id", "efjef");
    var a = JSON.parse(button.getAttribute("data-value3"));
    if(flag == true)
    {
      arr = a.slice();
      flag = false;
    }
    const f = arr.indexOf(u_id);
    if(f !== -1)
    {
      arr.splice(f,1);
    }
    else
    {
      arr.push(u_id);
    }
    document.getElementById("like_"+c_id).innerHTML = arr.length;
    likedata.complaint_id = c_id;
    likedata.likearray = arr;
    console.log(arr);
  });

}); 


// like updation logic

var att = document.querySelector(".leave");
att.addEventListener("click",function(){
  console.log(localStorage.getItem("id"))
  fetch('/userprofile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(likedata)
})
// .then(response => response.json())
// .then(data => {
//   console.log(data);
// })
// .catch(error => {
//   console.error('There was a problem with the fetch operation:', error);
// });
  console.log(a);
});


// window.addEventListener('beforeunload', function () {
//   if(loaded){
//     console.log(arr);
//     const payload = {arr};
//     console.log("hello world");
//     // Perform the fetch operation to send data to the server
//     fetch('/userprofile', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     });

//     loaded=false;
//   }
// });



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
  

  

  // chart code
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