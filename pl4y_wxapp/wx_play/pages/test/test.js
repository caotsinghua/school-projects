import apis from '../../config/apis.js';
// pages/test/test.js

Page({
  onLoad: function (options) {
    /**
     * 根据id获取任务详情
     */
    // apis.getMarkerInfoById(2).then(res=>{
    //   console.log(res);
    // }).catch(e=>{
    //   wx.showModal({
    //     title: '出错',
    //     content: e.errMsg,
    //   })
    // })
    /**
     * 获取发布者的任务
     */
    // apis.getTasksByPosterId(1231).then(res=>{
    //   console.log(res);
    // }).catch(e=>{
    //   console.log(e)
    // })
    // 发布一个任务
    // apis.postOneTask({
    //   title:'wxtitle', 
    //   taskDesc:'taskdescccc',
    //   peopleLimit:12, 
    //   address:'南信大',
    //   startTime:'8:20', 
    //   endTime:'8:30',
    //   startDate:'1992-1-1',
    //   endDate:'1998-2-2',
    //   longitude:'12.333',
    //   latitude:'22.333',
    //   posterId:12345
    // }).then(res=>{
    //   console.log(res)
    // }).catch(e=>{
    //   console.log(res)
    // })
    // // 删除一个任务
    // apis.deleteOneTask('19').then(res=>{
    //   console.log(res)
    // }).catch(e=>{
    //   console.log(e.message)
    // })
    //更新一个任务
    // apis.updateOneTask(1, {
    //   title:'wxtitle', 
    //   taskDesc:'taskdescccc',
    //   peopleLimit:12, 
    //   address:'南信大',
    //   startTime:'8:20', 
    //   endTime:'8:30',
    //   startDate:'1992-1-1',
    //   endDate:'1995-2-2',
    //   longitude:'12.333',
    //   latitude:'22.333',
    //   posterId:12345
    // }).then(res=>{
    //   console.log(res);
    // }).catch(e=>{
    //   console.log(e)
    // })
    // finish one task
    // apis.finishOneTask(1).then(res=>{
    //   console.log(res);
    // }).catch(e=>{
    //   console.log(e)
    // })
    // 参加一个任务
    // apis.joinOneTask(25,124).then(res=>{
    //   console.log(res);
    // }).catch(e=>{
    //   console.log(e);
    // })
    // 退出一个任务
    // apis.quitOneTask(25,124).then(res=>{
    //   console.log(res);
    // }).catch(e=>{
    //   console.log(e)
    // })
    // 获取附近任务
    // apis.getRecentTasks(19.33,22.33).then(res=>{
    //   console.log(res)
    // }).catch(e=>{
    //   console.log(e)
    // })

    // apis.checkLogin().then(res=>{
    //   console.log(res)
    // }).catch(e=>{
    //   console.error(e)
    // })
    // apis.login().then(res => {
    //   console.log(res)
    // }).catch(e => {
    //   console.error(e)
    // })
    // apis.register('username','ppp','123').then(res=>{
    //   console.log(res)
    // }).catch(e=>{
    //   console.error(e)
    // })
    
    
    const usermap={
      keys:['111','222','333'],
      values:[true,false,false]
    }
    // const users=new Map();
    // users.set("123",true)
    // users.set("133", true)
    // users.set("143", false)
    // console.log(users)
    wx.request({
      url: 'https://localhost:8082/api/judgeUsers',
      data:{
        users:["127",129],
        values:[true,false]
      },
      method:'post',
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },
      success:function(res){
        console.log(res);
      },
      fail:function(res){
        console.error(res)
      }
    })
  },

  
})