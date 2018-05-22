// pages/message/message.js
const app=getApp();
const apis=require("../../config/apis.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完// 检查当前用户是否是参加者
      this.checkMember(peoples_arr, this_userid);成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    this.getMessages();
  },
  getMessages(){
    wx.showLoading({
      title: '',
    })
    
    const id = app.globalData.userInfo.id;
    if(!id){
      //没有登录
      wx.hideLoading();
      return;
    }
    const _this = this;
    apis.getMessages(id).then(res => {
      
      wx.hideLoading()
      let messages = res.messages;
      if (messages.length == 0) {
        _this.setData({
          messages
        })
        return;
      }
      messages.forEach((message, index) => {
        apis.getUserInfoById(message.fromid).then(res => {

          if (res.success) {

            let postername = res.user.username;
            let avatar = res.user.avatarUrl;
            message.avatar = avatar;
            message.postername = postername;
            if (index == messages.length - 1) {

              _this.setData({
                messages
              })
              console.log(_this.data.messages)
            }

          }
        })

      })


    }).catch(e => {
      console.error(e)
    })
  },
  readOne:function(e){
    let index = e.currentTarget.dataset.messageid;
    let msg = this.data.messages[index]
    let time=new Date(msg.time);
    time=time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()+' ';
    let messageId = this.data.messages[index].id;
    let _this=this; 
    // console.log(messageId)
    apis.readOneMessage(messageId).then(res=>{
      // console.log(res)
      wx.showModal({
        title: '信息详情 '+time,
        content: msg.content,
        showCancel:false,
        confirmText: '看完了',
        
        success: function(res) {
          _this.getMessages();
        },
        fail: function(res) {},
        complete: function(res) {},
      })
      // 
      // wx.navigateTo({
      //   url: '/pages/messageInfo/messageInfo?messageId='+messageId,
      // })
    }).catch(e=>{
      console.error(e)
    })
  }
  
})