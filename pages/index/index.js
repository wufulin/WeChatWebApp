//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    hasEmptyGrid: false
  },

  //控制scroll-view高度
  getSystemInfo: function(){
    try{
      const res=wx.getSystemInfoSync();
      this.setData({
        scrollViewHeight:res.windowHeight*res.pixelRatio
      });
    }catch(e){
      console.log(e);
    }
  },

  //获取当月共有多少天
  getThisMonthDays: function(year, month){
    return new Date(year,month,0).getDate();
  },

  //获取当月第一天星期几
  getFirstDayOfWeek(year, month){
    return new Date(Date.UTC(year, month-1,1)).getDay();
  },

  // 计算当月1号前空了几个格子
  calculateEmptyGrids: function(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },

 // 绘制当月天数占的格子
  calculateDays: function(year, month) {
    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }
    this.setData({
      days
    });
  },


  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
    var that = this
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    const cur_day = date.getDate();

    that.calculateEmptyGrids(cur_year, cur_month);
    that.calculateDays(cur_year, cur_month);
    that.getSystemInfo();
    that.setData({
      cur_year:cur_year,
      cur_month:cur_month,
      cur_day:cur_day,
      weeks_ch:weeks_ch
    });
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },

  // 切换控制年月
  handleCalendar: function(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });
    }
    let d=new Date();
    if(this.data.cur_year==d.getFullYear() && this.data.cur_month==d.getMonth()+1){
      this.setData({cur_day:d.getDate()});
    }else{
      this.setData({cur_day:-1});
    }
  },

  onShareAppMessage: function() {
    return {
      title: '小程序日历',
      desc: '还是新鲜的日历哟',
      path: 'pages/index/index'
    }
  }
})
