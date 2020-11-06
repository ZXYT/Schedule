// miniprogram/pages/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const index = options.index;
    this.init(index)
  },

  async init(index) {
    let todo = wx.getStorageSync('todo');
    this.setData({
      todo
    })
    if (index) {
      if (todo) {
        const res = await wx.showModal({
          title: '提示',
          content: '有任务正在进行，是否替换'
        })
        if (res.cancel) return
      }
      const todos = wx.getStorageSync('todos') || []
      todo = todos[index]
      // console.log(todos, options)

      wx.setStorage({
        key: 'todo',
        data: todo
      })
      this.setData({
        todo
      })
    }
    
  },

  /**
   * 结束任务
   */
  end() {
    wx.showModal({
      title: '警告',
      content: '是否要结束任务'
    }).then(res => {
      // console.log(res)
      if (res.confirm) {
        this.setData({
          todo: ''
        })
        wx.removeStorage({
          key: 'todo'
        })
      }
    })
  }
})