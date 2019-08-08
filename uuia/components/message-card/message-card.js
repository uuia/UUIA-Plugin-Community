// components/message-card/message-card.js
import Dialog from '../../dist_vant/dialog/dialog';
import Toast from '../../dist_vant/toast/toast';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    user_number: {
      type: String,
      value: 'info'
    },
    user_img: {
      type: String,
      value: 'info'
    },
    user_name: {
      type: String,
      value: 'info'
    },
    user_type: {
      type: String,
      value: 'info'
    },
    time: {
      type: String,
      value: 'info'
    },
    time2: {
      type: String,
      value: 'info'
    },
    content: {
      type: String,
      value: 'info'
    },
    image_url1: {
      type: String,
      value: 'info'
    },
    image_url2: {
      type: String,
      value: 'info'
    },
    image_url3: {
      type: String,
      value: 'info'
    },
    message_type: {
      type: String,
      value: 'info'
    },
    link_url: {
      type: String,
      value: 'info'
    },
    description: {
      type: String,
      value: 'info'
    },
    like_number: {
      type: String,
      value: 'info'
    },
    comment_number: {
      type: String,
      value: 'info'
    },
    like_status: {
      type: String,
      value: 'info'
    },
    message_id: {
      type: String,
      value: 'info'
    },
    index: {
      type: String,
      value: 'info'
    },
    remove: {
      type: Number,
      value: 0
    },
    userid: {
      type: String,
      value: 'info'
    }
  },
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的初始数据
   */
  data: {
    userid: '',
    like_status: '',
    show: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 长按复制文本
    longTap(e) {
      console.log(e)
      wx.setClipboardData({
        data: e.currentTarget.dataset.text,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })
            }
          })
        }
      })
    },

    // 查看大图
    handleImagePreview(e) {
      console.log(e)
      var urls = [];
      if (e.target.dataset.pic1 != "")
        urls.push(e.target.dataset.pic1);
      if (e.target.dataset.pic2 != "")
        urls.push(e.target.dataset.pic2);
      if (e.target.dataset.pic3 != "")
        urls.push(e.target.dataset.pic3);
      wx.previewImage({
        current: e.target.dataset.current,
        urls: urls,
      })
    },

    /* 点赞 */
    like: function (options) {
      console.log(options);
      var that = this;
      var tempNumber = parseInt(that.properties.like_number) + 1
      that.setData({
        like_status: 1,
        like_number: tempNumber
      });
      this.setData({
        userid: wx.getStorageSync('stuID'),
      });
      wx.request({
        url: 'https://neuvwo.com/mini/api/like',
        data: {
          'message_id': options.currentTarget.dataset.message_id,
          'user_number': that.data.userid
        },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          // console.log(res);
        },
        fail: function () {

        },
        complete: function () {

        }
      })
    },

    /* 取消赞 */
    dislike: function (options) {
      console.log(options);
      var that = this;
      var tempNumber = parseInt(that.properties.like_number) - 1
      that.setData({
        like_status: 2,
        like_number: tempNumber
      });
      this.setData({
        userid: wx.getStorageSync('stuID'),
      });
      wx.request({
        url: 'https://neuvwo.com/mini/api/dislike',
        data: {
          'message_id': options.currentTarget.dataset.message_id,
          'user_number': that.data.userid
        },
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          // console.log(res);
        },
        fail: function () {

        },
        complete: function () {

        }
      })
    },

    /* 删除 */
    remove(options) {
      var that = this;
      this.setData({
        userid: wx.getStorageSync('stuID'),
      });
      Dialog.confirm({
        title: '删除',
        message: '您确定要删除这条消息嘛？'
      }).then(() => {
        console.log('确定')
        console.log(options.currentTarget.dataset.message_id);
        console.log(that.data.userid);
        wx.request({
          url: 'https://neuvwo.com/mini/api/deleteMessageById',
          data: {
            'message_id': options.currentTarget.dataset.message_id,
            'user_number': that.data.userid
          },
          method: 'POST',
          dataType: 'json',
          success: function (res) {
            console.log(res);
            Toast.success('删除成功');
            that.setData({
              show: false
            })
          },
          fail: function () {
            Toast.fail('删除失败');
          },
          complete: function (res) {
            // Toast.clear();
            // console.log(res);
          }
        }).catch(() => {
          console.log('取消')
        });
      })
    },

    /* 合法网页跳转 */
    linkTo(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    },
  }
})
