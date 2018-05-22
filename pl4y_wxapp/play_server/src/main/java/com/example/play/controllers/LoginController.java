package com.example.play.controllers;

import com.example.play.dao.UserRepository;
import com.example.play.entities.User;
import com.example.play.response.ResponseJson;
import com.example.play.response.ResponseSession;
import com.example.play.service.WxLoginInfo;
import com.example.play.service.WxLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {
    @Autowired
    WxLoginService wxLoginService;
    @Autowired
    UserRepository userRepository;
    @PostMapping("/login")
    public ResponseSession Login(
            @RequestParam("code") String code
    ){
        ResponseSession res= new ResponseSession();
        try {
            res = wxLoginService.getWxLoginInfo(code);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            res.setSuccess(false);
            res.setMessage(e.getMessage());
            res.setMysession(null);
        }
        return res;
    }
    @PostMapping("/checkLogin")
    public ResponseJson checkLogin(@RequestParam("sessionId") String sessionId,
                                   @RequestParam("sessionValue") String sessionValue){
                ResponseJson res=new ResponseJson();
                try{
                    Boolean b=wxLoginService.checkLogin(sessionId,sessionValue);
                    if(b){
                        res.setSuccess(true);
                        res.setMessage("已经登录");
                    }else{
                        res.setSuccess(false);
                        res.setMessage("未登录");
                    }
                }catch (Exception e){
                    res.setMessage("error"+e.getMessage());
                    res.setSuccess(false);
                }
                return res;

    }
//    @PostMapping("/normalLogin")
//    public ResponseJson normalLogin(@RequestParam("username") String username,@RequestParam("password") String password){
//        ResponseJson res=new ResponseJson();
//        try{
//            User u= userRepository.findUserByUsername(username);
//            if(u.getPassword().equals(password)){
//                res.setSuccess(true);
//                res.setMessage("登录成功");
//            }
//        }catch(Exception e){
//            res.setMessage("没有此用户");
//            res.setSuccess(false);
//        }
//        return res;
//    }
}
