package com.example.play.service;

import com.example.play.dao.SessionRepository;
import com.example.play.entities.Tsession;
import com.example.play.response.ResponseJson;
import com.example.play.response.ResponseSession;
import com.example.play.response.ResponseTask;
import com.sun.org.apache.xpath.internal.operations.Bool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
@Transactional
public class WxLoginService {
    @Value("${wxInfo.appSecret}")
    private String appSecret;
    @Value("${wxInfo.appId}")
    private String appId;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private UserService userService;
    /**
     * 获取微信session
     * @param code
     * @return
     * @throws Exception
     */
    public ResponseSession getWxLoginInfo(String code) throws Exception{
        String url="https://api.weixin.qq.com/sns/jscode2session?appid=" + appId +
                "&secret=" +appSecret+
                "&js_code="+code +
                "&grant_type=authorization_code";
        ResponseSession res=new ResponseSession();
        WxLoginInfo sessionInfo=restTemplate.getForObject(url,WxLoginInfo.class);
//        System.out.println(sessionInfo.getOpenid()+" "+sessionInfo.getSession_key());
//        System.out.println("err?"+sessionInfo.isError());
        if(sessionInfo.isError()){
            res.setSuccess(false);
            res.setMessage(sessionInfo.getErrmsg());
            res.setMysession(null);
        }else{
            //成功获取sessionkey
            String sessionKey= UUID.randomUUID().toString();
            String sessionValue=sessionInfo.getSession_key()+sessionInfo.getOpenid();

            Tsession theSession=new Tsession(sessionKey,sessionValue);
            if(userService.hasRegisted(sessionInfo.getOpenid())){
                sessionRepository.save(theSession);
                res.setMysession(theSession);
                res.setSuccess(true);
                res.setMessage("登录成功");
            }else {
                res.setSuccess(false);
                res.setMessage("未注册");
                res.setOpenid(sessionInfo.getOpenid());
            }
        }
        return res;
    }
    /**
     * 校验登录状态
     */
    public Boolean checkLogin(String sessionId,String sessionValue) {
        Boolean logged=false;
        Tsession theSession=new Tsession();
        try{
            theSession=sessionRepository.findOne(sessionId);
        }catch (Exception e){
            logged=false;
        }

        if(theSession.getValue().equals(sessionValue)){
            logged=true;
        }
        return logged;

    }
}
