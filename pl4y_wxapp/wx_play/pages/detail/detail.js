// pages/detail/detail.js
const apis=require('../../config/apis.js')
const util=require('../../utils/util.js')
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    isPoster:false,
    isEdit:false,
    isMember:false,
    typeRange: ['运动', '学习', '其他'],
    userInfo:{
    },
    markerInfo:{
    }
  },
  onPullDownRefresh(){
    wx.showToast({
      title: 'adasd',
    })
    
  },
  join(){
    wx.showLoading({
      title: '',
    })
    apis.checkLogin().then(res=>{
     
     if(res.success){
       // 参加这个活动
       let taskid = this.data.id;
       let userid = this.data.userid;
      //  wx.showModal({
      //    title: 'ceshi',
      //    content: 'userid'+userid,
      //  })
       if (this.data.markerInfo.currentPeoples.length == this.data.markerInfo.peopleLimit && this.data.markerInfo.peopleLimit > 0) {
         wx.showToast({
           title: '人数已满',
           image: '/resource/images/error.png'
         })
         return;
       }

       apis.joinOneTask(taskid, userid).then(res => {
         wx.hideLoading()
         if (res.success) {
           wx.redirectTo({
             url: '/pages/detail/detail?markerId=' + taskid,
           })
           wx.showToast({
             title: '参加成功',
           })
         }
       }).catch(e => {
         wx.showToast({
           title: e.message,
           image:'/resource/images/error.png'
         })
       })
     }else{
       wx.showToast({
         title: res.message,
         image: '/resource/images/error.png'
       })
     }
    }).catch(e=>{
      wx.showToast({
        title: e.errMsg,
        image: '/resource/images/error.png'
      })
      wx.switchTab({
        url: '/pages/login/login',
      })
    })
    
  },
  cancleJoin(){
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '活动详情' })

    //获取当前登录用户的id
    //当前用户id,由于登录后才访问此页面，故不检查
    let openid = util.getOpenId();
   
    apis.getUserInfoByOpenid(openid).then(res => {
      let this_userid = res.user.id;
      // console.log(res)
      // console.log(this_userid)
      // 
      this.setData({
        userid: this_userid
      })
      
      
    })



    let markerId=options.markerId;
    // console.log("获取相关信息")
    this.setData({
      id:markerId
    })
    wx.showLoading({
      title: '加载中 ',
      mask: true,
    })
    // 根据id获取标注点信息
    apis.getMarkerInfoById(markerId).then(res => {
      // console.log(res)
      let task=res.task;
      let peoples=task.peoples;
      let posterId=task.posterId;//发布者的id
      let peoples_arr;
      wx.hideLoading();
      if(task.passed){
        wx.showModal({
          title: '提示',
          content: '活动已结束！',
        })
      }
      let currentPeoples=[];
      if(!peoples){
        //如果为空
        task.currentPeoples = currentPeoples;
        this.setData({
          markerInfo: task
        })
        
      }else{
        //存在参加用户
        peoples_arr = peoples.split(',');
        peoples_arr.forEach((item,index)=>{
          let userid=item;
          apis.getUserInfoById(userid).then(res=>{
            // console.log(res)
            if(res.success){
              currentPeoples.push({
                id:userid,
                avatar:res.user.avatarUrl,
                phone:res.user.phone
              })
              task.currentPeoples = currentPeoples;
              if (index == peoples_arr.length - 1) {
                console.log(task)
                this.setData({
                  markerInfo: task
                })
                // 检查当前用户是否是参加者
                this.checkMember(peoples_arr, this.data.userid);
              }
            }
          })
          
        })
        
        
      }
      // console.log(this.data.markerInfo)

      apis.getUserInfoById(posterId).then(res=>{
        console.log(posterId)
        console.log(res)
        if(res.success){
          let userid = res.user.id;
          
          this.setData({
            userInfo:{
              id:userid,
              avatar:res.user.avatarUrl,
              nickName:res.user.username,
              phone:res.user.phone
            }
          })
          console.log(this.data.userInfo)
          let openid=util.getOpenId();
          if(openid){
            apis.getUserInfoByOpenid(openid).then(res=>{
              if(res.success){
                if(res.user.id==posterId){
                  //是否是发布者
                  this.setData({
                    isPoster:true
                  })
                }
              }
            })
          }
          
        }
      })

    }).catch(e => {
      wx.showToast({
        title: e.errMsg,
        image: '/resource/images/error.png',
      })
    })

   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  }
  ,
  handleStartDateChange(e) {
    let startDate = e.detail.value;
    let task = this.data.markerInfo;
    this.setData({
      markerInfo: { ...task, startDate,endDate:startDate }
    })
    
  },
  handleEndDateChange(e) {
    let endDate = e.detail.value;
    let task = this.data.markerInfo;
    this.setData({ markerInfo: { ...task,endDate} })
    let et = new Date(endDate).valueOf();
    let st = new Date(this.data.markerInfo.startDate).valueOf();
    if (et < st) {
      //结束时间小于开始时间
      wx.showModal({
        title: '警告',
        content: '结束时间不能早于开始时间',
        showCancel: false,
        confirmText: '重选',
        complete: () => {
          this.setData({ markerInfo: { ...task, endDate:task.startDate } })
        }
      })

    }

  },
  handleStartTimeChange(e) {
    let startTime = e.detail.value;
    let task = this.data.markerInfo;
    this.setData({
      markerInfo: { ...task, startTime, endTime: startTime }
    })
  },
  handleEndTimeChange(e) {
    let endTime = e.detail.value;
    let task = this.data.markerInfo;
 
    let startTime = task.startTime;
    this.setData({ 
      markerInfo:{...task,endTime}
     })
    let et = endTime.split(':')[0] * 60 + endTime.split(':')[1];// 分钟
    let st = startTime.split(':')[0] * 60 + startTime.split(':')[1];// 分钟
    console.log(et, st)
    if (et < st) {
      //结束时间小于开始时间
      wx.showModal({
        title: '警告',
        content: '结束时间不能早于开始时间',
        showCancel: false,
        confirmText: '重选',
        complete: () => {
          this.setData({
            markerInfo: { ...task, endTime :startTime}
          })
        }
      })

    }

  },
  handleTypeChange(e) {

      let task=this.data.markerInfo;
      this.setData({
        markerInfo: { ...task, type: this.data.typeRange[e.detail.value]}
      })
    
  },
  titleInput(e) {
    let task = this.data.markerInfo;
    this.setData({
      markerInfo: { ...task, title: e.detail.value }
    })

    // console.log(e);
  },
  descInput(e) {
    let task = this.data.markerInfo;
    this.setData({
      markerInfo: { ...task, taskDesc: e.detail.value }
    })
  },
  addressInput(e) {
    let task = this.data.markerInfo;
    this.setData({
      markerInfo: { ...task, address: e.detail.value }
    })
  },
  peopleLimitChange(e) {
    let task = this.data.markerInfo;
    let v = e.detail.value;
    if(v=="") v=0;
    try{
      v=parseInt(v);
    }catch(e){
      wx.showToast({
        title: '输入数字！',
      })
      return;
    }
    if(v<0||v>20){
      this.setData({
        markerInfo: { ...task, peopleLimit: 0 }
      })
      wx.showToast({
        title: '请输入0-20正整数',
      })
      return;
    }
    
    this.setData({
      markerInfo: { ...task, peopleLimit: v }
    })
  },
  edit:function(){
    console.log('编辑')
    this.setData({
      isEdit: true
    })
  },
  save:function(){
    let task=this.data.markerInfo;
    let id=task.id;
    console.log(task)
    apis.updateOneTask(id,task).then(res=>{
      this.setData({
        isEdit: false
      })
      wx.showToast({
        title: '修改任务成功',
      })
      console.log(res.task)
      this.setData({
        markerInfo:res.task
      })
      wx.redirectTo({
        url: '/pages/detail/detail?markerId=' + id,
      })
    }).catch(e=>{
      // console.log(e)
      this.setData({
        isEdit: false
      })
      wx.showToast({
        title: '修改任务失败',
      })
    })
    
  },
  finishTask:function(){
    console.log('finish');
    //调用api
    let id=this.data.id;
    apis.finishOneTask(id).then(res=>{
      //结束完成后去评价
      if (this.data.markerInfo.currentPeoples.length>0){
        wx.redirectTo({
          url: '/pages/pingjia/pingjia?taskid=' + this.data.id,
        })
      }else{
        wx.navigateBack({
          delta: 1,
        })
      }
      
    }).catch(e=>{
      console.log(e)
      wx.showToast({
        title: '结束失败',
      })
    })
  },
  checkMember(peoples,userid){
    
    if(peoples.indexOf(userid.toString())!=-1){
      //当前用户已经参加了这个活动
      this.setData({
        isMember:true
      })
    }
    
  },
  quitTask(){
    //退出这个活动
    let taskid=this.data.id;
    let userid=this.data.userid;
    console.log(userid)
    apis.quitOneTask(taskid,userid).then(res=>{
      wx.redirectTo({
        url: '/pages/detail/detail?markerId='+taskid,
        success: function(res) {
          wx.showToast({
            title: '退出活动成功',
            duration:2000
          })
        }
      })
    }).catch(e=>{
      wx.showToast({
        title:e.message,
      })
    })
  },
  showAddress(){
    let {latitude,longitude,address,address2}=this.data.markerInfo;
    wx.openLocation({
      latitude:parseFloat(latitude),
      longitude:parseFloat(longitude),
      name: address,
      address:address2,
      success: function(res) {
        console.log(res)
      },
    })
  },
  showMap(){
    let _this = this;
    // 打开地图选地址
    wx.chooseLocation({
      success: function (res) {
        let task = _this.data.markerInfo;
        let markerInfo={
          ...task,
          address: res.name,
          longitude: res.longitude,
          latitude: res.latitude,
          address2: res.address
        }
        _this.setData({
          markerInfo
        })
      }
    })
  },
  deleteTask(){
    let _this=this;
    wx.showModal({
      title: '警告',
      content: '确认删除？(无法恢复)',
      showCancel: true,
      cancelText: '不删除了',
      confirmText: '必须删',
      success: function(res) {
       if(res.confirm){
         wx.showLoading({
           title: '',
         })
         apis.deleteOneTask(_this.data.id).then(res => {
           wx.hideLoading()
           wx.switchTab({
             url: '/pages/me/me',
           })
           wx.showToast({
             title: '删除成功',
           })
         }).catch(e => {
           wx.showModal({
             title: '错误',
             content: res.message,
           })
         })
       }
        
      },
      fail:function(res){

      }
    })
    
  },
  showPhone(e){
    let idx=e.currentTarget.dataset.idx;
    let phone = this.data.markerInfo.currentPeoples[idx].phone;
    wx.showModal({
      title: '联系方式',
      content: '手机:'+phone,
      showCancel: true,
    })
  }
})