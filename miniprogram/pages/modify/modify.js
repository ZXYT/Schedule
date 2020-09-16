// pages/modify.js
// 获取数据库的引用
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    todos: [],
    form: '',
    index: '',
    oldTodo: {},
    nowTodo: {},
    flag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const todos = wx.getStorageSync('todos') || []
    const form = this.selectComponent('#form');
    const index = options.index;
    console.log(index)
    this.setData({
      todos,
      form,
    })
    if (index) {
      this.getStorage(index);
      this.setData({
        index
      })
    }
  },

  /**
   * 获取当前任务数据
   * @param {*} index 
   */
  getStorage(index) {
    const todo = this.data.todos[index];
    this.data.form.setData({
      name: '修改任务',
      ...todo
    })
    this.setData({
      oldTodo: todo
    })
  },

  /**
   * 返回
   */
  hideForm() {
    this.backToPrev()
    wx.showToast({
      icon: 'none',
      title: '未发生修改',
    })

    // wx.showModal({
    //   title: '提示',
    //   content: '是否取消修改',
    //   success: res => {
    //     if (res.cancel) {
    //       console.log('用户点击取消')
    //       return false
    //     } else
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //       this.backToPrev()
    //     }
    //   }
    // })
  },

  /**
   * 提交
   * @param {*} e 
   */
  async submit(e) {
    const {
      flag
    } = this.data
    if (flag) {
      this.setData({
        flag: false
      })
      let nowTodo = e.detail;

      const {
        index,
        oldTodo
      } = this.data;

      if (index) {
        const isEq = this.isEq(oldTodo, nowTodo)
        if (isEq) {
          wx.showToast({
            title: '任务没有发生更改哦~',
            icon: 'none'
          });
          return;
        } else {
          nowTodo._id = await this.toCloud(nowTodo, oldTodo._id)
        }
      } else {
        nowTodo._id = await this.toCloud(nowTodo, oldTodo._id)
      }
      this.setData({
        nowTodo
      })
      this.setStorage()
    }
    this.setData({
      flag: true
    })
  },


  /**
   * 判断数据是否改变
   * @param {*} orign 
   * @param {*} target 
   */
  isEq(orign, target) {
    let newOrign = Object.getOwnPropertyNames(orign);
    const len = newOrign.length;
    for (let i = 0; i < len; i++) {
      const name = newOrign[i]
      if (orign[name] !== target[name]) {
        return false;
      }
    }
    return true;
  },

  /**
   * 同步本地数据到云
   * @param {*} nowTodo 
   * @param {*} oldId 
   */
  async toCloud(nowTodo, oldId) {
    if (!nowTodo.syncToCloud) {
      if (oldId !== undefined) {
        await db.collection('todoList').doc(oldId).remove()
      }
      return
    } else {
      console.log('同步到云')
      if (oldId !== undefined) {
        await db.collection('todoList').doc(oldId).update({
          data: nowTodo,
        })
        return oldId
      } else {
        const {
          _id: _id
        } = await db.collection('todoList').add({
          data: nowTodo
        })
        return _id
      }
    }
  },

  /**
   * 缓存数据
   */
  setStorage() {
    const {
      todos,
      nowTodo,
      index
    } = this.data
    if (index) {
      todos[index] = nowTodo
    } else {
      todos.push(nowTodo);
    }
    wx.setStorageSync('todos', todos);
    this.backToPrev();
  },

  /**
   * 返回上一页
   */
  backToPrev() {
    wx.navigateBack()
  }
})