package com.example.play;

import com.example.play.service.TaskService;
import com.example.play.service.WxLoginService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.UUID;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PlayApplicationTests {

	@Autowired
	TaskService taskService;
	@Autowired
	WxLoginService wxService;
	@Test
	public void contextLoads() {
	}
	@Test
	public void testTaskService(){
		String longitude="12.33";
		String latitude="22.33";
		taskService.getRecentTask(longitude,latitude);
	}
	@Test
	public void testWx(){
		System.out.println(UUID.randomUUID().toString());
	}
}
