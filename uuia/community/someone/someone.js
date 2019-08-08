// pages/community/someone/someone.js
import Dialog from '../../../dist_vant/dialog/dialog';
import Toast from '../../../dist_vant/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: '',
    res: '',
    remove: 0,

    user_number: '',
    show: 0,
  },

  // 查看个人头像大图
  handleImagePreview1(e) {
    var urls = [];
    urls.push(e.target.dataset.current);
    wx.previewImage({
      current: e.target.dataset.current,
      urls: urls,
    })
  },

  refresh() {
    var that = this;
    wx.request({
      url: 'https://neuvwo.com/mini/api/messagesById',
      data: {
        'user_number': that.data.user_number,
        'user_number2': that.data.userid
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        that.setData({
          res: res.data.data,
          page: 0,
          show: 1
        });
      },
      fail: function () {

      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userid: wx.getStorageSync('stuID'),
      user_number: options.user_number,
      remove: options.remove
    });
    wx.showLoading({
      title: '玩命加载中...',
    })

    this.refresh();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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