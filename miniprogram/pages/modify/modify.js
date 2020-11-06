// pages/modify.js
import utils from '../../utils/utils'
// 获取数据库的引用
const db = wx.cloud.database();
const expectedList = ['25分钟', '50分钟', '75分钟', '100分钟', '125分钟', '150分钟', '175分钟', '200分钟'];
const importantList = ['一般', '重要', '非常重要'];
let flag = true;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: "新建任务",
    name: '',
    description: '',
    date: '2020-05-20',
    time: '13:14',
    expectedVal: 1,
    importantVal: 1,
    syncToCloud: false,

    expectedList,
    importantList,

    todos: [],
    index: '',
    oldTodo: {},
    nowTodo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const todos = wx.getStorageSync('todos') || [];
    let title = '新建任务'
    let index = '';
    let oldTodo = {};
    if (options.type === 'edit') {
      title = '修改任务';
      index = options.index;
      oldTodo = todos[index];
    } else {
      this.getDate()
    }
    this.setData({
      todos,
      title,
      index,
      ...oldTodo,
      oldTodo,
    })
  },

  /**
   * 获取一小时后的时间
   */
  getDate() {
    const newDate = new Date(Date.now() + 1000 * 60 * 60);
    this.setData({
      ...utils.formatTime(newDate)
    })
  },

  /**
   * 提交
   * @param {*} e 
   */
  async formSubmit(e) {
    if (flag) {
      flag = false
      let nowTodo = e.detail.value;

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
        }
      }
      nowTodo._id = await this.toCloud(nowTodo, oldTodo._id)
      this.setData({
        nowTodo
      })
      this.setStorage()
    }
    flag = true
  },

  /**
   * 判断数据是否改变
   * @param {*} origin 
   * @param {*} target 
   */
  isEq(origin, target) {
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        if (origin[key] !== target[key]) {
          return false;
        }
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
    if (!nowTodo.syncToCloud && oldId !== undefined) {
      await db.collection('todoList').doc(oldId).remove()
    } else if (nowTodo.syncToCloud && oldId !== undefined) {
      await db.collection('todoList').doc(oldId).update({
        data: nowTodo,
      })
      return oldId
    } else if(nowTodo.syncToCloud) {
      const {
        _id
      } = await db.collection('todoList').add({
        data: nowTodo
      })
      return _id
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
    wx.navigateBack()
  },

  /**
   * 监听名称修改
   * @param {*} e 
   */
  handleInputName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  /**
   * 监听描述修改
   * @param {*} e 
   */
  handleInputDescription(e) {
    this.setData({
      description: e.detail.value
    })
  },

  /**
   * 监听日期更改
   * @param {*} e 
   */
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 监听时间更改
   * @param {*} e 
   */
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },

  /**
   * 监听预计用时更改
   * @param {*} e 
   */
  bindExpectedChange(e) {
    this.setData({
      expectedVal: +e.detail.value
    })
  },

  /**
   * 监听重要等级更改
   * @param {*} e 
   */
  bindRankChange(e) {
    this.setData({
      importantVal: +e.detail.value
    })
  },
})