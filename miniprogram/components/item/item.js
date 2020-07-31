// components/item.js
Component({
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.countDown(this)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      clearTimeout(this.data.timer);
    },
  },

  /**
   * 组件的属性列表
   */
  properties: {
    todo: {
      type: Object,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    todo: {},
    timer: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取剩余秒数
     * @param {*} todo 
     */
    getLeftDate(todo) {
      const nowDate = new Date().getTime()
      const endDate = new Date(`${todo.date} ${todo.time}`).getTime();
      const leftDate = Math.floor((endDate - nowDate) / 1000)
      return leftDate
    },

    /**
     * 获取剩余时间
     * @param {*} leftDate 
     */
    getLeftTime(leftDate) {

      let leftTime = {};
      if (leftDate > 0) {
        const days = parseInt(leftDate / (60 * 60 * 24));
        const hours = parseInt(leftDate % (60 * 60 * 24) / 3600);
        const mins = parseInt(leftDate % (60 * 60 * 24) % 3600 / 60);
        const secs = parseInt(leftDate % (60 * 60 * 24) % 3600 % 60);
        leftTime = {
          days: this.timeFormat(days),
          hours: this.timeFormat(hours),
          mins: this.timeFormat(mins),
          secs: this.timeFormat(secs)
        }
      } else {
        leftTime = {
          days: '00',
          hours: '00',
          mins: '00',
          secs: '00'
        }
      }
      return leftTime
    },

    /**
     * 日期格式化函数
     */
    timeFormat: num => num.toString().padStart(2, "0"),

    /**
     * 获取短时间
     */
    getShortTime: (leftTime) => {
      let shortTime;
      if (leftTime.days > 0) {
        shortTime = leftTime.days + ' D'
      } else if (leftTime.hours > 0) {
        shortTime = leftTime.hours + ' H'
      } else if (leftTime.mins > 0) {
        shortTime = leftTime.mins + ' M'
      } else {
        shortTime = leftTime.secs + ' S'
      }
      return shortTime;
    },

    /**
     * 判断任务是否紧急
     */
    isUrgent: (leftDate) => leftDate < 60 * 60 ? true : false,

    /**
     * 倒计时
     * @param {*} that 
     */
    countDown(that) {
      // console.log(that.data.todo.isHidden)
      clearTimeout(that.data.timer);
      const todo = that.data.todo
      const leftDate = that.getLeftDate(todo)
      todo.times = that.getLeftTime(leftDate)
      todo.shortTime = that.getShortTime(todo.times)
      todo.urgent = that.isUrgent(leftDate)
      const timer = setTimeout(that.countDown, 1000, that);
      that.setData({
        timer,
        todo
      });
    },

    /**
     * 展示更多信息
     */
    showMore: function () {
      console.log('showMore')
      const todo = this.data.todo
      todo.isHidden = !todo.isHidden
      this.setData({
        todo
      })
      // this.triggerEvent('showMore')
    },

    /**
     * 删除任务
     */
    delete: function () {
      console.log('delete')
      this.triggerEvent('delete')
    },

    /**
     * 修改任务
     */
    modify: function () {
      const flag = !this.data.todo.isHidden
      if (flag) {
        console.log('modify')
        this.triggerEvent('modify')

      }
    }
  },
  options: {
    addGlobalClass: true
  },
})