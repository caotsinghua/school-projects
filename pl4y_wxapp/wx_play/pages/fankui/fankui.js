// pages/fan kui/fankui.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  submit(){
    wx.showLoading({
      title: '提交中',
      
    })
    setTimeout(function(){wx.hideLoading()
      wx.showModal({
        title: '提示',
        showCancel:false,
        confirmText:'返回了',
        content: '其实并收不到反馈=-=',
        success: function () {
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    },2000)
    
  }
})