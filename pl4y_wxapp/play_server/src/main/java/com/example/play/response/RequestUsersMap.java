package com.example.play.response;

import java.util.List;

//用来接受用户的到达情况
public class RequestUsersMap {
    private List<String> keys;
    private List<Boolean> values;
    private Integer size;

    public List<String> getKeys() {
        return keys;
    }

    public void setKeys(List<String> keys) {
        this.keys = keys;
    }

    public List<Boolean> getValues() {
        return values;
    }

    public void setValues(List<Boolean> values) {
        this.values = values;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }
}
