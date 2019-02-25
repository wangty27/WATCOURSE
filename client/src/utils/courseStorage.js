const saveCourse = course => {
  return new Promise((resolve, resject) => {
    wx.getStorage({
      key: 'courseList',
      success: res => {
        let courseNumber = course.class_number;
        let newCourseList = res.data;
        newCourseList[courseNumber] = course;
        wx.setStorage({
          key: 'courseList',
          data: newCourseList,
          success: () => {resolve(true);},
          fail: () => {resolve(false);}
        });
      },
      fail: () => {
        let courseNumber = course.class_number;
        let newCourseList = {[courseNumber]: course};
        wx.setStorage({
          key: 'courseList',
          data: newCourseList,
          success: () => {resolve(true);},
          fail: () => {resolve(false);}
        })
      }
    });
  });
};

const saveCourseList = courseList => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'courseList',
      success: res => {
        let newCourseList = res.data;
        for (course of courseList) {
          newCourseList[course.class_number] = course;
        }
        wx.setStorage({
          key: 'courseList',
          data: newCourseList,
          success: () => {resolve(true);},
          fail: () => {resolve(false);}
        });
      },
      fail: () => {
        let newCourseList = {};
        for (course of courseList) {
          newCourseList[course.class_number] = course;
        }
        wx.setStorage({
          key: 'courseList',
          data: newCourseList,
          success: () => {resolve(true);},
          fail: () => {resolve(false);}
        })
      }
    });
  });
}

const getCourseList = () => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'courseList',
      success: res => {resolve(res.data);},
      fail: () => {resolve({});}
    })
  });
};

const removeCourse = (courseNumber, callback) => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'courseList',
      success: res => {
        let newCourseList = res.data;
        delete newCourseList[courseNumber];
        wx.setStorage({
          key: 'courseList',
          data: newCourseList,
          success: () => {resolve(true);},
          fail: () => {resolve(false);}
        })
      },
      fail: () => {resolve(false);}
    });
  });
};

module.exports = {
  saveCourse,
  saveCourseList,
  getCourseList,
  removeCourse
}