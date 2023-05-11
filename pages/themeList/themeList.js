var util=require('../../util.js')
var app=getApp();
Page({
  data: {
    showModal: false, //是否显示模态弹窗
    isPopping: false,//是否已经弹出
    animationMore: {},//旋转动画
    animationNew: {},//item位移,透明度
    animationDelete: {},//item位移,透明度
    themeList:[],
    themeNum:0,
    //用于标记触发移除操作的主题
    currentTheme:0,
    isBatching:false,  //是否正在批量删除
    delList:[],
    slideslip:{}  //下拉动画
  },
  save: function () {
    wx.setStorageSync('themeList', this.data.themeList);
    wx.setStorageSync('themeNum', this.data.themeNum);
  },

  navigate: function(event){
    //传递主题数目是为了主题加载的时候 要找对应的主题id对应在储存中是第几位 所以要知道循环多少次
    var themeId=event.currentTarget.dataset.themeId;
    var themeNum=event.currentTarget.dataset.themeNum;
    var data={
      themeId : themeId,
      themeNum : themeNum
    }
    var dataStr=JSON.stringify(data);
    wx.navigateTo({
      url:'/pages/theme/theme?dataStr='+dataStr
    })
  },
  

  /**
   * 点击侧边栏图片，弹出模态窗口
   */

  action: function(e){
    //记录当前选中这个删除的选项是哪个
    var current = e.currentTarget.dataset.currentTheme;
    console.log(current);
    this.setData({
      showModal: true,
      currentTheme: current
    })
  },

  /**
   * 防止Tap向上传递
   */
  preventTap: function(){
    this.setData({
      showModal: false
    })
  },

  /**
   * 模态窗口内的移除
   */
  del: function(){
    var that=this;
    var themeList = that.data.themeList;
    var themeNum=that.data.themeNum;
    var currentTheme=that.data.currentTheme;
    var current=0;
    var i;
    for( i=0;i<themeNum;i++){
      if(themeList[i].themeId==currentTheme){
         current=i;
         console.log("找到对应的啦:"+ current);
         break;
      }
    }
    console.log("循环了"+(i+1)+"次");
    console.log('现在准备删除主题'+current+" 它的themeId是 "+that.data.currentTheme);
    //var current=that.data.currentTheme-1;

    var remove=themeList.splice(current,1)[0];
    //更新主题下标  防止删除出错
     /*
     i=current;
      for(var j=i+1;j<themeNum;j++){
        themeList[j].themeId=i;
        i++;
      }
      */
    var themeNum=that.data.themeNum-1;
    this.setData({
       themeNum: themeNum,
       themeList: themeList,
       currentTheme:0,
      showModal:false
    })
    that.save();
    console.log("移除");
  },
  /**
   * 模态弹窗 end
   */

  /**
   * more按钮动画
   */
  
  More: function () {
    function pop(){
    //弹出时动画
    var animationMore =wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })  
    var animationNew =wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationDelete=wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationMore.rotateZ(360).step();
    animationNew.translate(-30,-20).rotateZ(360).opacity(1).step();
    animationDelete.translate(-30,20).rotateZ(360).opacity(1).step();
    this.setData({
      animationMore: animationMore.export(),
      animationNew: animationNew.export(),
      animationDelete: animationDelete.export()
    })
  }
  
  function takeback(){
    //缩回时动画
    var animationMore = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationNew = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationDelete = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationMore.rotateZ(0).step();
    animationNew.translate(0, 0).rotateZ(0).opacity(0).step();
    animationDelete.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animationMore: animationMore.export(),
      animationNew: animationNew.export(),
      animationDelete: animationDelete.export()
    })
  }

    if (this.data.isPopping) {
      //回缩动画
      pop.call(this);
      this.setData({
        isPopping: false
      })
    } else {
      //弹出动画
      takeback.call(this);
      this.setData({
        isPopping: true
      })
    }
  },

  New: function () {
  
    var themeList=this.data.themeList;
    var themeNum=this.data.themeNum+1; 
    var time = util.formatTime(new Date());
    //themeId通过时间戳来设定，这样能够保证它的唯一性
    var data = Date.parse(new Date());
    var themeId=data+themeNum;
    var theme={
        themeId:themeId,
        name:'',
        editTime:data,
        dateStr:time,
        describe:'',
        readTime:0,
        shareTime:0,
        blockNum:0,
        block:[],
        loadTime: 0
    };
    themeList.push(theme);
   this.setData({
     themeList: themeList,
     themeNum: themeNum
   })
  this.save();
  },

  Batching: function () {
    this.More();  //缩回按钮
  
    //设置下拉动画
    var slideslip = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })

    if (this.data.isBatching==false) {
      //缩放，将状态改为批量删除，缩回按钮
      slideslip.translateY(50).step();
      this.setData({
        isBatching: true,
        slideslip: slideslip.export()
      })
    } else {
      //恢复原状，状态变更
      slideslip.translateY(0).step();
      this.setData({
        isBatching: false,
        slideslip: slideslip.export()
      })
    }

    //更新数据
    console.log(this.data.isBatching);
  },

  //取消批量删除
  cancelAll:function(){
    var slideslip = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })

    slideslip.translateY(0).step();
    this.setData({
      isBatching: false,
      slideslip: slideslip.export()
    })
  },

  //删除全部
  delAll:function(){
    console.log(this.data.delList);

    var that = this;
    var themeList = that.data.themeList;  //获得主题列表
    var themeNum = that.data.themeNum;  //获得主题数目
    var delList = that.data.delList;  //获得待删除列表

    //删除待删除列表中所有主题项
    for(var i=0;i<delList.length;i++){
      var currentTheme = delList[i];  //获得themeId
      var current=0;
      for (; current < themeNum; current++) {
        if (themeList[current].themeId == currentTheme) {
          console.log("找到对应的啦:" + current+",立即删除");
          break;
        }
      }
      var remove = themeList.splice(current, 1)[0];
      themeNum = themeNum - 1;
    }
    this.setData({
      themeNum: themeNum,
      themeList: themeList,
      currentTheme: 0,
      showModal: false,
      delList:[]  //待删除列表清空
    })
    this.save();
    this.cancelAll();
    console.log("移除");
  },
  
  checkboxChange:function(e){
    console.log(e.detail.value);
    this.setData({
      delList:e.detail.value
    })
  },

  /**
   * more按钮动画 end
   */
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //记录加载时的时间以显示主是几天前创建
      var time=Date.parse(new Date());
      this.setData({
        loadTime: time
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

    var time = Date.parse(new Date());
    this.setData({
      loadTime: time
    })

    var themeList=wx.getStorageSync('themeList');
    if(themeList){
      this.setData({
        themeList: themeList
      })
    }else{
    }

    var themeNum=wx.getStorageSync('themeNum');
    if(themeNum){
      this.setData({
        themeNum: themeNum
      })
    }else {
    }
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
    
  }
})