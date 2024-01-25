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
      console.log(index.upvote);
    }
    else
    { 
      likedata.push(likes);
      console.log("not found");
    }
  });
}); 




