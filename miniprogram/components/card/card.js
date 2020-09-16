// components/card.js
import utils from '../../utils/utils'
Component({
  lifetimes: {
    attached: function () {
      this.getCompletTime()
      // this.init();
      // this.countDown()
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    title: '还需工作 ',
    todo: {
      name: '任务1',
    },
    timer: null,
    formatLeft: {
      mins: '25',
      secs: '00'
    },
    isRest: true,
    processing: false,
    n: 0,
    estimated: 0,
    cur: 0,
    postpone: 0,
    completTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getEnd(duration) {
      const now = Date.now();
      const end = now + duration * 60 * 1000;
      this.setData({
        end
      })
    },

    countDown() {
      clearTimeout(this.data.timer)

      const end = this.data.end;
      const now = Date.now();
      const left = end - now;

      if (left < 0) {
        this.next()
        console.log('time out')
        return
      }
      const timer = setTimeout(() => {
        this.countDown()
      }, 1000)
      this.setData({
        left,
        timer
      })
      this.format()
    },

    format() {
      const left = this.data.left;
      const {
        mins,
        secs
      } = utils.milliseconds2Time(left)

      this.setData({
        formatLeft: {
          mins,
          secs
        }
      })
    },

    next() {
      this.vibrate()
      let title = '休息结束'
      if (!this.data.isRest) {
        this.changeCur()
        title = '休息时间'
        this.rest()
      }
      wx.showToast({
        title,
        icon: 'none'
      })
    },

    vibrate() {
      let n = this.data.n;
      const timer = setTimeout(() => {
        wx.vibrateLong()
        this.vibrate()
      }, 1000)
      n++;
      if (n > 3) {
        n = 0
        clearTimeout(timer)
      }
      this.setData({
        n
      })
    },

    rest() {
      this.getEnd(5);
      this.countDown()
      this.setData({
        title: '休息时间 ',
        isRest: true,
        processing: false
      })
    },

    start() {
      if (this.data.processing) {
        return
      }
      if (this.data.cur >= 8) {
        wx.showToast({
          title: '时间过长请重新规划任务',
          icon: 'none',
          success(res) {
            console.log(res)
          }
        })
        return
      }
      this.changePostpone()
      this.getCompletTime()
      const end = this.getEnd(25);
      this.countDown(end)
      this.setData({
        title: '还需工作 ',
        isRest: false,
        processing: true
      })
    },

    /**
     * 中断当前进度
     */
    interrupt() {
      if (!this.data.processing) {
        return
      }
      const that = this
      wx.showModal({
        title: '警告',
        content: '中断后进度将重新开始',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.reset()
          } else if (res.cancel) {
            console.log('用户点击取消')
            return
          }
        }
      })
    },

    /**
     * 重置数据
     */
    reset() {
      clearTimeout(this.data.timer)
      this.setData({
        formatLeft: {
          mins: '25',
          secs: '00'
        },
        processing: false
      })
    },

    changePostpone() {
      let {
        cur,
        estimated,
        postpone
      } = this.data;
      if (cur >= estimated + postpone) {
        postpone++
      }
      this.setData({
        postpone
      })
    },

    changeCur() {
      let cur = this.data.cur;
      cur++;
      console.log(cur)
      this.setData({
        cur
      })
    },

    getCompletTime() {
      const estimated = this.data.estimated
      const now = Date.now();
      let completTime = now + (estimated * 30 - 5) * 60 * 1000;
      completTime = new Date(completTime)
      const date = utils.formatTime(completTime)
      console.log(date)
      this.setData({
        completTime: date
      })
    }
  },
  options: {
    addGlobalClass: true
  },
})