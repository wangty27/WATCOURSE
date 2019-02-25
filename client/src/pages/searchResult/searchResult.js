const app = getApp();
const CourseStorage = require('../../utils/courseStorage');
const Util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: null,
    title: null,
    resultTime: null
  },

  onShow: async function (options) {
    var result = app.globalData.searchResult;
    var resultTime = [];
    var bookmarkList = [];
    var index = 0;
    var storedCourseList = await CourseStorage.getCourseList();
    result = result.map(e => {
      bookmarkList.push(storedCourseList.hasOwnProperty(`${e.term}${e.class_number}`));
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
      bookmarkList,
      header: {
        code: `${result[0].subject} ${result[0].catalog_number}`,
        title: `${result[0].title}`,
        note: `${result[0].note}`,
        heldWith: `${result[0].held_with}`,
        units: `${result[0].units}`,
        update: `${Util.formatTime(new Date(Date.parse(result[0].last_updated)))}`,
        term: app.globalData.selectedTerm
      }
    });
  },

  toggleBookmark: async function(e) {
    let _this = this;
    const {course, index} = e.currentTarget.dataset;
    let newBookmarkList = this.data.bookmarkList;
    let bookmarked = newBookmarkList[index];
    if (!bookmarked) {
      let success = await CourseStorage.saveCourse(course);
      if (success) {
        newBookmarkList[index] = !newBookmarkList[index];
        _this.setData({
          bookmarkList: newBookmarkList
        })
      } else {
        console.log('save fail');
      }
    } else {
      let success = await CourseStorage.removeCourse(course.class_number);
      if (success) {
        newBookmarkList[index] = !newBookmarkList[index];
        _this.setData({
          bookmarkList: newBookmarkList
        })
      } else {
        console.log('remove fail');
      }
    }
  }
})