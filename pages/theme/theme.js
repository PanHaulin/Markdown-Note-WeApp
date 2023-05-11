var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMaskAdd:false,
    showMaskEdit:false,
    textHeight: 0,
    restTheme:14,
    restDesc:25,
    themeId: 0,
    currentTheme:0,
    theme: {},
    themeList:[],
    currentBlock:1
  },
 
  save: function () {
    wx.setStorageSync('themeList', this.data.themeList);
  },
  //监听页面滑动并且记录当前记录的是第几个block
  onSlideChange:function(e){
   var that=this;
   that.setData({
     currentBlock:e.detail.current +1
   })
  },

  inputTheme: function(event){
    this.setData({
      restTheme: 14-event.detail.value.length
    })
  },

  
  touchAdd: function(){
    var themeList = this.data.themeList;
    var item = this.data.currentTheme;
    var blocks=themeList[item].block;
    var blockNum=themeList[item].blockNum+1;
    var date = Date.parse(new Date());
    var data=date+blockNum;
    var block={
      blockId:data,
      text:''
    }
   blocks.push(block);
   themeList[item].block=blocks;
   themeList[item].blockNum=blockNum;
    this.setData({
      showMaskAdd: true,
      themeList:themeList,
      theme: themeList[item],
      currentBlock: blockNum
    });
    this.save();
    console.log("touchAdd");
  },

  afterAdd: function(){
    this.setData({
      showMaskAdd:false 
    });
    var blockId = this.data.currentBlock;
    var themeId = this.data.themeId;
    console.log(blockId);
    var data = {
      themeId: themeId,
      blockId: blockId,
      currentTheme: this.data.currentTheme
    }
    var dataStr = JSON.stringify(data)
    wx.navigateTo({
      url: '/pages/edit/edit?dataStr=' + dataStr
    })
    console.log("finishAdd");
  },

  touchEdit: function () {
    var themeList = this.data.themeList;
    var item = this.data.currentTheme;
    var blockNum = themeList[item].blockNum;
    //进入编辑页面之前得检查当前是否有block
     if(blockNum>0){
       var blockId = this.data.currentBlock;
       var themeId = this.data.themeId;
       console.log(blockId);
       var data = {
         themeId: themeId,
         blockId: blockId,
         currentTheme: this.data.currentTheme
       }
       var dataStr = JSON.stringify(data)
       wx.navigateTo({
         url: '/pages/edit/edit?dataStr=' + dataStr
       })
       this.setData({
         showMaskEdit: true
       });
       console.log("touchEdit");
     }else{
       wx.showToast({
         title: '您还没添加主题，无法进入编辑页面',
         icon: 'none',
         duration: 1700,
         mask: 'true'
       })
     }
    
  },

  afterEdit: function(){
    this.setData({
      showMaskEdit:false
    });
    console.log("finishEdit..跳转页面");
  },

  editTheme: function(e){
    var name=e.detail.value;
    console.log(name);
    var theme=this.data.theme;
    console.log(theme);
    var themeList=this.data.themeList;
    var item=this.data.currentTheme;
    themeList[item].name=name;
    theme.name=name;
    this.setData({
      theme:theme,
      themeList:themeList
    })
    this.save();
    console.log("修改主题名");
  },



  inputDesc: function(e){
    var desc = e.detail.value;
    var theme = this.data.theme;
    var themeList = this.data.themeList;
    var item = this.data.currentTheme;
    themeList[item].describe = desc;
    theme.describe = desc;
    this.setData({
      theme: theme,
      themeList: themeList,
      restDesc: 25 - e.detail.value.length
    })
    this.save();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //隐藏分享界面
    wx.hideShareMenu({
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    //找到对应的主题
    var dataStr=options.dataStr;
    var data=JSON.parse(dataStr);
    var themeId=data.themeId;
    var themeNum=data.themeNum;
    console.log("login theme "+themeId+" now themeNum："+themeNum);
    var themeList=wx.getStorageSync('themeList');
    var current = 0;
    var i;
    for (i = 0; i < themeNum; i++) {
      if (themeList[i].themeId == themeId) {
        current = i;
        break;
      }
    }
    console.log("找到的下标为"+current);
    var theme=themeList[current];
    console.log(theme);
    theme.readTime++;
    themeList[current]=theme;
    this.setData({
      themeList:themeList,
      theme: theme,
      restTheme: theme.name.length,
      restDesc: theme.describe.length,
      themeId: themeId,
      currentTheme:current
    })
    console.log(this.data.theme);
    this.save();

    //设置高度的函数
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        that.setData({
          textHeight: res.windowHeight - res.screenWidth / 750 * (300)
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
    //从编辑页面回来时要刷新一下界面
    var themeList = wx.getStorageSync('themeList');
    this.setData({
      themeList: themeList,
      theme: themeList[this.data.currentTheme],
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
  onShareAppMessage: function (options) {
    var from=options.from;
    if(from == 'button'){
      var that=this;
      var data = {
        themeId: this.data.themeId,
        themeNum: this.data.themeNum,
      }
      var dataStr = JSON.stringify(data);
      return {
        title: "MarkDwon Note",
        desc: "快来看看朋友的Note吧~",
        // path: '/pages/theme/dataStr='+dataStr,
        success: function (res) {
          //成功的话就shareTime更新
          var theme = that.data.theme;
          var themeList = that.data.themeList;
          var item = that.data.currentTheme;
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
  }
})