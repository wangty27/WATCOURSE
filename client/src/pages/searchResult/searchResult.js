const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: null,
    title: null,
    resultTime: null
  },
  onLoad: function (options) {
    let result = app.globalData.searchResult;
    let resultTime = [];
    let index = 0;
    result = result.map(e => {
      let subIndex = 0;
      resultTime.push([]);
      if (e.held_with.length === 0) {
        e.held_with = "None";
      }
      if (!e.note) {
        e.note = false;
      }
      if (e.reserves.length === 0) {
        e.reserves = false;
      }
      e.classes = e.classes.map(c => {
        resultTime[index].push([false, false, false, false, false]);
        let weekdays = c.date.weekdays;
        if (c.instructors.length === 0) {
          c.instructors = ['TBA'];
        }
        if (!c.location.building || !c.location.room) {
          c.location = false;
        }
        c.date.start_time = c.date.start_time ? c.date.start_time : 'TBA'
        c.date.end_time = c.date.end_time ? c.date.end_time : 'TBA'
        if (weekdays) {
          for (let i = 0; i < weekdays.length; ++i) {
            switch (weekdays[i]) {
              case 'M': {
                resultTime[index][subIndex][0] = true;
                break;
              }
              case 'T': {
                if (weekdays[i + 1] === 'h') {
                  resultTime[index][subIndex][3] = true;
                } else {
                  resultTime[index][subIndex][1] = true;
                }
                break;
              }
              case 'W': {
                resultTime[index][subIndex][2] = true;
                break;
              }
              case 'F': {
                resultTime[index][subIndex][4] = true;
                break;
              }
              default: {
                break;
              }
            }
          }
        }
        subIndex += 1;
        return c;
      });
      index += 1;
      return e;
    });
    this.setData({
      result,
      resultTime,
      header: {
        code: `${result[0].subject} ${result[0].catalog_number}`,
        title: `${result[0].title}`,
        note: `${result[0].note}`,
        heldWith: `${result[0].held_with}`,
        units: `${result[0].units}`,
        update: `${result[0].last_updated.substring(0, 10)}`,
        term: app.globalData.selectedTerm
      }
    })
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },

  checkWeekday: function (weekdays, day) {
    console.log(weekdays.includes(day));
    return weekdays.includes(day);
  }
})