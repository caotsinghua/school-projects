package com.example.play.response;

import com.example.play.entities.Task;

import java.util.List;

public class ResponseTasks extends ResponseJson{
    private List<Task> tasks;
    private Integer size;
    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }
}
