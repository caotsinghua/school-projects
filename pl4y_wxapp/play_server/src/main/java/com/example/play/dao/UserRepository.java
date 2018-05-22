package com.example.play.dao;

import com.example.play.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    //根据openid获取用户
    public User findFirstByOpenid(String openid);
    //根据用户名获取
    public User findUserByUsername(String username);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update User set reputation=?2 where id=?1")
    public Integer judgeUser(Long id,Integer reputation);
}
