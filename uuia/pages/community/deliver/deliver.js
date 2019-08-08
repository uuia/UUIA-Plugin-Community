// pages/community/deliver/deliver.js
import Toast from '../../../dist_vant/toast/toast';
import {
  promisify
} from '../../../utils/promise.util'
import {
  $init,
  $digest
} from '../../../utils/common.util'
const qiniuUploader = require("../../../utils/qiniuUploader.js");
// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'ECN', // 华东区
    uptokenURL: 'https://neuvwo.com/mini/api/qiniu',
    uploadURL: 'https://up.qbox.me',
    domain: 'http://qiniu.weneu.xyz/'
  };
  qiniuUploader.init(options);
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    value: '', // 消息内容
    userid: '', // 用户id
    images: [], // 微信图片临时地址
    uptoken: '',
    imageObject1: "",
    imageObject2: "",
    imageObject3: "",

    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ifValid: true,
    avatarUrl: ""
  },

  onChange(event) {
    this.setData({
      value: event.detail
    })
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        this.data.images = images.length <= 3 ? images : images.slice(0, 3)
        $digest(this)
      }
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
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

  send: function() {
    var that = this;
    if (!that.handle()) {
      return;
    };
    console.log(that.data.userid + " " + that.data.value);
    wx.showLoading({
      title: '发布中',
    })

    // 将图片上传到图床，返回网络地址
    if (that.data.images[0] != null) {
      initQiniu();
      qiniuUploader.upload(that.data.images[0], (res) => {
        that.setData({
          "imageObject1": res.imageURL
        });

        if (that.data.images[1] != null) {
          initQiniu();
          qiniuUploader.upload(that.data.images[1], (res) => {
            that.setData({
              "imageObject2": res.imageURL
            });

            if (that.data.images[2] != null) {
              initQiniu();
              qiniuUploader.upload(that.data.images[2], (res) => {
                that.setData({
                  "imageObject3": res.imageURL
                });
                that.upload();
              }, (error) => {
                console.error('error: ' + JSON.stringify(error));
              });
            } else {
              that.upload();
            }
          }, (error) => {
            console.error('error: ' + JSON.stringify(error));
          });
        } else {
          that.upload();
        }
      }, (error) => {
        console.error('error: ' + JSON.stringify(error));
      });
    } else {
      that.upload();
    }
  },

  upload() {
    var that = this;
    initQiniu();
    wx.request({
      url: 'https://neuvwo.com/mini/api/addMessage',
      data: {
        'user_number': that.data.userid,
        'content': that.data.value,
        'image_num': that.data.images.length,
        'image_url1': that.data.imageObject1,
        'image_url2': that.data.imageObject2,
        'image_url3': that.data.imageObject3,
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        // Toast.success('发布成功');
        wx.switchTab({
          url: '../community'
        })
      },
      fail: function() {
        Toast.success('发布失败');
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },

  updateImg() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res.userInfo)
              that.setData({
                "avatarUrl": res.userInfo.avatarUrl
              })
              wx.request({
                url: 'https://neuvwo.com/mini/api/updateImg',
                data: {
                  'user_number': that.data.userid,
                  'user_img': that.data.avatarUrl,
                },
                method: 'POST',
                dataType: 'json',
                success: function(res) {
                  console.log(res.data);
                },
              })
            },
          })
        }
      },
    });
  },

  bindGetUserInfo: function(e) {
    console.log(e.detail.userInfo)
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            ifValid: true
          })
        } else {
          that.setData({
            ifValid: false
          })
        }
      }
    })
    this.setData({
      userid: wx.getStorageSync('stuID'),
    });
    $init(this);
    this.updateImg();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})