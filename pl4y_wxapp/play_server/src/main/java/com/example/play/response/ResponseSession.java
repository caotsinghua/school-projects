package com.example.play.response;

import com.example.play.entities.Tsession;

public class ResponseSession extends ResponseJson{
    private Tsession mysession;
    private String openid;

    public String getOpenid() {
        return openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid;
    }

    public Tsession getMysession() {
        return mysession;
    }

    public void setMysession(Tsession mysession) {
        this.mysession = mysession;
    }
}
