const apis=require('../../config/apis.js')
const javaLocalhostBase = 'https://wx.tssword.xin/api';
// const javaLocalhostBase = 'https://localhost:8082/api';
const app=getApp()
// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
    
    },
    menus:[
      {
        title:'我的发布',
        iconPath:'/resource/images/menu-list.png',
        onTap:'myPost'
      },
      {
        title: '已参加活动',
        iconPath: '/resource/images/menu-list2.png',
        onTap: 'hasJoined'
      },{
        title:'发布活动',
        iconPath:'/resource/images/menu-post.png',
        onTap: 'postNew'
      },
      {
        title: '关于',
        iconPath: '/resource/images/menu-about.png',
        onTap: 'about'
      }, {
        title: '意见反馈',
        iconPath: '/resource/images/menu-write.png',
        onTap: 'contact'
      }
    ],
    logged:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData.userInfo)
    
   
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
    wx.showLoading({
      mask: true,
    })
   apis.checkLogin().then(res => {
    
      let openid = res.openid;
      let _this = this;
      if (res.success) {
        //已经登录
        //获取服务器用户信息
        
        wx.request({
          url: `${javaLocalhostBase}/user/${openid}`,
          method: 'GET',
          dataType: 'json',
          success: function (res) {
            if (res.data.success) {
              //获取用户信息成功
              wx.hideLoading()
              let username = res.data.user.username;
              let reputation = res.data.user.reputation;
            
              wx.getUserInfo({
                withCredentials: true,

                success: function (res) {
                  let userInfo = {
                    ...res.userInfo,
                    nickName: username,
                    reputation
                  }
                  _this.setData({
                    userInfo
                  })
                },
                fail: function (res) {
                  console.log(res)
                }
              })
            } else {
              wx.showToast({
                title: res.data.message,
                image:'/resource/images/error.png'
              })
            }
          },
          fail: function (res) {
            console.error(res);
          }
        })
      } else {
        // 尚未登录（本地无session 或校验session失败）
        //切换到登录页面
        wx.hideLoading()
        let msg=res.message?'未登录':res.errMsg;
        
        wx.navigateTo({
          url: '/pages/login/login',
          
        })
        wx.showToast({
          title: msg,
          image: '/resource/images/error.png'
        })


      }
    }).catch(e => {
      
      if(e&&e.code==400){
        wx.navigateTo({
          url: '/pages/login/login',
        })
        wx.showToast({
          title:e.errMsg+',请重新登录',
          duration: 1000,
          image: '/resource/images/error.png'
        })
      }else{
        wx.switchTab({
          url: '/pages/index/index',
          fail(res) {
            console.log(res)
          }
        })
       
        wx.showToast({
          title: '网络连接错误',
          duration: 1000,
          image: '/resource/images/error.png'
        })
      }
      
      
      
    })
  },


  myPost:function(){
    wx.navigateTo({
      url: '/pages/joinedTask/joinedTask',
    })
  },
  hasJoined:function(){
    wx.navigateTo({
      url: '/pages/myPost/myPost',
    })
  },
  postNew:function(){
    wx.navigateTo({
      url: '/pages/postTask/postTask',
    })
  },
  about:function(){
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  contact:function(){
    wx.navigateTo({
      url: '/pages/fankui/fankui',
    })
  },
  quit:function(){
    let _this=this;
    wx.showModal({
      title: '警告',
      content: '确认退出吗',
      success:function(){
        let res=apis.logout()
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
  },
  setting:function(){
    // wx.navigateTo({
    //   url: '/pages/setting/setting',
    // })
    wx.openSetting({
      success:function(res){
        console.log(res)
      }
    })
  }
})