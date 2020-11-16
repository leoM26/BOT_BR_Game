"use strict";
class Member{
    id = null;
    role = null;
    answered = false;
    mots = [];
    username;
    constructor(id, username){
        this.id = id;
        this.username = username;
    }

    addRole(role){
        this.role = role;
    }
}

module.exports = {Member};