// components/form.js
import utils from '../../utils/utils'
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
    importantValue: 0,
    syncToCloud: false,
    index: 1,
    index1: 1,
    array: ['25分钟', '50分钟', '75分钟', '100分钟', '125分钟', '150分钟', '175分钟', '200分钟'],
    array1: ['一般', '重要', '非常重要']
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
      const nowDate = Date.now();
      const newDate = new Date(nowDate + 1000 * 60 * 60);
      return {
        ...utils.formatTime(newDate)
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
     * @param {*} e 
     */
    bindPickerChange(e) {
      this.setData({
        index: e.detail.value
      })
    },

    /**
     * 是否重要
     * @param {*} e 
     */
    isImportant(e) {
      const isImportant = e.detail.value;
      let importantValue = 0;
      if (isImportant) {
        importantValue = 50
      }
      this.setData({
        importantValue
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