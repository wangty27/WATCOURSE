// 云函数入口文件
const cloud = require('wx-server-sdk');
const requestP = require('request-promise');

const APIKEY = require('./APIKEY');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var number = event.courseNumber;
  const result = JSON.parse(await requestP(`https://tianyu.wang/api/courseNumberLookup/${number}?key=${APIKEY}`));

  return result;
}