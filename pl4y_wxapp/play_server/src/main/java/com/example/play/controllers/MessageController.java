package com.example.play.controllers;

import com.example.play.dao.MessageRepository;
import com.example.play.entities.Message;
import com.example.play.response.ResponseJson;
import com.example.play.response.ResponseMessages;
import com.example.play.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MessageController {
    @Autowired
    MessageRepository messageRepository;
    @Autowired
    MessageService messageService;
    /**
     * 获取用户信息列表
     * @param userid
     * @return
     */
    @GetMapping("/messages/{userid}")
    public ResponseMessages getMessages(@PathVariable("userid") String userid){
        ResponseMessages res=new ResponseMessages();
        List<Message> messages;
        try{
            messages=messageRepository.getUserMessages(Long.parseLong(userid));
            res.setSuccess(true);
            res.setMessage("获取信息成功");
            res.setMessages(messages);
        }catch(Exception e){
            res.setSuccess(false);
            res.setMessage(e.getMessage());
            res.setMessages(null);
        }
        return res;
    }

    /**
     * 读取一信息
     * @param messageId
     * @return
     */
    @PutMapping("/message/{messageId}")
    public ResponseJson readOneMessage(@PathVariable("messageId") String messageId){
        ResponseJson res=messageService.readOneMessage(Long.parseLong(messageId));
        return res;
    }
}
