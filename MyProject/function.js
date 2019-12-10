class Comment {
    constructor(body, time) {
        this.body = body;
        this.time = time;
    }
}

class News {
    constructor(title, text) {
        this.title = title;
        this.text = text;
    }
}

class IndexDB {
    constructor() { }

    addComment(comment) {
        var openRequest = indexedDB.open("myDB", 1);
        var db;

        openRequest.onupgradeneeded = function (e) {
            var db = e.target.result;
            console.log('running onupgradeneeded');
            if (!db.objectStoreNames.contains('comments')) {
                var productOS = db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });

                productOS.createIndex('body', 'body', { unique: false });

                productOS.createIndex('time', 'time', { unique: false });
            }

            if (!db.objectStoreNames.contains('news')) {
                var productOS = db.createObjectStore('news', { keyPath: 'id', autoIncrement: true });

                productOS.createIndex('title', 'title', { unique: false });

                productOS.createIndex('text', 'text', { unique: false });
            }
        };

        openRequest.onsuccess = function (e) {
            console.log(comment);
            db = e.target.result;
            var transaction = db.transaction(['comments'], 'readwrite');
            var comments = transaction.objectStore('comments');

            var request = comments.add(comment);

            request.onerror = function (e) {
                console.log('Error', e.target.error.name);
            };
            request.onsuccess = function (e) {
                console.log('Woot! Did it');
            };
        };

        openRequest.onerror = function (e) {
            console.log('onerror!');
            console.dir(e);
        };
    }

    addNews(news) {
        var openRequest = indexedDB.open("myDB", 1);
        var db;

        openRequest.onupgradeneeded = function (e) {
            var db = e.target.result;
            console.log('running onupgradeneeded');
            if (!db.objectStoreNames.contains('comments')) {
                var productOS = db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });

                productOS.createIndex('body', 'body', { unique: false });

                productOS.createIndex('time', 'time', { unique: false });
            }

            if (!db.objectStoreNames.contains('news')) {
                var productOS = db.createObjectStore('news', { keyPath: 'id', autoIncrement: true });

                productOS.createIndex('title', 'title', { unique: false });

                productOS.createIndex('text', 'text', { unique: false });
            }
        };

        openRequest.onsuccess = function (e) {
            console.log(news);
            db = e.target.result;
            var transaction = db.transaction(['news'], 'readwrite');
            var mnews = transaction.objectStore('news');

            var request = mnews.add(news);

            request.onerror = function (e) {
                console.log('Error', e.target.error.name);
            };
            request.onsuccess = function (e) {
                console.log('Woot! Did it');
            };
        };

        openRequest.onerror = function (e) {
            console.log('onerror!');
            console.dir(e);
        };
    }

    getComments() {
        var openRequest = indexedDB.open("myDB", 1);
        var db;

        openRequest.onupgradeneeded = function (e) {
            var db = e.target.result;
            console.log('running onupgradeneeded');
            if (!db.objectStoreNames.contains('comments')) {
                var productOS = db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });

                productOS.createIndex('body', 'body', { unique: false });

                productOS.createIndex('time', 'time', { unique: false });
            }

            if (!db.objectStoreNames.contains('news')) {
                var productOS = db.createObjectStore('news', { keyPath: 'id', autoIncrement: true });

                productOS.createIndex('title', 'title', { unique: false });

                productOS.createIndex('text', 'text', { unique: false });
            }
        };

        openRequest.onsuccess = function (e) {
            db = e.target.result;

            var objectStore = db.transaction("comments").objectStore("comments");

            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    comments.push(new Comment(cursor.value.body, cursor.value.time));
                    cursor.continue();
                }
                else {
                    console.log("No more entries!");
                }
                showComments();
            };

        };

        openRequest.onerror = function (e) {
            console.log('onerror!');
            console.dir(e);
        };
    }

    getNews() {
        var openRequest = indexedDB.open("myDB", 1);
        var db;

        openRequest.onupgradeneeded = function (e) {
            var db = e.target.result;
            console.log('running onupgradeneeded');
            if (!db.objectStoreNames.contains('comments')) {
                var productOS = db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });

                productOS.createIndex('body', 'body', { unique: false });

                productOS.createIndex('time', 'time', { unique: false });
            }

            if (!db.objectStoreNames.contains('news')) {
                var productOS = db.createObjectStore('news', { keyPath: 'id', autoIncrement: true });

                productOS.createIndex('title', 'title', { unique: false });

                productOS.createIndex('text', 'text', { unique: false });
            }
        };

        openRequest.onsuccess = function (e) {
            console.log('running onsuccess');
            db = e.target.result;

            var objectStore = db.transaction("news").objectStore("news");

            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    newss.push(new News(cursor.value.title, cursor.value.text));
                    cursor.continue();
                }
                else {
                    console.log("No more entries!");
                }
                showNewss();
            };
        };

        openRequest.onerror = function (e) {
            console.log('onerror!');
            console.dir(e);
        };

    }
}

class LocalStorage {
    constructor() {
    }

    addComment(comment) {
        var comments = this.getComments();
        comments.push(comment);
        localStorage.setItem('comments', JSON.stringify(comments));
        console.log(comments);
    }

    addNews(news) {
        var mnews = this.getNews();
        mnews.push(news);
        localStorage.setItem('newss', JSON.stringify(mnews));
        console.log(mnews);
    }

    getComments() {
        var comments = [];
        if (JSON.parse(localStorage.getItem('comments')))
            comments = JSON.parse(localStorage.getItem('comments'));
        return comments;
    }

    getNews() {
        var news = [];
        if (JSON.parse(localStorage.getItem('newss')))
            news = JSON.parse(localStorage.getItem('newss'));
        return news;
    }
}

var useLocalStorage = false;

var db;
if (useLocalStorage) {
    db = new LocalStorage();
}
else {
    db = new IndexDB();
}

function showComments() {
    let commentField = document.getElementById('comment-field');
    let out = '';
    comments.forEach(function (item) {

        out += `<br><br>`;
        out += `<div class="container"><div class="row text-center"><div class="w-100"></div><div class="col-md-3 text-left">Fan6793<br>${timeConverter(item.time)}</div>`;
        out += `<div class="col-md-9 text-left">${item.body}</div><br></div></div></div><br>`;
        out += `<div style="border-bottom: 2px solid"></div>`;
    });
    commentField.innerHTML = out;

}
function showNewss() {
    let commentField = document.getElementById('news-field');
    let out = '';
    newss.forEach(function (item) {

        out += `<div class="col-md-6 col-lg-4"><div class="col-xs" style="border: 1px solid"><img src="images/2.jpg" width="100%"><div class="panel"><div class="panel-heading" style="background: #EAEAE1 text-color: #EAEAE1">`;
        out += `<p style="height: 75px;overflow: auto;">${item.title}</p>`;
        out += `</div><div class="panel-body">`;

        out += `<p style="height: 200px;overflow: auto;">${item.text}</p>`;
        out += `</div></div></div></div>`;

    });
    commentField.innerHTML = out;

}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

//-------------------------------------------------------

$(document).ready(function() {
    $('.header').height($(window).height());
})


$(document).ready(function(){
    $('.login-info-box').fadeOut();
    $('.login-show').addClass('show-log-panel');
});


$('.login-reg-panel input[type="radio"]').on('change', function() {
    if($('#log-login-show').is(':checked')) {
        $('.register-info-box').fadeOut(); 
        $('.login-info-box').fadeIn();
        
        $('.white-panel').addClass('right-log');
        $('.register-show').addClass('show-log-panel');
        $('.login-show').removeClass('show-log-panel');
        
    }
    else if($('#log-reg-show').is(':checked')) {
        $('.register-info-box').fadeIn();
        $('.login-info-box').fadeOut();
        
        $('.white-panel').removeClass('right-log');
        
        $('.login-show').addClass('show-log-panel');
        $('.register-show').removeClass('show-log-panel');
    }
});