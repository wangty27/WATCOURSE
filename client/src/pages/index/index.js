//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
  },

  onLoad: function () {
  },

  searchTermUpdate: function(e) {
    app.globalData.searchTerm = e.detail.value;
  },

  searchSubmit: function() {
    wx.cloud.callFunction({
      name: 'courselookup',
      data: {
        searchTerm: app.globalData.searchTerm
      }
    }).then(function (res) {
      if (!res.result.error) {
        app.globalData.searchResult = res.result;
        wx.navigateTo({
          url: '../searchResult/searchResult',
        })
      } else {
        console.log('error');
      }
    });
    // wx.navigateTo({
    //   url: '../searchResult/searchResult',
    // })
  }
})
