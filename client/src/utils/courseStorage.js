const saveCourse = course => {
  return new Promise((resolve, resject) => {
    wx.getStorage({
      key: 'courseList',
      success: res => {
        let key = `${course.term}${course.class_number}`;
        let newCourseList = res.data;
        newCourseList[key] = course;
        wx.setStorage({
          key: 'courseList',
          data: newCourseList,
          success: () => {resolve(true);},
          fail: () => {resolve(false);}
        });
      },
      fail: () => {
        let key = `${course.term}${course.class_number}`;
        let newCourseList = {[key]: course};
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
          let key = `${course.term}${course.class_number}`;
          newCourseList[key] = course;
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
          let key = `${course.term}${course.class_number}`;
          newCourseList[key] = course;
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

const removeCourse = (course, callback) => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'courseList',
      success: res => {
        let newCourseList = res.data;
        let key = `${course.term}${course.class_number}`;
        delete newCourseList[key];
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