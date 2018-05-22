package com.example.play.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Tsession {
    @Id
    private String id;
    private String value;
    public Tsession(){}
    public Tsession(String id, String value) {
        this.id = id;
        this.value = value;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
