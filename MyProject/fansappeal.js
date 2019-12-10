

let comments = [];
if(db.getComments())
    comments = db.getComments();
showComments();

document.getElementById('comment-add').onclick = function () {
    let commentBody = document.getElementById('comment-body');
    let comment = {
        body: commentBody.value,
        time: Math.floor(Date.now() / 1000)
    }
    if (commentBody.value == '') { alert("Заповніть поле коментаря"); }
    else if (commentBody.value == 0) { alert("Коментар не може містити пробіли"); } else {
        commentBody.value = '';
        comments.push(comment);
        db.addComment(comment);
        if(navigator.onLine)
            showComments();
        else
            alert("Інтернет з'єднання втрачено. При відновлені з'єднання дані будуть збережені");
    };
}