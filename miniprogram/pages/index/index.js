// miniprogram/pages/index.js
const app = getApp()
// 获取数据库的引用
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  add() {
    const data = {
      name: 'test'
    }
    db.collection('todoList').add({
      data
    }).then(res => {
        console.log(res)
        const id = res._id;
        this.setData({
          id
        })
      },
      err => {
        console.error(err)
      }
    )
  },
  delete() {
    const id = this.data.id;
    db.collection('todoList').doc(id).remove().then(res => {
        console.log(res)
      },
      err => {
        console.error(err)
      }
    )
  },
  update() {
    const id = this.data.id;
    const data = {
      name: 'test1'
    }
    db.collection('todoList').doc(id).update({
      data,
    }).then(res => {
        console.log(res)
      },
      err => {
        console.error(err)
      }
    )
  },
  get() {
    db.collection('todoList').get().then(res => {
        console.log(res)
      },
      err => {
        console.error(err)
      }
    )
  }
})