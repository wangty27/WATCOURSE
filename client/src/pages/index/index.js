//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    searchError: false
  },

  onLoad: function () {
  },

  searchTermUpdate: function(e) {
    app.globalData.searchTerm = e.detail.value;
  },

  searchSubmit: function() {
    let _this = this;
    wx.cloud.callFunction({
      name: 'courselookup',
      data: {
        searchTerm: app.globalData.searchTerm
      }
    }).then(function (res) {
      if (!res.result.error) {
        app.globalData.searchResult = res.result;
        _this.setData({
          searchError: false
        })
        wx.navigateTo({
          url: '../searchResult/searchResult',
        })
      } else {
        _this.setData({
          searchError: true
        })
      }
    });
    // wx.navigateTo({
    //   url: '../searchResult/searchResult',
    // })
  }
})
