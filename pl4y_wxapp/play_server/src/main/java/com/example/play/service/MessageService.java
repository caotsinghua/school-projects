package com.example.play.service;

import com.example.play.dao.MessageRepository;
import com.example.play.entities.Message;
import com.example.play.response.ResponseJson;
import com.example.play.response.ResponseMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MessageService {
    @Autowired
    MessageRepository messageRepository;
    public static final Long adminId=new Long(1);

    @Transactional
    /**
     * 读取信息
     */
    public ResponseJson readOneMessage(Long id){
        ResponseJson res=new ResponseJson();
        int a=messageRepository.readMessage(id);
        if(a>0){
            res.setSuccess(true);
            res.setMessage("读取成功");
        }else{
            res.setSuccess(false);
            res.setMessage("无此信息");
        }
        return res;

    }

    /**
     * 发送系统消息
     *
     * @param mes
     * @return
     */
    @Transactional
    public ResponseJson postSystemMessage(Message mes){
        ResponseJson res=new ResponseJson();
        try{
            messageRepository.save(mes);
            res.setSuccess(true);
            res.setMessage("发送成功");
        }catch (Exception e){
            res.setMessage(e.getMessage());
            res.setSuccess(false);
        }
        return res;
    }



}
