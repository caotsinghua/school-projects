package com.example.play.service;

import com.example.play.dao.UserRepository;
import com.example.play.entities.Message;
import com.example.play.entities.User;
import com.example.play.response.RequestUsersMap;
import com.example.play.response.ResponseJson;
import com.example.play.response.ResponseUser;
import com.sun.org.apache.xpath.internal.operations.Bool;
import jdk.nashorn.internal.runtime.ECMAException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;

@Service
@Transactional
public class UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    MessageService messageService;

    /**
     * 将一个微信用户注册到服务
     * username,password,openid
     * @param u
     * @return
     */
    public ResponseUser addOneUser(User u){
        ResponseUser res=new ResponseUser();
        String logged_openid=u.getOpenid();
        //已经注册了
        res.setSuccess(false);
        res.setMessage("该微信用户已注册");
        res.setUser(null);
        if(!hasRegisted(logged_openid)){
            // 没有注册的用户
            try{
                userRepository.save(u);
                res.setSuccess(true);
                res.setMessage("注册成功");

                res.setUser(u);
            }catch (Exception e){
                res.setSuccess(true);
                res.setMessage(e.getMessage());
                res.setUser(null);
            }
        }

        return res;
    }

    /**
     * 检查微信用户是否已经注册过
     * @param openid
     * @return
     */
    public Boolean hasRegisted(String openid){
        User u1=null;
        try{
            // 根据用户的openid在user表中查询，找到了即为已注册
            u1=userRepository.findFirstByOpenid(openid);
        }catch (Exception e){
            u1=null;
        }
        return u1!=null;
    }
    //检查用户名是否可用
    //被使用返回false。否做true
    public Boolean checkUsername(String username){
        Boolean hasBeenUsed=false;
        User u=null;
        try{
            u=userRepository.findUserByUsername(username);
        }catch (Exception e){
            u=null;
        }
        if(u==null){
            hasBeenUsed=true;
        }
        return hasBeenUsed;
    }
    /**
     * 修改用户名
     * @param username
     * @param id
     * @return
     */
    public ResponseJson changeUsername(String username,Long id){
        ResponseJson res=new ResponseJson();
        //  先看oldusername用户是否存在，再查新username是否可用，再修改
        User u=null;
        try{
            u=userRepository.findOne(id);
        }catch (Exception e){
            u=null;
            res.setSuccess(false);
            res.setMessage("id:"+id+"的用户不存在");
            return res;
        }
        //用户存在，修改名字
        if(checkUsername(username)){
            u.setUsername(username);
            userRepository.save(u);
            res.setSuccess(true);
            res.setMessage("修改用户名成功");
        }else{
            res.setSuccess(false);
            res.setMessage("该用户名已被使用");
        }
        return res;
    }

    /**
     * 修改用户密码
     * @param id
     * @param phone
     * @return
     */
    public ResponseJson changePhone(Long id,String phone){
        ResponseJson res=new ResponseJson();
        User u=null;
        try{
            u=userRepository.findOne(id);
        }catch (Exception e){
            u=null;
        }
        if(u!=null){
            u.setPhone(phone);
            try{
                userRepository.save(u);
                res.setSuccess(true);
                res.setMessage("修改电话成功");
            }catch (Exception e){
                res.setSuccess(false);
                res.setMessage(e.getMessage());
            }
        }else{
            res.setSuccess(false);
            res.setMessage("id:"+id+"的用户不存在");
        }
        return res;
    }

    /**
     * 任务结束后评价成员参与情况
     * @param users
     * @return
     */
    public ResponseJson judgeUser(List<String> users,List<Boolean> values,Long posterId){
        ResponseJson res=new ResponseJson();
        Message mes=new Message();//发送的消息
        mes.setFromid(posterId);
        if(users.size()!=values.size()) {
            res.setSuccess(false);
            res.setMessage("键值长度不一致");
            return res;
        }
        int length=users.size();
        for(int i=0;i<length;i++){
            Long id=Long.parseLong(users.get(i));
            Boolean value=values.get(i);
            User u=userRepository.findOne(id);
            Integer r;
            if(!value){
                //如果没有到，信誉-1
                r=u.getReputation()-1;
                /**
                 * 发送系统消息
                 */
                String content="由于你缺席了一个活动，信誉-1";
                String title="系统消息";
                String type="系统信息";
                String time= new Date().toString();
                mes.setTitle(title);
                mes.setType(type);
                mes.setContent(content);
                mes.setTime(time);
                mes.setToId(u.getId());
                messageService.postSystemMessage(mes);
            }else{
                r=u.getReputation()+1;
                //发送消息
                String content="你出色的参加了一项活动，信誉+1";
                String title="系统消息";
                String type="系统信息";
                String time= new Date().toString();
                mes.setToId(u.getId());
                mes.setTitle(title);
                mes.setType(type);
                mes.setContent(content);
                mes.setTime(time);
                messageService.postSystemMessage(mes);
            }
            int a=userRepository.judgeUser(id,r);

//            System.out.println("repu:"+r+"res:"+a);
        }
        res.setSuccess(true);
        res.setMessage("修改信誉成功");
        return res;
    }

}
