class Post {
    constructor(title, id ,user_id, image, text) {
        this.title = title;
        this.id = id;
        this.user_id = user_id;
        this.image = image;
        this.text = text;
    }
}

module.exports = Post;