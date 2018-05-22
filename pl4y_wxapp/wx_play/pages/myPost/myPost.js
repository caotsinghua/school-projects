const app=getApp();
const apis=require('../../config/apis.js')
const util=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab1Selected:true,
    tasks:[]
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadTasks1();
  },
  /**
   * methods
   */
  onScrollToLower(){
    // wx.showToast({
    //   title: '到底了',
    //   icon: '',
    //   image: '',
    //   duration: 1000,
    //   mask: true,
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },
  changeTab1(){
    if(this.data.tab1Selected)
    return;
    this.setData({
      tab1Selected:true
    })
    this.loadTasks1();

  },
  changeTab2() {
    if (!this.data.tab1Selected)
      return;
    this.setData({
      tab1Selected: false
    })
    this.loadTasks2();
  },
  loadTasks1(){
    wx.showLoading({
      title: '',
    })
    let openid = app.globalData.userInfo.openid;
    if (!openid)
      openid = util.getOpenId();
    apis.getTasksByOpenid(openid).then(res=>{
      // console.log(res)
      wx.hideLoading()
      let tasks=res;
      let p=[];
      for(let i=0;i<tasks.length;i++){
        if(!tasks[i].passed){
          //未完成
          p.push(tasks[i])
        }
      }
      this.setData({
        tasks:p
      })
      
    }).catch(e=>{
      wx.hideLoading()
      console.log(e)
    })
  },
  loadTasks2(){
    wx.showLoading({
      title: '',
    })
    let openid = app.globalData.userInfo.openid;
    if(!openid)
      openid = util.getOpenId();
    
    apis.getTasksByOpenid(openid).then(res => {
      console.log(res)
      wx.hideLoading()
      let tasks = res;
      let p = [];
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].passed) {
          
          p.push(tasks[i])
        }
      }
      this.setData({
        tasks: p
      })

    }).catch(e => {
      wx.hideLoading()
      console.log(e)
    })
  },
  toDetail(e) {
    let taskid = e.currentTarget.dataset.taskid;
    wx.navigateTo({
      url: '/pages/detail/detail?markerId=' + taskid,
    })
  }
})