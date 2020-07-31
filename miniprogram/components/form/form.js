// components/form.js
Component({

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      const {
        date,
        time
      } = this.getDate()

      this.setData({
        date,
        time,
      })

    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    name: "新建任务",
    title: '',
    content: '',
    date: '2020-05-20',
    time: '13:14',
    isImportant: false,
    importantValue: 50,
    syncToCloud: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 隐藏表单
     */
    hideForm() {
      this.triggerEvent('hideForm')
    },

    /**
     * 获取一小时后的时间
     */
    getDate() {
      const nowDate = new Date().getTime() + 1000 * 60 * 60;
      const newDate = new Date(nowDate);
      const year = newDate.getFullYear()
      const month = newDate.getMonth() + 1
      const day = newDate.getDate()
      const hour = newDate.getHours()
      const minute = newDate.getMinutes()
      const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
      }
      const date = [year, month, day].map(formatNumber).join('-')
      const time = [hour, minute].map(formatNumber).join(':')
      return {
        date,
        time
      }
    },

    /**
     * 更改日期
     * @param {*} e 
     */
    bindDateChange(e) {
      this.setData({
        date: e.detail.value
      })
    },

    /**
     * 更改时间
     * @param {*} e 
     */
    bindTimeChange(e) {
      this.setData({
        time: e.detail.value
      })
    },

    /**
     * 是否重要
     * @param {*} e 
     */
    isImportant(e) {
      const isImportant = e.detail.value;
      this.setData({
        isImportant
      })
    },

    /**
     * 是否同步到云
     */
    syncToCloud(e) {
      const syncToCloud = e.detail.value;
      this.setData({
        syncToCloud
      })
    },

    /**
     * 提交表单
     * @param {*} e 
     */
    formSubmit(e) {
      const form = e.detail.value;
      if (!form.title) {
        wx.showToast({
          title: '还没有填写任务名称哦~',
          icon: 'none'
        });
        return;
      } else {
        const todo = {
          ...form
        }
        // console.log(todo)

        this.triggerEvent('submit', todo)
      }
    },
  },

  options: {
    addGlobalClass: true
  },
})