const utils=require('../../utils/util.js')
const apis=require('../../config/apis.js')
const javaLocalhostBase = 'https://localhost:8082/api';
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeRange:['运动','学习','其他'],
    type:'选择',
    startDate:'开始日期',
    endDate: '结束日期',
    startTime:'开始时间',
    endTime:'结束时间',
    title:'',
    address:'',
    desc:'',
    peopleLimit:0,
    longitude:'',
    latitude:'',
    address2:'',

  },
  /**
   * methods
   */
  //时间选择改变
  handleStartDateChange(e){
    let startDate=e.detail.value;
    this.setData({startDate,endDate:startDate})
  },
  handleEndDateChange(e){
    let endDate = e.detail.value;
    this.setData({ endDate })
    let et=new Date(endDate).valueOf();
    let st=new Date(this.data.startDate).valueOf();
    if(et<st){
      //结束时间小于开始时间
      wx.showModal({
        title: '警告',
        content: '结束时间不能早于开始时间',
        showCancel: false,
        confirmText: '重选',
        complete:()=>{
          this.setData({
            endDate: this.data.startDate
          })
        }
      })
      
    }
    
  },
  handleStartTimeChange(e) {
    let startTime = e.detail.value;
    this.setData({ startTime, endTime: startTime })
  },
  handleEndTimeChange(e) {
    let endTime = e.detail.value;
    let startTime=this.data.startTime;
    this.setData({ endTime })
    let et = endTime.split(':')[0] * 60 + endTime.split(':')[1];// 分钟
    let st = startTime.split(':')[0] * 60 + startTime.split(':')[1];// 分钟
    console.log(et,st)
    if (et < st) {
      //结束时间小于开始时间
      wx.showModal({
        title: '警告',
        content: '结束时间不能早于开始时间',
        showCancel: false,
        confirmText: '重选',
        complete: () => {
          this.setData({
            endTime: this.data.startTime
          })
        }
      })

    }

  },
  handleTypeChange(e){
    this.setData({
      type:this.data.typeRange[e.detail.value]
    })
  },
  titleInput(e){
    this.setData({
      title:e.detail.value
    })
  },
  descInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  addressInput(e) {
    this.setData({
      address: e.detail.value
    })
  },
  peopleLimitChange(e){
    this.setData({
      peopleLimit: e.detail.value
    })
  },
  submit(){
    let {title,address,type,startDate,endDate,startTime,endTime,peopleLimit,desc,longitude,latitude,address2} =this.data;
    // 验证
    if(title==''){
      wx.showToast({
        title: '活动标题不能为空！',
        image:'/resource/images/error.png'
      })
      return ;
    }
    if (address == '') {
      wx.showToast({
        title: '活动地点不能为空！',
        image: '/resource/images/error.png'
      })
      return;
    }
    if (type == '选择') {
      wx.showToast({
        title: '请选择活动类别！',
        image: '/resource/images/error.png'
      })
      return;
    }
    if (startTime == '开始时间' || startDate == '开始日期' || endTime == '结束时间' || endDate == '结束日期' ) {
      wx.showToast({
        title: '请选择正确的日期或时间！',
        image: '/resource/images/error.png'
      })
      return;
    }
    let openid=utils.getOpenId();
    if(!openid){
      wx.showToast({
        title: '尚未登录！',
        image: '/resource/images/error.png'
      })
      return;
    }
    let wxurl = 'https://wx.tssword.xin/api/user/' + openid;
    let localurl = javaLocalhostBase + '/user/' + openid
    wx.request({
      url: wxurl,
      success(res){
        let posterId=res.data.user.id;

        if(posterId){
          let task = { title, address, type, startDate, endDate, startTime, endTime, peopleLimit, taskDesc: desc, openid,longitude,latitude, posterId ,address2};
          console.log(task)
          apis.postOneTask(task).then(res=>{
            wx.navigateBack({
              delta: 1,
            })
            wx.showToast({
              title: '发布成功',
            })
          }).catch(e=>{
            wx.showToast({
              title: '发布失败'+e.message,
              image: '/resource/images/error.png'
            })
          })
        }
      },
      fail:function(res){
        wx.navigateBack({
          delta: 1,
        })
        wx.showToast({
          title: '网络错误'+res.errMsg,
          image: '/resource/images/error.png'
        })
      }
    })
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '发布活动' })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    apis.checkLogin().then(res=>{
      if(!res.success){
        //未登录
        //返回
        wx.redirectTo({
          url: '/pages/login/login',
        })
        wx.showToast({
          title: '未登录',
          image: '/resource/images/error.png',
        })
        
        
      }
    }).catch(e=>{
      wx.redirectTo({
        url: '/pages/login/login',
      })
      wx.showToast({
        title: '未登录',
        image: '/resource/images/error.png'
      })
    })
  },
  openMap(){
    // let {longitude,latitude} = app.globalData.userLocation;
    let _this=this;
    // 打开地图选地址
    wx.chooseLocation({
      success: function(res) {
        
        _this.setData({
          address:res.name,
          longitude:res.longitude,
          latitude:res.latitude,
          address2:res.address
        })
      }
    })
  }

})