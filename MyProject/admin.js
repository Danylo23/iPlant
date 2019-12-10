let newss = [];
if (db.getNews())
    comments = db.getNews();
document.getElementById('News_add').onclick = function () {
    let commentTitle = document.getElementById('News_title');
    let commentText = document.getElementById('News_text');

    let news = {
        title: commentTitle.value,
        text: commentText.value,
    }
    if (commentTitle.value == '') { alert("Заповніть поле заголовку"); }
    else if (commentTitle.value == 0) { alert("Заголовок не може містити пробіли"); }
    else if (commentText.value == '') { alert("Заповніть поле тексту новин"); }
    else if (commentText.value == 0) { alert("Поле новин не може містити пробіли"); } else {
        commentTitle.value = '';
        commentText.value = '';
        newss.push(news);
        db.addNews(news);
        if(navigator.onLine) {
            showNewss();
            alert("Новина успішно додана");
        } else {
            alert("Інтернет з'єднання втрачено. При відновлені з'єднання дані будуть збережені");
        }
    };
}