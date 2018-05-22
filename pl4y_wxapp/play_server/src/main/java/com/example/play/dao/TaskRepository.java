package com.example.play.dao;

import com.example.play.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {
    Task findById(Long id);
    List<Task> findByPosterId(Long id);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update Task set passed=true where id =?1")
    int finishTask(Long id);//完成指定任务
    @Modifying(clearAutomatically = true)
    @Query(value = "select * from task where latitude between ?3 and ?4 and longitude between ?1 and ?2 ",nativeQuery = true)
    List<Task> findRecentTasks(String min_longitude,String max_longitude,String min_latitude,String max_latitude);
}
