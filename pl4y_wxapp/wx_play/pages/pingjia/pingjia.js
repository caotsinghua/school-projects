const apis=require('../../config/apis.js')
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    members:[{
      id:'',
      username:'',
      avatar:'',
      arrive:false
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({})
    const id=options.taskid;
    apis.getMarkerInfoById(id).then(res=>{
      let peoples = res.task.peoples;
      let peoples_arr;
      wx.hideLoading()
      let currentPeoples = [];
      if (!peoples) {
        //如果为空
        this.setData({
          members:[]
        })
        wx.navigateBack({
          delta: 1,
        })
      } else {
        //存在参加用户
        peoples_arr = peoples.split(',');
        
        peoples_arr.forEach((item, index) => {
          let userid = item;
          apis.getUserInfoById(userid).then(res => {
            if (res.success) {
              currentPeoples.push({
                id: userid,
                avatar: res.user.avatarUrl,
                username:res.user.username,
                arrive:false
              })
              if (index == peoples_arr.length - 1) {
                console.log(currentPeoples)
                this.setData({
                  members:currentPeoples
                })
              }
            }
          })

        })
    }
    })
  },
  submit(){
    wx.showLoading({
    })
    let members=this.data.members;
    if(members.length==0)return;
    let users=[];
    let values=[];
    members.forEach(item=>{
      users.push(item.id);
      values.push(item.arrive)
    })
    let posterId=app.globalData.userInfo.id;
    apis.judgeUsers(users,values,posterId).then(res=>{
      wx.hideLoading()
      console.log(res)
      wx.showToast({
        title: '评价完成',
      })
      wx.navigateBack({
        delta: 1,
      })
    }).catch(e=>{
      wx.hideLoading()
      wx.showToast({
        title:e.message,
      })
    })
  },
  cancle(){
    wx.navigateBack({
      delta: 1,
    })
  },
  switchChange(e){
    let idx=e.target.dataset.arridx;
    let members=this.data.members;
    members[idx].arrive=e.detail.value;
    this.setData({members})
  }
})