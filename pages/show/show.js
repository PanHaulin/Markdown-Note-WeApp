// 引入wemark
var wemark = require('../wemark/wemark');
// 需要渲染的Markdown文本
var md = '#### hello world';



Page({
  data: {
    // 确定一个数据名称
    wemark: {}
  },




  onLoad:function(options){
    md = options.text;
    this.createNewImg();
  },
  onReady: function () {
    console.log("传来的text内容是: "+md);
    wemark.parse(md, this, {
      // 新版小程序可自适应宽高
      // imageWidth: wx.getSystemInfoSync().windowWidth - 40,
      name: 'wemark'
    })
  },

  createNewImg: function (QD) {
    var that = this;
    var context = wx.createCanvasContext('myCanvas');
    var path = "https://xcx.upload.utan.com/article/coverimage/2018/01/25/eyJwaWMiOiIxNTE2ODU0MTg2OTY1NSIsImRvbWFpbiI6InV0YW50b3V0aWFvIn0=";

    //console.log(QD)
    //var QD = 'https://xcx.upload.utan.com/article/coverimage/2018/01/25/eyJwaWMiOiIxNTE2ODU2Nzc0Njk3OCIsImRvbWFpbiI6InV0YW50b3V0aWFvIn0=';
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0, 262, 467);

    context.drawImage(QD, 10, 390, 65, 65);
    //context.draw(true);
    //context.draw();
    context.setFillStyle('#832d3b');
    context.setFontSize(10);
    context.fillText(this.data.remainTxt1, 60, 130, 100);
    context.fillText(this.data.remainTxt3, 80, 155, 100);
    context.fillText(this.data.remainTxt5, 160, 155, 100);
    context.fillText(this.data.remainTxt6, 75, 180, 100);
    context.fillText(this.data.remainTxt8, 140, 180, 100);

    context.setFillStyle('#e24342');
    context.setFontSize(10);
    context.fillText(this.data.remainTxt2, 65, 155, 100);
    context.fillText(this.data.remainTxt4, 150, 155, 100);
    context.fillText(this.data.remainTxt7, 115, 180, 100);

    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    wx.showToast({
      title: '分享图片生成中...',
      icon: 'loading',
      duration: 1000
    });

    //绘制图片
    context.draw(false, wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          maskHidden: false
          // canvasHidden:true
        });
        wx.hideToast()
      },
      fail: function (res) {
        console.log(res);
      }
    }));
  },




});