Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: 0,
    textHeight:0,
    scrollHeight:0,
    isPopping: false,// 是否已经弹出侧边栏 
    anchor: 0,    //原点手势位置-x
    newAnchor: 0,  //最新点手势位置-x
    startAnchor: 0,
    windowWidth: wx.getSystemInfoSync().windowWidth * 0.3,
    status: 1,   //1时在最左侧，2时在最右侧
    slideslip: {},//动画
  },

  up:function(e){
    var selected = this.data.selected;
    if (selected >= 1) {
      selected -= 1;
      this.setData({
        selected: selected
      })
    }
  },
  next:function(e){
    var selected = this.data.selected;
    if(selected<=2){
      selected+=1;
      this.setData({
        selected: selected
      })
    }
  },
  tap: function () {

    var slideslip = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })

    if (!this.data.isPopping) {
      //弹出侧边栏
      slideslip.translateX(this.data.windowWidth).scale(0.85).step();
      this.setData({
        isPopping: true,
        slideslip: slideslip.export()
      })
    } else {
      //缩回侧边栏
      slideslip.translateX(0).scale(1).step();
      this.setData({
        isPopping: false,
        slideslip: slideslip.export()
      })
    }

  },

  start: function (e) {
    this.setData({
      anchor: e.touches[0].pageX,
      newAnchor: e.touches[0].pageX
    })
    if (!(this.data.isPopping)) {
      this.setData({
        startAnchor: e.touches[0].pageX
      })
    } else {
      //滑到右边
      this.setData({
        startAnchor: e.touches[0].pageX
      })
    }
  },

  drag: function (e) {
    var slideslip = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })

    this.setData({
      newAnchor: e.touches[0].pageX
    });
    //向右滑动
    if (this.data.anchor < this.data.newAnchor && this.data.windowWidth > this.data.newAnchor) {
      slideslip.translateX(this.data.newAnchor).step();
    }
    //向左滑动
    if (this.data.anchor > this.data.newAnchor && this.data.newAnchor >= 0) {
      slideslip.translateX(this.data.newAnchor).step();
    }

    this.setData({
      anchor: this.data.newAnchor,
      slideslip: slideslip.export()
    })
  },

  end: function () {
    var slideslip = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })

    if (this.data.newAnchor < this.data.windowWidth * 0.5) {
      //缩回
      slideslip.translateX(0).scale(1).step();
    } else {
      slideslip.translateX(this.data.windowWidth).scale(0.85).step();
    }

    //重置anchor
    this.setData({
      anchor: 0,
      newAnchor: 0,
      slideslip: slideslip.export()
    })
  },

  //切换显示
  about0: function (e) {
    this.setData({
      selected: 0
    })
    this.tap();
  },

  about1: function (e) {
    this.setData({
      selected: 1
    })
    this.tap();
  },

  about2: function (e) {
    this.setData({
      selected: 2
    })
    this.tap();
  },

  about3: function (e) {
    this.setData({
      selected: 3
    })
    this.tap();
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        that.setData({
          textHeight: res.windowHeight - res.screenWidth / 750 * (200),
          scrollHeight: res.windowHeight - res.screenWidth / 750 * (220),
        })
      },
    })
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.isPopping)
      this.tap();
    
    this.setData({
      selected:0
    })
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

  }
})