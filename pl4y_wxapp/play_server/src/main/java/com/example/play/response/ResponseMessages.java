package com.example.play.response;

import com.example.play.entities.Message;

import java.util.List;

public class ResponseMessages  extends ResponseJson{
    private List<Message> messages;

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}
