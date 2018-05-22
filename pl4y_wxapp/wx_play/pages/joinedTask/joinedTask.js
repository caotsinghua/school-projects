const apis=require('../../config/apis.js')
const utils=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasks: [
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdata();
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
  onScrollToLower(){},
  getdata(){
    //只有登录了才能进行这部操作
    const openid=utils.getOpenId();
    const _this=this;
    wx.showLoading({
      title: '加载中 ',
      mask: true,
    })
    wx.request({
      url: `https://wx.tssword.xin/api/user/${openid}`,
      success(res){
        let id=res.data.user.id;
        apis.getTasksByPosterId(id).then(res=>{
          wx.hideLoading()
          let tasks=res.tasks;
          for(let i=0;i<tasks.length;i++){
            
            apis.getUserInfoById(tasks[i].posterId).then(res => {
              // console.log(res)
              
              if (tasks[i].taskDesc == '') {
                tasks[i].taskDesc = "暂无简介."
              }
              tasks[i].avatarUrl = res.user.avatarUrl||"/resource/images/avatar2.png"
              if(i==tasks.length-1){
                _this.setData({
                  tasks: tasks
                })
                // console.log(_this.data.tasks)
              }
              
            })
          }
          
         
          
        }).catch(e=>{
          console.log(e)
        })
      }
    })
  },
  toDetail(e){
    let taskid = e.currentTarget.dataset.taskid;
    wx.navigateTo({
      url: '/pages/detail/detail?markerId='+taskid,
    })
  }
})