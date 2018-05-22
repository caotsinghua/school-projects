package com.example.play.service;

public class WxError {
    private String errcode;
    private String errmsg;
    public WxError(){}
    public WxError(String errcode, String errmsg) {
        this.errcode = errcode;
        this.errmsg = errmsg;
    }

    public String getErrcode() {
        return errcode;
    }

    public void setErrcode(String errcode) {
        this.errcode = errcode;
    }

    public String getErrmsg() {
        return errmsg;
    }

    public void setErrmsg(String errmsg) {
        this.errmsg = errmsg;
    }

    public Boolean isError(){
        //如果是错误返回，就是true
        return this.errcode!=null;
    }
}
