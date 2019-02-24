//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    searchError: false,
    searchTerm: '',
    termTextList: ['Winter 2018', 'Spring 2018', 'Fall 2018', 'Winter 2019', 'Spring 2019', 'Fall 2019', 'Winter 2020', 'Spring 2020', 'Fall 2020', 'Winter 2021'],
    termCodeList: [1181, 1185, 1189, 1191, 1195, 1199, 1201, 1205, 1209, 1211],
    selectedTermIndex: 3
  },

  onLoad: function () {
    app.globalData.selectedTerm = this.data.termTextList[this.data.selectedTermIndex];
  },

  searchTermUpdate: function(e) {
    app.globalData.searchTerm = e.detail.value;
    this.setData({
      searchTerm: e.detail.value
    })
  },

  searchSubmit: function() {
    let _this = this;
    wx.cloud.callFunction({
      name: 'courselookup',
      data: {
        searchTerm: app.globalData.searchTerm,
        termCode: this.data.termCodeList[this.data.selectedTermIndex]
      }
    }).then(function (res) {
      if (!res.result.error) {
        app.globalData.searchResult = res.result;
        _this.setData({
          searchError: false,
          searchTerm: ''
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
  },

  searchClear: function() {
    this.setData({
      searchTerm: "",
      searchError: false,
    })
  },

  selectTermChange: function(e) {
    app.globalData.selectedTerm = this.data.termTextList[e.detail.value];
    this.setData({
      selectedTermIndex: e.detail.value
    })
  }
})
