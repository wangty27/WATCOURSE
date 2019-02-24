// 云函数入口文件
const cloud = require('wx-server-sdk');
const requestP = require('request-promise');

const APIKEY = require('../APIKEY');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var subject = event.searchTerm.replace(/[0-9]/g, '').replace(/\s/g, '');
  var course = event.searchTerm.replace(/^\D+/g, '').replace(/\s/g, '');
  var term = event.termCode;
  if (subject === '') subject = 'dummy';
  if (course === '') course = 'dummy';
  const result = JSON.parse(await requestP(`https://tianyu.wang/api/courseNameLookup/${term}/${subject}/${course}?key=${APIKEY}`));

  return result;
}