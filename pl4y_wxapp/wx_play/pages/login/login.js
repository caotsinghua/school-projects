const apis=require('../../config/apis.js')
const utils=require('../../utils/util.js')
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * methods
   */
  login:function(){
    let user={
      username:this.data.username,
      password:this.data.password
    }
    console.log(user)
  },
  wxlogin:function(){
    wx.showLoading({
      title: '登录中',
      mask: true
    })
    apis.login().then(res=>{
      
      if(res.success){
        wx.hideLoading()
        let openid=utils.getOpenId();
        wx.getUserInfo({
          success(res) {
            
            let userInfo = {
              avatarUrl: res.userInfo.avatarUrl,
              openid: openid,

            }
            apis.getUserInfoByOpenid(openid).then(res => {

              if (res.success) {
                userInfo.id = res.user.id;
                app.globalData.userInfo = userInfo;
                apis.setAvatar(res.user.id, userInfo.avatarUrl).then(res => {
                  console.log(res);
                })
              }
            })

          }
        })
        // apis.getUserInfoByOpenid(openid).then(res=>{
        //   if(res.success){
        //     let id = res.user.id

        //     app.globalData.userInfo.userid=id;
            
        //     apis.setAvatar(id, app.globalData.userInfo.avatarUrl).then(res=>{
        //       console.log(res);
        //     })
        //   }
          
        // })
        wx.navigateBack({
          delta: 1,
        })
      }else{
        wx.navigateTo({
          url: '/pages/register/register?openid=' + res.openid,
        })
        wx.showToast({
          title: '去注册',
        })
        
      }
    }).catch(e=>{
      wx.switchTab({
        url: '/pages/index/index',
      })
      wx.showToast({
        title: '网络错误:'+e.errMsg,
        duration:1000
      })
    })
  },
  usernameInput(e){
    let value=e.detail.value;
    this.setData({
      username:value
    })
  },
  passwordInput(e){
    let value = e.detail.value;
    this.setData({
      password: value
    })
  },
  
})