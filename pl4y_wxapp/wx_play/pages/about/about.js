const animate=require('../../config/animate.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentAnimation:{},
    logoAnimate:{},
    toLeft:{},
    current:0,
    coders:[
      {
        name:'曹青华',
        avatar:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK220yJvmW5tRMrEytPibDBqOZUJRscI0ic0aBQk6TO5vkrTGP2bjIibFgs8GibzRcvEvv0CUhrtNnARw/0',
        desc:'做了一些微不足道的工作。'
      },
      {
        name: '赵聪',
        avatar: 'https://wx.qlogo.cn/mmopen/vi_32/ymTgoSZxyc4CEPibG6ibF4SCrxiawtswqCfpA7mERduician1OwzsWZQ2Z6lceZNCDVgNFbwMjTlbDdagdR8mj6MR8g/0',
        desc: '做了一些微不足道的工作。'
      },
      {
        name: '荣威',
        avatar: 'https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268/sign=d665bc715566d0167e19992eaf2ad498/b64543a98226cffcf1a9800ebe014a90f703ea8f.jpg',
        desc: '做了一些微不足道的工作。'
      },
      {
        name: '崔保伟',
        avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514980882&di=5d46ccaab024e651f74db25fe2f53980&imgtype=jpg&er=1&src=http%3A%2F%2Fpic.baike.soso.com%2Fp%2F20140527%2F20140527110841-317435631.jpg',
        desc: '做了一些微不足道的工作。'
      }
    ]
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
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    animation.scale(2, 2).rotate(360).step()
    animation.scale(1, 1).step();
    
    this.setData({
      contentAnimation: animation.export()
    })

    let animation2=wx.createAnimation({
      duration:1500,
      timingFunction:'ease-in-out'
    })
    animation2.rotate(360).step();
    this.setData({
      logoAnimate:animation2
    })
    let animation3 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in-out'
    })
    animation3.translateX(0).step();
    this.setData({
      toLeft: animation3
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  down:function(){
    this.setData({
      current:1
    })
  }
})