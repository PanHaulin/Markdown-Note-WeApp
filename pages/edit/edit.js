Page({

  data: {
    textHeight:0,
    showFlag:false,
    animationData:{},
    themeId:0,
    blockId:0,
    themeList:[],
    theme: {},
    currentTheme:0
  },
  save: function () {
    wx.setStorageSync('themeList', this.data.themeList);
  },

 //保存文本区文字
  bindTextArea: function (e) {
    var themeList = this.data.themeList;
    var item = this.data.currentTheme;
    var bid=this.data.blockId-1;
    themeList[item].block[bid].text=e.detail.value;
    this.setData({
      themeList:themeList,
      theme: themeList[item]
    })
    this.save();
  },

  //底部分享和删除函数
  bindDelete:function(){
    var that=this;
     wx.showModal({
       title: '删除文本',
       content: '确定要删除这条markdown吗?',
       showCancel: true,
       cancelText: '取消',
       confirmText: '删除',
       cancelColor: '#d3d3d3',
       success: function(res){
        if(res.confirm){
          console.log('用户确认删除这条markdown')
          var themeList=that.data.themeList;
          var theme=that.data.theme;
          var currentTheme = that.data.currentTheme;
          //这里blockId就是这个block的下标加一
          var blockId = that.data.blockId;
        //开始删除啦
         var remove=theme.block.splice(blockId-1,1)[0];
         theme.blockNum-=1;
         themeList[currentTheme]=theme;
         that.setData({
           theme:theme,
           themeList:themeList
         })
         that.save();
         wx.navigateBack({
           delta: 1,
         })

        }
        else{
          console.log('用户取消删除该markdown');
        }
      }
     })
  },

  bindShow:function(e){
    var that = this;
    var theme = that.data.theme;
    var themeList = that.data.themeList;
    var item = that.data.currentTheme;
    var bid = this.data.blockId - 1;
    var text = theme.block[bid].text;
    wx.navigateTo({
      url: '/pages/show/show?text=' + text
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
    console.log('in function shareInword'); 
    var theme = this.data.theme;
    var text=theme.block[this.data.blockId - 1].text;
    console.log(text);
    wx.setClipboardData({
      data: text,
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
    wx.showToast({
      title: '以后的版本将会添加这项功能(*￣︶￣)',
      icon: 'none',
      duration: 1700,
      mask: 'true'
    })
     console.log('分享图片ing...')
  },


  //顶部符号函数添加函数
  //每个函数最后调用的函数finishAdd（)是用来更新数据的
  addTitle: function () {
    var theme=this.data.theme;
    theme.block[this.data.blockId-1].text +='#';
    this.setData({
      theme:theme
    })
    this.finishAdd();
  },
  addBold: function () {
    var theme = this.data.theme;
    theme.block[this.data.blockId-1].text += '*';
    this.setData({
      theme: theme
    })
    this.finishAdd();
  },
  addList: function () {
    var theme = this.data.theme;
    theme.block[this.data.blockId-1].text += '-';
    this.setData({
      theme: theme
    })
    this.finishAdd();
  },
  addReference: function () {
    var theme = this.data.theme;
    theme.block[this.data.blockId-1].text += '>';
    this.setData({
      theme: theme
    })
    this.finishAdd();
  },
  addCode: function () {
    var theme = this.data.theme;
    theme.block[this.data.blockId-1].text += '`';
    this.setData({
      theme: theme
    })
    this.finishAdd();
  },
  addTable: function () {
    var theme = this.data.theme;
    theme.block[this.data.blockId-1].text += '|';
    this.setData({
      theme: theme
    })
    this.finishAdd();
  },
  addFan: function () {
    var theme = this.data.theme;
    theme.block[this.data.blockId-1].text += '\\';
    this.setData({
      theme: theme
    })
    this.finishAdd();
  },
  addLink: function () {
    var theme = this.data.theme;
    theme.block[this.data.blockId-1].text += '[]()';
    this.setData({
      theme: theme
    })
    this.finishAdd();
  },
  addImage:function(){
    wx.showToast({
      title: '以后的版本将会添加这项功能(*￣︶￣)',
      icon:  'none',
      duration: 1700,
      mask: 'true'
    })
    console.log('添加图片')
    },

  finishAdd:function(){
    var themeList = this.data.themeList;
    var item = this.data.currentTheme;
    themeList[item] = this.data.theme;
    this.setData({
      themeList: themeList
    })
    this.save();
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    //加载时第几个主题第几个笔记
    var dataStr=options.dataStr;
    var data=JSON.parse(dataStr);
    var themeId=data.themeId;
    var blockId=data.blockId;
    var current=data.currentTheme;
     var that=this;
     var themeList=wx.getStorageSync('themeList');
     var theme = themeList[current];
     that.setData({
       themeList:themeList,
       theme: theme,
       themeId:themeId,
       blockId:blockId,
       currentTheme:current
     })
     that.save();
     //设置高度的函数
     wx.getSystemInfo({
       success: function(res) {
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
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          textHeight: res.windowHeight - res.screenWidth / 750 * (180)
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          textHeight: res.windowHeight - res.screenWidth / 750 * (180)
        })
      },
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

  onShareAppMessage: function () {
    var that=this;
    var theme = that.data.theme;
    var themeList = that.data.themeList;
    var item = that.data.currentTheme;
    var bid = this.data.blockId - 1;
    var text=theme.block[bid].text;
    return {
      title: "MarkDwon Note",
      desc: "快来看看朋友的Note吧~",
      path: '/pages/show/show?text='+text,
      success: function (res) {
        //成功的话就shareTime更新
        console.log("转发这个block成功");
        theme.shareTime += 1;
        themeList[item] = theme;
        that.setData({
          theme: theme,
          themeLiwst: themeList
        })
        that.save();
        console.log("转发成功");
      },
      fail: function (res) {
        console.log("转发失败")
      }
    }
  }
})