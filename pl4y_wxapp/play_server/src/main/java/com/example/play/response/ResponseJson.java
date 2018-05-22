package com.example.play.response;



public class ResponseJson {
    private Boolean success;
    private String message;
    public ResponseJson(){
        this.success=true;
        this.message="成功";
    }
    public ResponseJson(Boolean success) {
        this.success = success;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
