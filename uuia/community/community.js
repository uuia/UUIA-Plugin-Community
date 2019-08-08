// pages/community/community.js
var app = getApp();

Page({

  data: {
    userid: '',
    messages: [],
    page: 0,
    isLoading: false,
    isLoggedIn: false
  },
  
  /* 进入发布消息页面 */
  deliver: function (options) {
    wx.navigateTo({
      url: 'deliver/deliver'
    })
  },

  onShow: function () {
    // 判断登录状态决定显示内容
    if (app.isLoggedIn()) {
      this.setData({
        isLoggedIn: true
      });
    } else {
      this.setData({
        isLoggedIn: false
      });
      // 未绑定直接返回
      return;
    }

    var that = this;
    this.setData({
      userid: wx.getStorageSync('stuID'),
    });
    // 从本地存储获取学号及密码
    var value = wx.getStorageSync('stuPass_eone')

    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://neuvwo.com/mini/api/messagesByPage',
      data: {
        'page': 0,
        'user_number': that.data.userid
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        that.setData({
          messages: res.data.data,
          page: 0
        });
      },
      fail: function () {

      },
      complete: function () {
        wx.hideNavigationBarLoading();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('bottom');
    var that = this;
    wx.showLoading({
      title: '玩命加载中...',
    })

    this.setData({
      page: that.data.page + 1
    })
    var messages = that.data.messages;
    wx.request({
      url: 'https://neuvwo.com/mini/api/messagesByPage',
      data: {
        'page': that.data.page,
        'user_number': that.data.userid
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        var newMessages = messages.concat(res.data.data);
        that.setData({
          messages: newMessages,
        });
      },
      fail: function () {

      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  
  /* 用户点击右上角分享 */
  onShareAppMessage: function (e) {
    var img = e.target.dataset.imgurl ? e.target.dataset.imgurl != "" : "https://ws4.sinaimg.cn/large/006tKfTcly1g100lqyfiyj30gc07ldgb.jpg";
    var that = this;　　 // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: e.target.dataset.name + " | " + e.target.dataset.content,
      path: '/pages/community/community',
      imageUrl: img,
    };
    return shareObj;
  },
})