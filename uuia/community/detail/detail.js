// pages/community/detail/detail.js
import Toast from '../../../dist_vant/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_type: '',
    like_status: '',
    comment_number: 0,
    like_number: 0,
    message_id: '',
    time: '',
    content: '',
    user_number: '',
    user_name: '',
    user_img: '',
    image_url1: '',
    image_url2: '',
    image_url3: '',
    image_num: 0,
    message_type: '',
    link_url: '',
    description: '',

    userid: '',
    comments: [],
    likes: [],
    active: 0,
    value: ''
  },

  onChange(event) {
    this.setData({
      value: event.detail
    })
  },

  handle() {
    var that = this;
    if (that.data.value == "") {
      Toast('还没输入消息呦~');
      return false;
    }
    if (that.data.value.length > 240) {
      Toast('不能超过240字呦~');
      return false;
    }
    return true;
  },
  
  send: function () {
    var that = this;
    if (!that.handle()) {
      return;
    };
    console.log(that.data.userid + " " + that.data.value);
    wx.showLoading({
      title: '发布中',
    })

    wx.request({
      url: 'https://neuvwo.com/mini/api/addComment',
      data: {
        'message_id': that.data.message_id,
        'content': that.data.value,
        'user_number': that.data.userid
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        Toast.success('发布成功');
        var tempNumber = parseInt(that.data.comment_number) + 1;
        that.setData({
          value: '',
          comment_number: tempNumber
        })
      },
      fail: function () {
        Toast.success('发布失败');
      },
      complete: function () {
        wx.hideLoading();
        that.onShow();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      userid: wx.getStorageSync('stuID'),
      user_type: options.user_type,
      like_status: options.like_status,
      comment_number: options.comment_number,
      like_number: options.like_number,
      message_id: options.message_id,
      time: options.time,
      time2: options.time2,
      content: options.content,
      user_number: options.user_number,
      user_name: options.user_name,
      user_img: options.user_img,
      image_url1: options.image_url1,
      image_url2: options.image_url2,
      image_url3: options.image_url3,
      image_num: options.image_num,
      message_type: options.message_type,
      link_url: options.link_url,
      description: options.description,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: 'https://neuvwo.com/mini/api/commentsByMessageId',
      data: {
        message_id: that.data.message_id,
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log(res.data);
        that.setData({
          comments: res.data.data,
        });
      },
      complete: function (res) {
        
      }
    }),
      wx.request({
        url: 'https://neuvwo.com/mini/api/likesByMessageId',
        data: {
          message_id: that.data.message_id,
        },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          console.log(res.data);
          that.setData({
            likes: res.data.data,
          });
        },
        complete: function (res) {

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