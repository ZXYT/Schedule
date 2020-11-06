// pages/index/index.js
// 获取数据库的引用
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    todoList: [],
    lastindex: 0,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const todoList = wx.getStorageSync('todos') || []
    this.setData({
      todoList,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData()
  },

  // showMore(e) {
  //   const {
  //     todoList,
  //     lastindex
  //   } = this.data
  //   const index = e.target.dataset.index
  //   if (index !== lastindex) {
  //     todoList[lastindex].isHidden = true;
  //   }
  //   todoList[index].isHidden = !todoList[index].isHidden;
  //   this.setData({
  //     todoList,
  //     lastindex: index
  //   })
  // },

  /**
   * 编辑任务
   * @param {*} e 
   */
  edit(e) {
    const index = e.target.dataset.index;
    wx.navigateTo({
      url: `/pages/modify/modify?type=edit&index=${index}`,
    })
  },

  /**
   * 删除数据
   * @param {*} e 
   */
  delete(e) {
    const index = e.target.dataset.index;
    const {
      todoList
    } = this.data
    const _id = todoList[index]._id
    // console.log(index, _id)

    wx.showModal({
      title: '警告',
      content: '确认是否删除',
      success: res => {
        if (res.confirm) {
          // console.log('用户点击确定')
          todoList.splice(index, 1)
          this.setData({
            todoList
          })
          wx.setStorageSync('todos', todoList);
          if (_id) {
            console.log('_id:', _id)
            this.dbDelete(_id)
          }
        } else if (res.cancel) {
          // console.log('用户点击取消')
          return false
        }
      }
    })
  },

  start(e) {
    const index = e.target.dataset.index;
    wx.reLaunch({
      url: `/pages/current/current?index=${index}`
    })
  },

  /**
   * 从云端获取数据
   */
  async getData() {
    const {
      data
    } = await db.collection('todoList').get()
    wx.stopPullDownRefresh()
    this.isSync(data)
  },

  /**
   * 删除云端数据
   * @param {*} _id 
   */
  dbDelete(_id) {
    db.collection('todoList').doc(_id).remove()
  },

  /**
   * 是否同步云端数据
   * @param {*} data 
   */
  isSync(data) {
    const len = data.length
    if (len) {
      wx.showModal({
        title: '提示',
        content: `在云端查询到${len}条数据，是否同步`,
        success: res => {
          if (res.confirm) {
            // console.log('用户点击确定')
            this.syncData(data)
          } else if (res.cancel) {
            // console.log('用户点击取消')
            return false
          }
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '没有查询到数据',
      })
    }
  },

  /**
   * 同步云端数据
   */
  syncData(cloudList) {
    let {
      todoList
    } = this.data;
    if (todoList.length === 0) {
      todoList = cloudList
    } else {
      todoList.forEach((ele, i) => {
        cloudList.forEach((cloudEle, j) => {
          if (ele._id === cloudEle._id) {
            todoList[i] = cloudEle
            cloudList.splice(j, 1);
          }
        })
      })
      todoList.push(...cloudList)
    }
    // console.log(todoList)
    this.setData({
      todoList
    })
    wx.setStorageSync('todos', todoList)
  },
})