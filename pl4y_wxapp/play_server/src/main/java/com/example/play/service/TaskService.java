package com.example.play.service;

import com.example.play.dao.TaskRepository;
import com.example.play.dao.UserRepository;
import com.example.play.entities.Message;
import com.example.play.entities.Task;
import com.example.play.entities.User;
import com.example.play.response.ResponseJson;
import com.example.play.response.ResponseTask;
import com.example.play.response.ResponseTasks;
import com.example.play.response.ResponseUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    MessageService messageService;
    static final Integer ACCURACY=5;
    static final Integer LEASTREPUTATION=90;//信誉90以下不能参加活动
    /**
     * 参加一个任务
     * 1。task表中指定行改变peoples属性（set）
     * 2。user表中用户的参加任务tasks改变（set）
     * @param taskId
     * @param userId
     * @return
     */
    @Transactional
    public ResponseTask joinTask(Long taskId, Long userId){
        ResponseTask res=new ResponseTask();
        Task a=taskRepository.findById(taskId);//原始任务
        User u=userRepository.findOne(userId);//用户信息

        Integer reputation=u.getReputation();
        if(reputation<LEASTREPUTATION){
            res.setSuccess(false);
            res.setMessage("您的信誉不足90，请及时充值！");
            res.setTask(a);
            return res;
        }

        String peoples=a.getPeoples();//当前任务的参加用户的id
        String tasks=u.getTasks();//当前用户的参加任务的id


        String []peoplesArr;
        String []tasksArr;
        //判断是否为空
        if(peoples.length()==0||peoples==null){
            peoplesArr=new String[0];
        }else{
            peoplesArr=peoples.split(",");
        }
        if(tasks.length()==0||tasks==null){
            tasksArr=new String[0];
        }else{
            tasksArr=tasks.split(",");
        }
        System.out.println(tasksArr.length);
        //检查是否已经参加
        Boolean hasJoined=false;
        List l=new ArrayList();//参加人员的表
        List l_tasks=new ArrayList();//参加的任务的表
        for (String s : peoplesArr) {
            l.add(s);
            if(s.equals(userId.toString())){
                hasJoined=true;
            }
        }
        for (String s : tasksArr) {
            l_tasks.add(s);
            if(s.equals(taskId.toString())){
                hasJoined=true;
            }
        }
        System.out.println("L length:"+l_tasks.size());
        if(hasJoined){
            res.setSuccess(false);
            res.setMessage("你已经参加了这个活动");
            res.setTask(a);
        }else{
            //插入到参加列表中
            l.add(userId);
            l_tasks.add(taskId);
            String peoples2=StringUtils.arrayToDelimitedString(l.toArray(),",");//参加后的peoples字段值
            String tasks2=StringUtils.arrayToDelimitedString(l_tasks.toArray(),",");//参加后的tasks字段值
            a.setPeoples(peoples2);
            u.setTasks(tasks2);
            taskRepository.save(a);
            userRepository.save(u);
            res.setSuccess(true);
            res.setMessage("参加任务成功");
            res.setTask(a);
            //参加活动通知
            Message mes=new Message();
            mes.setFromid(a.getPosterId());
            String content=u.getUsername()+"参加了您的活动("+a.getTitle()+")";
            String title="有人参加了你的活动";
            String type="系统信息";
            String time= new Date().toString();
            mes.setToId(a.getPosterId());
            mes.setTitle(title);
            mes.setType(type);
            mes.setContent(content);
            mes.setTime(time);
            messageService.postSystemMessage(mes);
        }
        return res;
    }
    @Transactional
    public ResponseJson deleteTask(Long taskId){
        ResponseJson res=new ResponseJson();

        //对参加活动对每一个成员进行删除任务
        Task a=taskRepository.findById(taskId);//原始任务
        taskRepository.delete(taskId);
        String peoples=a.getPeoples();//当前任务的参加用户的id

        String []peoplesArr;
        //判断是否为空
        if(peoples.length()==0||peoples==null){
            peoplesArr=new String[0];
        }else{
            peoplesArr=peoples.split(",");
        }

        //检查是否已经参加
        Boolean hasJoined=false;
        List<String> l=new ArrayList();//参加人员的表
        String uid="",tid="";
        for (String s : peoplesArr) {
            l.add(s);
        }
        Message mes=new Message();

        String title="您有参加的活动被删除";
        String type="系统信息";
        String time= new Date().toString();

        mes.setTitle(title);
        mes.setType(type);
        mes.setFromid(a.getPosterId());
        mes.setTime(time);
        for(String userid:l){
            Long id=Long.parseLong(userid);
            //对每个用户删除该活动记录
            User u=userRepository.findOne(id);//用户信息
            String content="亲爱的"+u.getUsername()+",你参加的活动:"+a.getTitle()+"("+a.getId()+")已被发布者删除！";
            mes.setContent(content);
            mes.setToId(id);
            messageService.postSystemMessage(mes);//向用户发送消息

            String tasks=u.getTasks();//当前用户的参加任务的id
            String []tasksArr;
            if(tasks.length()==0||tasks==null){
                tasksArr=new String[0];
            }else{
                tasksArr=tasks.split(",");
            }
            List l_tasks=new ArrayList();//参加的任务的表
            for (String s : tasksArr) {
                l_tasks.add(s);
                if(s.equals(taskId.toString())){
                    hasJoined=true;
                    tid=s;
                }
            }
            if(hasJoined){
                //删除参加列表中数

                l_tasks.remove(tid);

                String tasks2=StringUtils.arrayToDelimitedString(l_tasks.toArray(),",");//退出后的tasks字段值

                u.setTasks(tasks2);

                userRepository.save(u);

                res.setSuccess(true);
                res.setMessage("删除任务成功");
            }
        }
        return res;
    }
    /**
     * 退出一个任务
     * @param taskId
     * @param userId
     * @return
     */
    @Transactional
    public ResponseUser quitTask(Long taskId,Long userId){
        ResponseUser res=new ResponseUser();
        Task a=taskRepository.findById(taskId);//原始任务
        User u=userRepository.findOne(userId);//用户信息
        String peoples=a.getPeoples();//当前任务的参加用户的id
        String tasks=u.getTasks();//当前用户的参加任务的id

        String []peoplesArr;
        String []tasksArr;
        //判断是否为空
        if(peoples.length()==0||peoples==null){
            peoplesArr=new String[0];
        }else{
            peoplesArr=peoples.split(",");
        }
        if(tasks.length()==0||tasks==null){
            tasksArr=new String[0];
        }else{
            tasksArr=tasks.split(",");
        }
        //检查是否已经参加
        Boolean hasJoined=false;
        List l=new ArrayList();//参加人员的表
        List l_tasks=new ArrayList();//参加的任务的表
        String uid="",tid="";
        for (String s : peoplesArr) {
            l.add(s);
            if(s.equals(userId.toString())){
                hasJoined=true;
                uid=s;
            }
        }
        for (String s : tasksArr) {
            l_tasks.add(s);
            if(s.equals(taskId.toString())){
                hasJoined=true;
                tid=s;
            }
        }
        System.out.println("参加："+hasJoined);
        if(!hasJoined){
            //还没有参加这个活动
            res.setSuccess(false);
            res.setMessage("你没有参加这个活动，退出失败");

            res.setUser(u);
        }else{
            //删除参加列表中数
            l.remove(uid);
            l_tasks.remove(tid);
            String peoples2=StringUtils.arrayToDelimitedString(l.toArray(),",");//删除后的peoples字段值
            String tasks2=StringUtils.arrayToDelimitedString(l_tasks.toArray(),",");//退出后的tasks字段值
            a.setPeoples(peoples2);
            u.setTasks(tasks2);
            taskRepository.save(a);
            userRepository.save(u);
            res.setSuccess(true);
            res.setMessage("退出任务成功");

            res.setUser(u);

            //退出任务通知发布者
            Message mes=new Message();
            mes.setFromid(a.getPosterId());
            String content=u.getUsername()+"退出了您的活动("+a.getTitle()+")";
            String title="有人退出了你的活动";
            String type="系统信息";
            String time= new Date().toString();
            mes.setToId(a.getPosterId());
            mes.setTitle(title);
            mes.setType(type);
            mes.setContent(content);
            mes.setTime(time);
            mes.setFromid(u.getId());
            messageService.postSystemMessage(mes);
        }
        return res;
    }

    /**
     * 获取附近任务
     * // 活动管理
     // 获取附近的任务
     // 精确度（5km）
     */
    @Transactional
    public ResponseTasks getRecentTask(String longitude,String latitude){
        ResponseTasks res=new ResponseTasks();
        double cur_longitude=Double.parseDouble(longitude);
        double cur_latitude=Double.parseDouble(latitude);
        double _x=ACCURACY/111.0;
        double _y=ACCURACY/111.0*Math.abs(Math.cos(cur_latitude));
        String min_lati=String.format("%.6f",cur_latitude-_x);
        String max_lati=String.format("%.6f",cur_latitude+_x);
        String min_longi=String.format("%.6f",cur_longitude-_y);
        String max_longi=String.format("%.6f",cur_longitude+_y);
        //似乎写反了
        System.out.println("minlati:"+min_lati+"maxlati:"+max_lati+"minlongi:"+min_longi+"maxlongi:"+max_longi);
        List<Task> tasks=taskRepository.findRecentTasks(min_lati,max_lati,min_longi,max_longi);
        res.setSize(tasks.size());
        res.setTasks(tasks);
        return res;
    }
}
