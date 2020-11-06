// components/card.js
import utils from '../../utils/utils';
let n = 0;
Component({
  lifetimes: {
    attached: function () {
      this.getCompletTime()
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
    todo: {
      type: Object,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: '未开始',
    timer: null,
    left: {
      mins: '25',
      secs: '00'
    }, //剩余时间
    isStart: false, //是否开始

    cur: 0, //当前进度
    completTime: '', //预计完成时间
    postpone: 0 //超时次数
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取结束时间
     * @param {*} duration 
     */
    getEnd(duration) {
      const end = Date.now() + duration * 60 * 1000;
      this.setData({
        end
      })
    },

    /**
     * 倒计时
     */
    countDown() {
      clearTimeout(this.data.timer)

      const end = this.data.end;
      const left = end - Date.now();
      const {
        mins,
        secs
      } = utils.milliseconds2Time(left)
      if (left < 0) {
        this.next()
        // console.log('time out')
        return
      }
      // console.log(timer)
      const timer = setTimeout(() => {
        this.countDown()
      }, 1000)

      this.setData({
        left: {
          mins,
          secs
        },
        timer
      })
    },

    /**
     * 计时结束后的动作
     */
    next() {
      this.vibrate()
      let title = '休息结束'
      if (this.data.isStart) {
        this.changeCur()
        title = '休息时间'
        this.rest()
      }
      wx.showToast({
        title,
        icon: 'none'
      })
    },

    /**
     * 震动提示
     */
    vibrate() {
      const timer = setTimeout(() => {
        wx.vibrateLong()
        this.vibrate()
      }, 1000)
      n++;
      if (n > 3) {
        n = 0
        clearTimeout(timer)
      }
    },

    /**
     * 开始休息
     */
    rest() {
      this.getEnd(5);
      this.countDown()
      this.setData({
        title: '休息时间',
        isStart: false,
      })
    },

    /**
     * 监听点击事件
     */
    handleTap() {
      let isStart = this.data.isStart;
      if (isStart) {
        this.interrupt() //中断
      } else {
        this.start() //开始
      }
    },

    /**
     * 开始任务
     */
    start() {
      if (this.data.cur >= 7) {
        wx.showToast({
          title: '用时过长请重新规划任务',
          icon: 'none',
        })
        return
      }
      this.changePostpone()
      // this.getCompletTime()
      this.getEnd(25);
      this.countDown()
      this.setData({
        title: '还需工作',
        isStart: true
      })
    },

    /**
     * 中断当前进度
     */
    interrupt() {
      wx.showModal({
        title: '警告',
        content: '中断后进度将重新开始',
      }).then(res => {
        if (res.confirm) this.reset()
      })
    },

    /**
     * 重置数据
     */
    reset() {
      clearTimeout(this.data.timer)
      this.setData({
        left: {
          mins: '25',
          secs: '00'
        },
        title: '未开始',
        isStart: false
      })
    },

    /**
     * 判断是否超时
     */
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

    /**
     * 改变当前进度
     */
    changeCur() {
      let cur = this.data.cur;
      cur++;
      // console.log(cur)
      this.setData({
        cur
      })
    },

    /**
     * 预计结束时间
     */
    getCompletTime() {
      // console.log(this.data.todo)
      const expectedVal = +this.data.todo.expectedVal + 1;
      const completTime = new Date(Date.now() + (expectedVal * 30 - 5) * 60 * 1000);
      const {
        date,
        time
      } = utils.formatTime(completTime)
      this.setData({
        completTime: `${date} ${time}`
      })
    },

    handleTapEnd() {
      clearTimeout(this.data.timer)
      this.triggerEvent('end')
    }
  },
})