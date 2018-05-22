package com.example.play.response;

import com.example.play.entities.User;

public class ResponseUser extends ResponseJson{
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
