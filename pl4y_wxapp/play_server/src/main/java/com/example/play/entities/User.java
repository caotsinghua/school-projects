package com.example.play.entities;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;
    private String username;
    private String phone;
//    添加头像
    private String avatarUrl;
    private Integer reputation=100;//声誉
    private String tasks="";//任务id列表，以逗号隔开
    private String openid;//用户唯一标示，wx返回
    public User(){}
    public User(String username,String phone,String openid){
        this.username=username;
        this.phone=phone;
        this.openid=openid;
        this.reputation=100;
        this.tasks="";
    }
    public User(String username, String phone, Integer reputation, String tasks, String openid) {
        this.username = username;
        this.phone= phone;
        this.reputation = reputation;
        this.tasks = tasks;
        this.openid = openid;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getOpenid() {
        return openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Integer getReputation() {
        return reputation;
    }

    public void setReputation(Integer reputation) {
        this.reputation = reputation;
    }

    public String getTasks() {
        return tasks;
    }

    public void setTasks(String tasks) {
        this.tasks = tasks;
    }



}
