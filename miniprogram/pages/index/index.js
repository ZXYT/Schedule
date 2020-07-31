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
    icon: '+'
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let todoList = wx.getStorageSync('todos') || []
    todoList.forEach(item => {
      item.isHidden = true
    })
    this.setData({
      todoList,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.dbQuery()
  },

  showMore(e) {
    // const {
    //   todoList,
    //   lastindex
    // } = this.data
    // const index = e.target.dataset.index
    // if (index !== lastindex) {
    //   todoList[lastindex].isHidden = true;
    // }
    // todoList[index].isHidden = !todoList[index].isHidden;
    // this.setData({
    //   todoList,
    //   lastindex: index
    // })
  },

  /**
   * 编辑任务
   * @param {*} e 
   */
  modify(e) {
    const index = e.target.dataset.index;
    wx.navigateTo({
      url: `/pages/modify/modify?index=${index}`,
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
    const id = todoList[index].id
    console.log(index, id)

    wx.showModal({
      title: '警告',
      content: '确认是否删除',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          todoList.splice(index, 1)
          this.setData({
            todoList
          })
          wx.setStorageSync('todos', todoList);
          if (id) {
            console.log('id:', id)
            this.dbDelete(id)
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
          return false
        }
      }
    })
  },

  /**
   * 从云端获取数据
   */
  async dbQuery() {
    const {
      data
    } = await db.collection('todoList').get()
    wx.stopPullDownRefresh()
    this.isSync(data)
  },

  /**
   * 删除云端数据
   * @param {*} id 
   */
  async dbDelete(id) {
    await db.collection('todoList').doc(id).remove()
  },

  /**
   * 是否同步云端数据
   * @param {*} data 
   */
  async isSync(data) {
    const len = data.length
    if (len) {
      wx.showModal({
      title: '提示',
      content: `在云端查询到${len}条数据，是否同步`,
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.syncData(data)
        } else if (res.cancel) {
          console.log('用户点击取消')
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
    let todoList = this.data.todoList;
    if (!todoList.length) {
      todoList = cloudList
    } else {
      todoList.forEach((ele, i) => {
        cloudList.forEach((cloudEle, j) => {
          if (ele.id === cloudEle.id) {
            todoList[i] = cloudEle
            cloudList.splice(j, 1);
          }
        })
      })
      todoList.push(...cloudList)
    }
    console.log(todoList)
    this.setData({
      todoList
    })
    wx.setStorageSync('todos', todoList)
  },
})