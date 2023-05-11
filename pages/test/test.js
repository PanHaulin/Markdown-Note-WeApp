Page({

  data: {
    valueOfText: '',
    textHeight:0,
    showFlag:false,
    animationData:{}
  },

 //保存文本区文字
  bindTextArea: function (e) {
    this.setData({
      valueOfText: e.detail.value
    })
  },
  //底部分享和删除函数
  bindDelete:function(){
     wx.showModal({
       title: '删除文本',
       content: '确定要删除这条markdown吗?',
       showCancel: true,
       cancelColor: '#d3d3d3',
       confirmText: '删除',
       success: function(res){
         if(res.confirm){
           console.log('用户确认删除该markdown')
        } else if(res.cancel){
         console.log('用户取消删除这条markdown')
        }
      }
     })
  },

  bindShare:function(e){
    var that=this;
    //创建动画实例
    var animation=wx.createAnimation({
      duration:350,
      timingFunction:'linear'
    })
  that.animation=animation;
  animation.translateY(100).step();
  that.setData({
    animationData: animation.export(),
    showFlag: true
  })
  setTimeout(function(){
    animation.translateY(0).step()
    that.setData({
      animationData:animation.export()
    })
  },200)
  },

  //关闭幕布
  hideModal:function(e){
    var that=this;
    var animation=wx.createAnimation({
      duration: 350,
      timingFunction:'linear'
    })
    that.animation = animation
    animation.translateY(100).step()
    that.setData({
      animationData: animation.export()
    })
    setTimeout(function(){
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        showFlag: false
      })
    },200)
  },
  
  //分享文本实现函数
  shareInWord:function(){
    var that=this;
    wx.setClipboardData({
      data: that.data.valueOfText,
      success: function(res){
        that.setData({
          showFlag:false
        })
        wx.showToast({
          title: '文本已复制',
          icon:'success',
          duration:1500
        })
      }
    })
  },

  shareInImage:function(){
     console.log('分享图片ing...')
  },


  //顶部符号函数
  addTitle: function () {
    this.setData({
      valueOfText: this.data.valueOfText + '#'
    })
  },
  addBold: function () {
    this.setData({
      valueOfText: this.data.valueOfText + '*'
    })
  },
  addList: function () {
    this.setData({
      valueOfText: this.data.valueOfText + '-'
    })
  },
  addReference: function () {
    this.setData({
      valueOfText: this.data.valueOfText + '>'
    })
  },
  addCode: function () {
    this.setData({
      valueOfText: this.data.valueOfText + '```'
    })
  },
  addTable: function () {
    this.setData({
      valueOfText: this.data.valueOfText + '|'
    })
  },
  addFan: function () {
    this.setData({
      valueOfText: this.data.valueOfText + '\\'
    })
  },
  addLink: function () {
    this.setData({
      valueOfText: this.data.valueOfText + '[]()'
    })
  },
  addImage:function(){
    console.log('添加图片')
      },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log('onload')
     var that=this
     wx.getSystemInfo({
       success: function(res) {
         console.log(res);
         console.log('height='+res.windowHeight);
         console.log('width='+res.windowWidth);
         that.setData ({
           textHeight:res.windowHeight-res.screenWidth/750*(180)
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

  onShareAppMessage: function () {

  }
})