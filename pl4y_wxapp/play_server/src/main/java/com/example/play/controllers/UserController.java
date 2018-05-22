package com.example.play.controllers;

import com.example.play.dao.UserRepository;
import com.example.play.entities.User;
import com.example.play.response.RequestUsersMap;
import com.example.play.response.ResponseJson;
import com.example.play.response.ResponseUser;
import com.example.play.service.UserService;
import com.sun.org.apache.xpath.internal.operations.Bool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import sun.net.www.http.HttpClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;
    @Autowired
    private RestTemplate restTemplate;
    /**
     * 获取用户信息
     * @return
     */
    @GetMapping("/user/{openid}")
    public ResponseUser getUserInfo(@PathVariable("openid") String openid){
        ResponseUser res=new ResponseUser();
        User u=null;
        try{
            u=userRepository.findFirstByOpenid(openid);
        }catch(Exception e){
            u=null;
        }
        if(u==null){
            res.setSuccess(false);
            res.setUser(u);
            res.setMessage("没有此用户");
        }else{

            res.setSuccess(true);
            res.setUser(u);
            res.setMessage("获取用户信息成功");
        }
        return res;

    }
    @GetMapping("/userbyid/{id}")
    public ResponseUser getUserInfo2(@PathVariable("id") Long id){
        ResponseUser res=new ResponseUser();
        User u=null;
        try{
            u=userRepository.findOne(id);
        }catch(Exception e){
            u=null;
        }
        if(u==null){
            res.setSuccess(false);
            res.setUser(u);
            res.setMessage("没有此用户");
        }else{
            res.setSuccess(true);
            res.setUser(u);
            res.setMessage("获取用户信息成功");
        }
        return res;

    }
    /**
     * 添加一个用户(注册)
     * 微信登录后的openid在user表中不存在的即转入添加用户名密码操作
     * @param u
     * @return
     */
    @PostMapping("/register")
    public ResponseUser addUser(User u){
        //获取用户名，手机，openid.
        ResponseUser res=userService.addOneUser(u);

        return res;
    }

    /**
     * 删除用户（只有管理员有权限）
     * @param id
     * @return
     */
    @DeleteMapping("/user/{id}")
    public ResponseJson deleteUser(@PathVariable("id") Long id){
        ResponseJson res=new ResponseJson();
        try{
            userRepository.delete(id);
            res.setSuccess(true);
            res.setMessage("删除用户成功");
        }catch(Exception e){
            res.setSuccess(false);
            res.setMessage(e.getMessage());
        }
        return res;
    }

    /**
     * 修改用户信息（用户名，手机号）
     * @param id
     * @return
     */
    @PutMapping("/user/{id}")
    public ResponseJson changeUser(@PathVariable("id") Long id,@RequestParam(value = "username",required = false) String username,
                                    @RequestParam(value = "phone",required = false) String phone){
        ResponseJson res=new ResponseJson();
        res.setSuccess(false);
        res.setMessage("修改用户信息失败");
        if(username!=null){
            res=userService.changeUsername(username,id);
        }
        if(phone!=null){
            res=userService.changePhone(id,phone);
        }
        return res;
    }

    /**
     * 已经注册过的，true
     * @param openid
     * @return
     */
    @GetMapping("/checkRegisted/{openid}")
    public ResponseJson checkRegisted(@PathVariable("openid") String openid){
        ResponseJson res=new ResponseJson();
        User u=null;
        try{
            //查询到多个只取第一个
            u=userRepository.findFirstByOpenid(openid);
        }catch (Exception e){
            //未找到
            System.out.println("错误："+e.getMessage());
            u=null;
        }
        if(u==null){
            res.setSuccess(false);
            res.setMessage("尚未注册");
        }else{
            res.setSuccess(true);
            res.setMessage("已注册");
        }
        return res;
    }

    @PutMapping("/changeAvatar/{userId}")
    public ResponseJson changeAvatar(@RequestParam("avatarUrl") String avatarUrl,@PathVariable("userId") Long id){
        ResponseJson res=new ResponseJson();
        try {
            User a = userRepository.findOne(id);
            a.setAvatarUrl(avatarUrl);
            userRepository.save(a);
            res.setSuccess(true);
            res.setMessage("修改头像成功");
        }catch (Exception e){
            res.setSuccess(false);
            res.setMessage(e.getMessage());
        }
        return res;
    }

    @PostMapping("/judgeUsers")
    public ResponseJson judgeUsers(@RequestParam("users") List<String> users,@RequestParam("values") List<Boolean> values,@RequestParam("posterId") String posterId){
        ResponseJson res=new ResponseJson();
        try{
            Long id=Long.parseLong(posterId);
            res=userService.judgeUser(users,values,id);
        }catch (Exception e){
            res.setSuccess(false);
            res.setMessage(e.getMessage());
        }
        return res;
    }
}
