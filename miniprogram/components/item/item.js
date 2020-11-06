// components/item.js
import utils from '../../utils/utils'
Component({
  lifetimes: {
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      // console.log('detached')
      clearTimeout(this.data.timer);
    },
  },
  pageLifetimes: {
    hide: function () {
      clearTimeout(this.data.timer);
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
    },
    duration: {
      type: Number,
      value: 1000
    }
  },

  observers: {
    'item.date, item.time': function() {
      this.countDown()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    todo: {},
    timer: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取短时间
     */
    getShortTime: (leftTime) => {
      let shortTime;
      if (leftTime.days > 0) {
        shortTime = `${leftTime.days}D ${leftTime.hours}H`
      } else if (leftTime.hours > 0) {
        shortTime = `${leftTime.hours}H ${leftTime.mins}M`
      } else {
        shortTime = `${leftTime.mins}M ${leftTime.secs}S`
      }
      return shortTime;
    },

    /**
     * 倒计时
     * @param {*} that 
     */
    countDown() {
      // console.log(this.data.todo.isHidden)
      clearTimeout(this.data.timer);
      const todo = this.properties.item;
      const endDate = new Date(`${todo.date} ${todo.time}`).getTime();
      const leftDate = endDate - Date.now();
      todo.times = utils.milliseconds2Time(leftDate);
      todo.shortTime = this.getShortTime(todo.times);
      todo.urgent = leftDate < 60 * 60 * 1000;
      const timer = setTimeout(() => {
        if (leftDate > 0) {
          this.countDown()
        }
      }, this.properties.duration);
      this.setData({
        todo,
        timer
      });
    },

    /**
     * 展示更多信息
     */
    showMore: function () {
      // console.log('showMore')
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
      // console.log('delete')
      this.triggerEvent('delete')
    },

    /**
     * 编辑任务
     */
    edit: function () {
      if (this.data.todo.isHidden) {
        // console.log('edit')
        this.triggerEvent('edit')
      }
    },
    start: function() {
      this.triggerEvent('start')
    }
  },
  options: {
    addGlobalClass: true
  },
})