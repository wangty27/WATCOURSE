// 云函数入口文件
const cloud = require('wx-server-sdk');
const requestP = require('request-promise');

const APIKEY = require('./APIKEY');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var courseList = event.courseNameList.join(',');
  var numberList = event.courseNumberList.join(',');
  var termList = event.courseTermList.join(',');
  const result = JSON.parse(await requestP(`https://tianyu.wang/api/courseListLookup/${courseList}/${numberList}/${termList}?key=${APIKEY}`));

  return result;
}