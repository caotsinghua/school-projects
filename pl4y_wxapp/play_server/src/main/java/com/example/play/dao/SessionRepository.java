package com.example.play.dao;

import com.example.play.entities.Tsession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface SessionRepository extends JpaRepository<Tsession,String>{

}
