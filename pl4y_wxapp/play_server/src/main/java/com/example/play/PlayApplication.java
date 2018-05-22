package com.example.play;

import com.example.play.service.WxMappingJackson2HttpMessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class PlayApplication {
	@Bean
	public RestTemplate restTemplate(){
		RestTemplate r=new RestTemplate();
		r.getMessageConverters().add(new WxMappingJackson2HttpMessageConverter());
		return r;
	}
	public static void main(String[] args) {
		SpringApplication.run(PlayApplication.class, args);
	}
}
