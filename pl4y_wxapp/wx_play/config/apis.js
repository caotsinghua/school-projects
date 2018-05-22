const getInfoFromLocalStorage = require('../utils/util.js').getInfoFromLocalStorage;
const saveInfoIntoLocalStorage= require('../utils/util.js').saveInfoIntoLocalStorage;
const nodeLocalhostBase ='http://localhost:8088';
const javaLocalhostBase='https://localhost:8082/api';
let wxApiUrl = 'https://wx.tssword.xin/api';
//  wxApiUrl = javaLocalhostBase;
/**
 * 注册成功后不提示（不需要密码）1
 * 参加活动显示的参加者不对 1
 * 未登录时信息列表一直刷新 1
 */
const apis={
  //判断是否登录状态
  // 1.读取本地数据 
  // 2.判断登录态
  // 3.本地没有数据，未登录
  checkLogin:function(){
    // let url="http://localhost:8088/check";
    let url=`${wxApiUrl}/checkLogin`
    let localData=getInfoFromLocalStorage("sessionInfo");
    
    return new Promise((resolve,reject)=>{
      if(localData.success) {
        //有sessionid
        // 检查session是否过期
        wx.checkSession({
          success:function(){
            let openid = localData.value.sessionValue.split("==")[1];

            wx.request({
              url: url,
              data: {
                sessionId: localData.value.sessionId,
                sessionValue: localData.value.sessionValue,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'post',
              dataType: 'json',
              success: function (res) {
                resolve({ openid, ...res.data })
              },
              fail: function (res) {
                reject(res.data)
              }
            })
          },
          fail:function(){
            reject({
              success:false,
              errMsg:'session已过期，请重新登录',
              code:400
            })
          }
        })
        
      }else{
        resolve({
          success:false,
          message:'未登录'
        })
      }
    })
  },
  //  登录 
  login:function(){
   return new Promise((resolve,reject)=>{

     wx.login({
       success: res => {
         // 发送 res.code 到后台换取 openId, sessionKey, unionId
         wx.request({
           url: `${wxApiUrl}/login`,
           header: {
             'content-type': 'application/x-www-form-urlencoded'
           },
           data: {
             code: res.code
           },
           method: 'POST',
           dataType: 'json',
           success: function (res) {
              
             if (res.data.success) {
               console.log(res)
               wx.hideLoading();
                let {id,value}=res.data.mysession;
                saveInfoIntoLocalStorage('sessionInfo',{
                  sessionId:id,
                  sessionValue:value
                })
                resolve({
                  success:true,
                  message:'登录成功'
                })
             } else {
               resolve(res.data);
             }
           },
           fail: function (res) {
             reject(res)
           }
         })
       }
     })
   })
  },
  logout:function(){
    return wx.removeStorageSync('sessionInfo');
  },
  //根据id获取标记点信息(任务信息)
  getMarkerInfoById:function(id){
    // let url="https://wx.tssword.xin/apis/marker/"+id;
    // if(!id) return;//id为空不操作
    let url=`${wxApiUrl}/task/${id}`;
    return new Promise((resolve,reject)=>{
      wx.request({
        url: url,
        method: 'GET',
        dataType: 'json',
        success:function(res){
          if(res.data.success){
            resolve(res.data);
          }else{
            //没有获取到任务信息
            reject({
              errMsg:res.data.message
            });
          }
        },
        fail:function(res){
          wx.showModal({
            title: '网络错误',
            content: res.errMsg,
          })
        }
      })
    })
  },
  // 根据发布者的id获取他发布的任务列表
  getTasksByPosterId:function(posterId){
    let url=`${wxApiUrl}/tasks?posterId=${posterId}`;
    return new Promise((resolve,reject)=>{
      wx.request({
        url: url,
        method:'GET',
        dataType: 'json',
        success: function (res) {
          if (res.data.success) {
            resolve(res.data)
          }else{
            reject({
              errMsg:res.data.message
            })
          }
        },
        fail: function (res) {
          wx.showModal({
            title: '网络错误',
            content: res.errMsg,
          })
        }
      })
    })
  },
  // 发布一个任务
  /**
     *  String title;//任务标题
       String taskDesc;//任务描述
       Integer peopleLimit;//人数限制
       String address;//地点名称
       String startTime;//开始时间
       String endTime;//结束时间
       String startDate;//开始日期，
       String endDate;//结束日期
       String longitude;//地点的纬度
       String latitude;//地点的经度
       
       String posterId;//发布的用户的id
     */
  postOneTask:function({
    title,type,taskDesc,peopleLimit,address,startTime,endTime,
    startDate,endDate,longitude,latitude,posterId,address2
  }){
    const url=`${wxApiUrl}/task`;
    // post
    return new Promise((resolve,reject)=>{
      wx.request({
        url: url,
        header:{
          'content-type':'application/x-www-form-urlencoded'
        },
        data: {
          title, taskDesc, peopleLimit, address, startTime, endTime,
          startDate, endDate, longitude, latitude, posterId,type,address2
        },
        method: 'post',
        dataType: 'json',
        success: function (res) {
          if(res.data.success){
            //发布任务成功
            resolve(res.data)
          }else{
            //数据库保存错误
            reject(res.data)
          }
        },
        fail: function (res) {
          wx.showModal({
            title: '网络错误',
            content: res.errMsg,
          })
        }
      })
    })
  },
  //删除一个任务
  deleteOneTask:function(id){
    const url=`${wxApiUrl}/task/${id}`;
    // 使用delete
    return new Promise((resolve,reject)=>{
      wx.request({
        url: url,
        header: {
          'content-type': 'x-www-form-urlencoded'
        },
        method: 'delete',
        dataType: 'json',
        success: function (res) {
          if (res.data.success) {
            resolve(res.data);
          } else {
            reject(res.data)
          }
        },
        fail: function (res) {
          wx.showModal({
            title: '网络错误',
            content: res.errMsg,
          })
        }
      })
    })
  },
  //更新一个任务
  updateOneTask: function (id, {
    title, taskDesc, peopleLimit, address, startTime, endTime,
    startDate, endDate, longitude, latitude, posterId,type,passed,peoples
  }){
    const url=`${wxApiUrl}/task/${id}`;
    return new Promise((resolve,reject)=>{
      wx.request({
        url: url,
        data: {
          id,
          title, taskDesc, peopleLimit, address, startTime, endTime,
          startDate, endDate, longitude, latitude, posterId,type,passed,peoples
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'put',
        dataType: 'json',
        success: function (res) {
          if(res.data.success){
            resolve(res.data)
          }else{
            reject(res.data);
          }
        },
        fail: function (res) {
          wx.showModal({
            title: '网络错误',
            content: res.errMsg,
          })
        }
      })
    })
  },
  // 完成指定任务
  finishOneTask(id){
    const url=`${wxApiUrl}/finishTask/${id}`;
    return new Promise((resolve,reject)=>{
      wx.request({
        url: url,
        method: 'put',
        dataType: 'json',
        success: function (res) {
          if (res.data.success) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        },
        fail: function (res) {
          wx.showModal({
            title: '网络错误',
            content: res.errMsg,
          })
        }
      })
    })
  },
  // 参加一个任务
  joinOneTask:function(taskId,userId){
    // wx.showModal({
    //   title: '参加活动api',
    //   content: 'userid'+userId,
    // })
    const url=`${wxApiUrl}/joinTask/${taskId}`;
    return new Promise((resolve,reject)=>{
      wx.request({
        url: url,
        data: {
          userId:userId
        },
        header: {
          'content-type':'application/x-www-form-urlencoded'
        },
        method:'put',
        dataType: 'json',
        success: function(res) {
          if(res.data.success){
            resolve(res.data);
          }else{
            reject(res.data);
          }
        },
        fail: function(res) {
          wx.showModal({
            title: '网络错误',
            content: res.errMsg,
          })
        }
      })
    })
  },
  // 退出一个任务
  quitOneTask:function(taskId,userId){
    const url = `${wxApiUrl}/quitTask/${taskId}`;
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: {
          userId: userId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'put',
        dataType: 'json',
        success: function (res) {
          if (res.data.success) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        },
        fail: function (res) {
          wx.showModal({
            title: '网络错误',
            content: res.errMsg,
          })
        }
      })
    })
  },
  // 获取附近5km任务
  // longi:纬度，lati：经度
  getRecentTasks:function(longitude,latitude){
    const url=`${wxApiUrl}/recentTasks`;
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: {
          longitude,latitude
        },
        method: 'get',
        dataType: 'json',
        success: function (res) {
          if (res.data.success) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        },
        fail: function (res) {
          wx.showModal({
            title: '网络错误',
            content: res.errMsg,
          })
        }
      })
    })
  },
  /**
   * 微信注册
   */
  register(username,phone,openid){
    //openid在登录操作后获取
    const url=`${wxApiUrl}/register`
    return new Promise((resolve,reject)=>{
      wx.request({
        url: url,
        data: {
          username,phone,openid
        },
        header: {
          'content-type':'application/x-www-form-urlencoded'
        },
        method:'post',
        dataType:'json',
        success: function(res) {
          resolve(res.data)
        },
        fail: function(res) {
          reject(res)
        }
      })
    })
  },
  /**
   * //检查是否已经注册
    //已经注册直接登录，未注册跳转注册页面
   */
  checkRegisted(openid){
    
    const url=`${wxApiUrl}/checkRegisted/${openid}`;
    return new Promise((resolve,reject)=>{
      wx.request({
        url: url,
        method: 'get',
        success: function (res) {
          resolve(res.data);
        },
        fail: function (res) {
          wx.showModal({
            title: '网络错误',
            content: res.errMsg,
          })
          reject(res);
        }
      })
    })
  },
  // 根据openid获取用户信息
  getUserInfoByOpenid(openid){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: `${wxApiUrl}/user/${openid}`,
        success: function(res) {
          resolve(res.data);
        },
        fail: function(res) {
          reject(res);
        }
      })
    })
  },
  getUserInfoById(id){
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${wxApiUrl}/userbyid/${id}`,
        success: function (res) {
          resolve(res.data);
        },
        fail: function (res) {
          reject(res);
        }
      })
    })
  },
  //userid,avatarurl
  setAvatar(id,url){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: `${wxApiUrl}/changeAvatar/${id}`,
        data: {
          avatarUrl: url
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'put',
        dataType: 'json',
        success: function (res) {
          resolve(res.data)
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
  },
  getTasksByOpenid(openid){
    return new Promise((resolve,reject)=>{
      apis.getUserInfoByOpenid(openid).then(res=>{
        let tasksStr=res.user.tasks.trim();
        let taskids=tasksStr.split(',');
        
        //删除所有空元素
        if(taskids[0]=="") taskids.pop();
        // console.log(taskids)
        let tasks=[];
        
        if(taskids.length==0){
          resolve(tasks)
        }else{
          
          taskids.forEach((id,index)=>{
            apis.getMarkerInfoById(id).then(res => {
              let task = res.task;
              
              apis.getUserInfoById(task.posterId).then(res => {
                if(res.success){
                  task.avatarUrl = res.user.avatarUrl;
                  tasks.push(task);
                }
                
                if (index == taskids.length - 1) {
                  resolve(tasks)
                }
              })
            }).catch(e => {
              console.log(e)
            })
          })
          
          
        }

      }).catch(e => {
        console.log(e);
      })
    })
  },
  //评分用户信誉
  judgeUsers(users,values,posterId){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: `${wxApiUrl}/judgeUsers`,
        data: {
          users,values,posterId
        },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if(res.data.success) resolve(res.data)
          reject(res.data)
        },
        fail: function (res) {
          console.error(res)
        }
      })
    })
  },
  getMessages(userid){
    
    return new Promise((resolve,reject)=>{
      wx.request({
        url: `${wxApiUrl}/messages/${userid}`,
        success:function(res){
          if(res.data.success) resolve(res.data)
          reject(res.data)
        },
        fail:function(e){
          wx.showToast({
            title: e.errMsg,
            icon:'/resource/images/error.png'
          })
        }
      })
    })
  },
  readOneMessage(messageId){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: `${wxApiUrl}/message/${messageId}`,
        method:'put',
        success:function(res){
          if(res.data.success) resolve(res.data)
          reject(res.data)
        },
        fail:function(e){
          wx.showToast({
            title: e.errMsg,
            icon:'/resource/images/error.png'
          })
        }
      })
    })
  }
}

module.exports=apis;