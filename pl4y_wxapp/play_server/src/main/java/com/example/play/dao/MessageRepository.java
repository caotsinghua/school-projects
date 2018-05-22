package com.example.play.dao;

import com.example.play.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Long>{

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update Message  set hasRead = true where id =?1")//将信息设为已读
    Integer readMessage(Long id);
    /**
     * 获取没有读取过的信息
     */
    @Query("select  m from Message m where m.toId=?1 and m.hasRead =false")
    List<Message> getUserMessages(Long toId);

}
