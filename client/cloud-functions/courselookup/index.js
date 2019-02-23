// 云函数入口文件
const cloud = require('wx-server-sdk');
const requestP = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext();
  var subject = event.searchTerm.replace(/[0-9]/g, '').replace(/\s/g, '');
  var course = event.searchTerm.replace(/^\D+/g, '');
  if (subject === '') subject = 'dummy';
  if (course === '') course = 'dummy';
  const result = JSON.parse(await requestP(`https://tianyu.wang/courselookup/1191/${subject}/${course}?key=supercomplexapisecret1234567!!!`));

  return result;
}