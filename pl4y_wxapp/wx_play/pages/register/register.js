const apis=require('../../config/apis.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    username:'',
    phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid:options.openid
    })
  },
  onInput1(e){
    this.setData({
      username:e.detail.value
    })
  },
  onInput2(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  register(){
    let {username,openid,phone}=this.data;
    if(username==''){
      // 校验用户输入
      wx.showModal({
        title: '用户名不能为空！',
        content: '',
      })
    }else if(phone==''){
      wx.showModal({
        title: '联系方式不能为空！',
        content: '',
      })
    }else{
      // 输入正确
      wx.showLoading();
      apis.register(username,phone,openid).then(res=>{
        wx.hideLoading()
        if(res.success){
          wx.showToast({
            title: '注册成功',
            duration:1000,
            complete:function(){
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          })
          
        }else{
          wx.showToast({
            title: '注册失败'+res.message,
            duration:'1000'
          })
        }
      }).catch(e=>{
        console.error(e)
      })
    }
  },
})