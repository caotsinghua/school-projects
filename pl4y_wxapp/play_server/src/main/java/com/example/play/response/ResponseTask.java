package com.example.play.response;

import com.example.play.entities.Task;

public class ResponseTask extends ResponseJson {
    private Task task;
    public  ResponseTask(){}

    public ResponseTask(Boolean success, Task task) {
        super(success);
        this.task = task;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }
}
