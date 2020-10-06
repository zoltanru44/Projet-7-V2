export default class User {
    constructor(email, username, password, new_password) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.new_password = new_password;
    }
}