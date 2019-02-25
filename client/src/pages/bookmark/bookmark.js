// pages/bookmark/bookmark.js
const CourseStorage = require('../../utils/courseStorage');
const Util = require('../../utils/util');

Page({
  data: {
  },

  onShow: async function (options) {
    var courseList = Object.values(await CourseStorage.getCourseList());
    var courseListTime = [];
    var index = 0;
    courseList = courseList.map(e => {
      let subIndex = 0;
      courseListTime.push([]);
      if (e.held_with.length === 0) {
        e.held_with = "None";
      }
      if (!e.note) {
        e.note = false;
      }
      if (e.reserves.length === 0) {
        e.reserves = false;
      }
      var termYear = e.term.toString().substring(1, 3);
      var termMonth = null;
      switch(e.term.toString()[3]) {
        case '1': termMonth = 'Winter'; break;
        case '5': termMonth = 'Spring'; break;
        case '9': termMonth = 'Fall'; break;
      }
      e.termText = `${termMonth} 20${termYear}`;
      e.last_updated = Util.formatTime(new Date(Date.parse(e.last_updated)));
      e.classes = e.classes.map(c => {
        courseListTime[index].push([false, false, false, false, false]);
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
                courseListTime[index][subIndex][0] = true;
                break;
              }
              case 'T': {
                if (weekdays[i + 1] === 'h') {
                  courseListTime[index][subIndex][3] = true;
                } else {
                  courseListTime[index][subIndex][1] = true;
                }
                break;
              }
              case 'W': {
                courseListTime[index][subIndex][2] = true;
                break;
              }
              case 'F': {
                courseListTime[index][subIndex][4] = true;
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
      courseList,
      courseListTime
    });
    if (this.data.courseList.length > 0) {
      this.setData({
        empty: false
      })
    } else {
      this.setData({
        empty: true
      })
    }
  },

  removeCourse: function (e) {
    let _this = this;
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '注意',
      content: '请点击确定取消收藏',
      confirmColor: '#ff0000',
      success: async res => {
        if (res.confirm) {
          var deleted = await CourseStorage.removeCourse(this.data.courseList[index]);
          if (deleted) {
            var newCourseList = this.data.courseList;
            var newCourseListTime = this.data.courseListTime;
            newCourseList.splice(index, 1);
            newCourseListTime.splice(index, 1);
            if (newCourseList.length === 0) {
              _this.setData({
                empty: true
              })
            }
            _this.setData({
              courseList: newCourseList,
              courseListTime: newCourseListTime
            })
          } else {
            console.log("fail");
          }
        }
      }
    });
  },

  refreshCourses: function () {
    if (this.data.courseList.length === 0) {
      return;
    }
    let _this = this;
    wx.showLoading({
      mask: true
    });
    const courseList = this.data.courseList;
    const courseNameList = courseList.map(course => `${course.subject}${course.catalog_number}`);
    const courseNumberList = courseList.map(course => course.class_number);
    const courseTermList = courseList.map(course => course.term);
    wx.showLoading({
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'courseListLookup',
      data: {
        courseNameList,
        courseNumberList,
        courseTermList
      }
    }).then(async res => {
      var index = 0;
      if (!res.result.error) {
        var success = await CourseStorage.saveCourseList(res.result);
        var courseList = res.result;
        var courseListTime = [];
      }
      courseList = courseList.map(e => {
        let subIndex = 0;
        courseListTime.push([]);
        if (e.held_with.length === 0) {
          e.held_with = "None";
        }
        if (!e.note) {
          e.note = false;
        }
        if (e.reserves.length === 0) {
          e.reserves = false;
        }
        var termYear = e.term.toString().substring(1, 3);
        var termMonth = null;
        switch (e.term.toString()[3]) {
          case '1': termMonth = 'Winter'; break;
          case '5': termMonth = 'Spring'; break;
          case '9': termMonth = 'Fall'; break;
        }
        e.termText = `${termMonth} 20${termYear}`;
        e.last_updated = Util.formatTime(new Date(Date.parse(e.last_updated)));
        e.classes = e.classes.map(c => {
          courseListTime[index].push([false, false, false, false, false]);
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
                  courseListTime[index][subIndex][0] = true;
                  break;
                }
                case 'T': {
                  if (weekdays[i + 1] === 'h') {
                    courseListTime[index][subIndex][3] = true;
                  } else {
                    courseListTime[index][subIndex][1] = true;
                  }
                  break;
                }
                case 'W': {
                  courseListTime[index][subIndex][2] = true;
                  break;
                }
                case 'F': {
                  courseListTime[index][subIndex][4] = true;
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
        courseList,
        courseListTime
      });
      if (this.data.courseList.length > 0) {
        this.setData({
          empty: false
        })
      } else {
        this.setData({
          empty: true
        })
      }
      wx.hideLoading();
    });
  },

  onShareAppMessage: function () {
    return {
      title: 'UW选课助手',
      path: '/pages/index/index',
      imageUrl: '../../images/share.png'
    }
  }
})