package com.example.play.controllers;

import com.example.play.dao.TaskRepository;
import com.example.play.dao.UserRepository;
import com.example.play.entities.Message;
import com.example.play.entities.Task;
import com.example.play.entities.User;
import com.example.play.response.ResponseJson;
import com.example.play.response.ResponseTask;
import com.example.play.response.ResponseTasks;
import com.example.play.response.ResponseUser;
import com.example.play.service.MessageService;
import com.example.play.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

/**
 * 任务管理；
 * 1。获取所有任务 -
 * 2。获取指定用户发布的全部任务 -
 * 3。获取所有未完成且未删除的任务
 * 4。添加一个任务 -
 * 5。删除一个任务byId -
 * 6。修改一个任务byId -
 * 7。获取附近任务（all）
 * 8。完成一个任务（taskid）-
 * 9。参加一个任务（userid，taskid）-
 * 10.退出一个任务(userid,taskid) -
 */
@RestController
public class TaskController {
    @Autowired
    TaskRepository taskRepository;
    @Autowired
    TaskService taskService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    MessageService messageService;
    @GetMapping("/recentTasks")
    public ResponseTasks getRecentTasks(@RequestParam("longitude") String longitude,@RequestParam("latitude") String latitude){
        ResponseTasks res=new ResponseTasks();
        try{
            res=taskService.getRecentTask(longitude,latitude);
            res.setSuccess(true);
            res.setMessage("获取最近任务成功");
        }catch(Exception e){
            res.setSize(0);
            res.setSuccess(false);
            res.setMessage(e.getMessage());
        }

        return res;
    }



    /**
     * 根据任务id查询任务（包括已删除的，已完成或过期的）
     * @param id
     * @return
     */

    @GetMapping("/task/{id}")
    public ResponseTask getTaskById(@PathVariable("id") Long id){

        ResponseTask res=new ResponseTask();
        try{
            Task one=taskRepository.findById(id);
            if(one!=null){
                res.setMessage("查询成功");
                res.setSuccess(true);
                res.setTask(one);
            }else{
                res.setMessage("没有这个任务");
                res.setSuccess(false);
                res.setTask(one);
            }
        }catch (Exception e){
            res.setMessage(e.getMessage());
            res.setSuccess(false);
            res.setTask(null);
        }


        return res;
    }

    /**
     * ex:https://www.host.com/tasks?posterId=123
     * 获取指定用户发布的全部任务
     * @param posterId
     * @return
     */
    @GetMapping("/tasks")
    public ResponseTasks getTasksByPosterId(@RequestParam("posterId") Long posterId){
        ResponseTasks res=new ResponseTasks();
        List<Task> tasks;
        try{
            tasks=taskRepository.findByPosterId(posterId);
            if(tasks.size()==0){
                res.setSuccess(true);
                res.setMessage("没有发布任务或没有这个用户");
                res.setTasks(tasks);
            }else{
                res.setSuccess(true);
                res.setMessage("获取任务列表成功");
                res.setTasks(tasks);
            }
        }catch(Exception e){
            res.setMessage(e.getMessage());
            res.setSuccess(false);
        }
        return res;
    }

    /**
     *               String       type
     *       private String title;//任务标题
             private String taskDesc;//任务描述
             private Integer peopleLimit;//人数限制
             private String address;//地点名称
             private String startTime;//开始时间
             private String endTime;//结束时间
             private String startDate;//开始日期，
             private String endDate;//结束日期
             private String longitude;//地点的纬度
             private String latitude;//地点的经度
             private String peoples;//参加的用户，id以逗号隔开
             private String posterId;//发布的用户的id
     添加一个任务
     * @param addTask
     * @return
     */
    @PostMapping("/task")
    public ResponseJson addOneTask(Task addTask){
        ResponseJson res=new ResponseJson();
        try{
            taskRepository.save(addTask);
            res.setSuccess(true);
            res.setMessage("添加任务成功");
        }catch (Exception e){
            res.setSuccess(false);
            res.setMessage(e.getMessage());
        }
        return res;
    }

    /**
     * 删除指定任务(从数据库删除)
     * @param id
     * @return
     */
    @DeleteMapping("/task/{id}")
    public ResponseJson deleteTaskOfDB(@PathVariable("id") Long id){
        ResponseJson res=new ResponseJson();
        try{
            res=taskService.deleteTask(id);
        }catch (Exception e){
            res.setSuccess(false);
            res.setMessage(e.getMessage());
        }
        return res;
    }

    /**
     * 修改任务详情（不能更改状态）
     * @param taskId
     * @param updatedTask
     * @return
     */
    @PutMapping("/task/{id}")
    public  ResponseTask updateTaskById(@PathVariable("id") Long taskId,Task updatedTask){
        ResponseTask res=new ResponseTask();
        try{
            updatedTask.setId(taskId);
            taskRepository.save(updatedTask);
            res.setSuccess(true);
            res.setMessage("修改任务成功");
            res.setTask(updatedTask);
            String peoples=updatedTask.getPeoples();//当前任务的参加用户的id
            String []peoplesArr;
            if(peoples.length()==0||peoples==null){
                peoplesArr=new String[0];
            }else{
                peoplesArr=peoples.split(",");
            }
            for (String s : peoplesArr) {
                Long uid=Long.parseLong(s);
                User u=userRepository.findOne(uid);
                Message mes=new Message();
                String content=u.getUsername()+",您参加的活动："+updatedTask.getTitle()+" 更新了信息";
                String title="有活动更新";
                String type="系统信息";
                String time= new Date().toString();
                mes.setToId(uid);
                mes.setTitle(title);
                mes.setFromid(updatedTask.getPosterId());
                mes.setType(type);
                mes.setContent(content);
                mes.setTime(time);
                messageService.postSystemMessage(mes);
            }
        }catch (Exception e){
            res.setSuccess(false);
            res.setMessage(e.getMessage());
        }
        return res;
    }

    /**
     * 完成指定任务
     * @param id
     * @return
     */
    @PutMapping("/finishTask/{id}")
    public ResponseJson finishTaskById(@PathVariable("id")  Long id){
        ResponseJson res=new ResponseJson();
        try{
            int p=taskRepository.finishTask(id);
            if(p==1){
                res.setSuccess(true);
                res.setMessage("完成任务");
            }else{
                res.setSuccess(false);
                res.setMessage("完成任务失败");
            }
        }catch (Exception e){
            res.setSuccess(false);
            res.setMessage(e.getMessage());
        }
        return res;
    }

    /**
     * 参加任务(修改两张表)
     * @param taskId
     * @param userId
     * @return
     */
    @PutMapping("/joinTask/{taskId}")
    public ResponseTask joinTask(@PathVariable("taskId") Long taskId,@RequestParam("userId") Long userId){
        ResponseTask res= new ResponseTask();
        try{
            res=taskService.joinTask(taskId,userId);
        }catch (Exception e){
            res.setTask(null);
            res.setSuccess(false);
            res.setMessage(e.getMessage());
        }
        return res;
    }

    /**
     * 用户退出一个任务()
     * @param taskId
     * @param userId
     * @return
     */
    @PutMapping("/quitTask/{taskId}")
    public ResponseUser quitTask(@PathVariable("taskId") Long taskId,@RequestParam("userId") Long userId){
        ResponseUser res= new ResponseUser();
        try{
            res=taskService.quitTask(taskId,userId);
        }catch (Exception e){
            res.setUser(null);
            res.setSuccess(false);
            res.setMessage(e.getMessage());
        }
        return res;
    }
}
