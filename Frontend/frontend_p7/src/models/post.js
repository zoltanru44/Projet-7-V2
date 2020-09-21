export default class Post {
    constructor(date, time, id, id_author, username, modification_date, modification_time, text, comments) {
        this.date = date;
        this.time = time;
        this.id = id;
        this.id_author = id_author;
        this.username = username;
        this.modification_date = modification_date;
        this.modification_time = modification_time;
        this.text = text;
        this.comments = comments;
    }
}