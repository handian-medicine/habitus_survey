var express = require('express');
// const mongoose = require('mongoose');
var base = require('../models/base');
var router = express.Router();

/* 这里原来是mongodb代码 */

/* 调查问卷 */
router.get('/', function(req, res, next) {
  res.render('survey');
});
router.post('/', function(req, res, next) {
  console.log("look here");
  console.log("req.body", req.body);
  //key为问题类型,value是列表,其中列表
  //0第一个元素表示某类型问题  包含的问题数目
  //1第二个元素表示某类型问题  的得分
  //2第三个元素 把前端的命名 转换为 符合js命名规范的名称
  //3第四个元素 表示体质判定结果, 0表示否, 1表示基本是(倾向是), 2表示是
  //4第五个元素 中文名称
  var question_list = {
    "pinghe-question":[8,0,"pinghe_question",0,"平和质"],
    "qixu-question":[8,0,"qixu_question",0,"气虚质"],
    "yangxu-question":[7,0,"yangxu_question",0,"阳虚质"],
    "yinxu-question":[8,0,"yinxu_question",0,"阴虚质"],
    "tanxu-question":[8,0,"tanxu_question",0,"痰虚质"],
    "shire-question":[7,0,"shire_question",0,"湿热质"],
    "xueyu-question":[7,0,"xueyu_question",0,"血瘀质"],
    "qiyu-question":[7,0,"qiyu_question",0,"气郁质"],
    "teling-question":[7,0,"teling_question",0,"特禀质"]
    };
  var row = {};
  for (var question in question_list) {
    var num = question_list[question][0];
    var sum = 0;
    for (var j=1;j<=num;j++) {
      if (req.body[question+j] == undefined) {
        var data = 1;
      } else {
        //将前端传到的字符串数据 转换为 数字类型
        var data = Number(req.body[question+j]);
      }
      //question_list[i][2]把前端的命名 转换为 符合js命名规范的名称
      row[question_list[question][2] + j] = data;//把每个表的每个问题得分都存入数据库
      sum = sum + data;
    }
    var score = Math.round( (sum - num) / (num * 4) * 100 );
    row[question_list[question][2]+"_sum"] = score;//把每个表的转换分数存入数据库
    question_list[question][1] = score;
  }
  //计算判定结果,存入数据库
  question_list = SurveyResult(question_list);
  for (var question in question_list) {
    row[question_list[question][2]+"_result"] = question_list[question][3];
  }
  //入库
  const awesome_instance = new base.SurveyModel(row);
  awesome_instance.save( function (err) {
    if (err) {
      return handleError(err);
    } // 已保存
  });

  console.log("question_list:", question_list);
  // findOne返回单个结果
  // base.SurveyModel.findOne(function(err, data){
  //   console.log(">>> " + data.pinghe_question1);
  //   console.log(">>> " + data._id);
  //   data.xxx = 'xxx';   //字段修改
  //   data.save();        //此时就能直接修改了
  // });
  // find查询返回多个结果,
  // base.SurveyModel.find(function(err, data){
  //   console.log(">>> " + data[0]._id);
  //   console.log(">>> " + data[1]._id);
  // });
  // 返回某个field字段的内容,多个结果
  // base.SurveyModel.find({}, '_id',function(err, data){
  //   console.log(">>> " + data[0]._id + typeof(data[0]._id));
  //   res.render('result', {question_list:question_list,mydata:data});
  // });
  // 返回符合条件的数据数量

  var data_yes = [];
  var data_almost_yes = [];
  // base.SurveyModel.countDocuments({"pinghe_question_result":1},function(err, count){data_almost_yes[0]=count;});
  // base.SurveyModel.countDocuments({"qixu_question_result":1},function(err, count){data_almost_yes[1]=count;});
  // base.SurveyModel.countDocuments({"yangxu_question_result":1},function(err, count){data_almost_yes[2]=count;});
  // base.SurveyModel.countDocuments({"yinxu_question_result":1},function(err, count){data_almost_yes[3]=count;});
  // base.SurveyModel.countDocuments({"tanxu_question_result":1},function(err, count){data_almost_yes[4]=count;});
  // base.SurveyModel.countDocuments({"shire_question_result":1},function(err, count){data_almost_yes[5]=count;});
  // base.SurveyModel.countDocuments({"xueyu_question_result":1},function(err, count){data_almost_yes[6]=count;});
  // base.SurveyModel.countDocuments({"qiyu_question_result":1},function(err, count){data_almost_yes[7]=count;});
  // base.SurveyModel.countDocuments({"teling_question_result":1},function(err, count){data_almost_yes[8]=count;});
  async function doIt() {
    await base.SurveyModel.countDocuments({"pinghe_question_result":2},function(err, count){data_yes[0]=count;});
    await base.SurveyModel.countDocuments({"qixu_question_result":2},function(err, count){data_yes[1]=count;});
    await base.SurveyModel.countDocuments({"yangxu_question_result":2},function(err, count){data_yes[2]=count;});
    await base.SurveyModel.countDocuments({"yinxu_question_result":2},function(err, count){data_yes[3]=count;});
    await base.SurveyModel.countDocuments({"tanxu_question_result":2},function(err, count){data_yes[4]=count;});
    await base.SurveyModel.countDocuments({"shire_question_result":2},function(err, count){data_yes[5]=count;});
    await base.SurveyModel.countDocuments({"xueyu_question_result":2},function(err, count){data_yes[6]=count;});
    await base.SurveyModel.countDocuments({"qiyu_question_result":2},function(err, count){data_yes[7]=count;});
    await base.SurveyModel.countDocuments({"teling_question_result":2},function(err, count){data_yes[8]=count;
      res.render('result', {
        question_list:question_list,
        data_yes:data_yes,
        data_almost_yes:data_almost_yes});
  });
  }//async
  doIt();
});
function SurveyResult(question_list) {
  var flag_30=false;//用来判定平和体质的flag,除平和体质以外,其他体质都小于30分
  var flag_40=false;//用来判定平和体质的flag,除平和体质以外,其他体质都小于40分,大于30分
  for (var i in question_list) {
    if (i != "pinghe-question") { // 除平和体质以外
      if (question_list[i][1]>= 40 ) {
        flag_30 = false;
        flag_40 = false;
        question_list[i][3] = 2;
      } else if ( (30 <= question_list[i][1]) && (question_list[i][1] < 40) ) {
        flag_30 = false;
        flag_40 = true;
        question_list[i][3] = 1;
      } else {
        flag_30 = true;
        question_list[i][3] = 0;
      }
    }
  }
  if ( (question_list["pinghe-question"][1] >= 60) && (flag_30) ) {
    question_list["pinghe-question"][3] = 2;
  } else if ( (question_list["pinghe-question"][1] >= 60) && (flag_40) ) {
    question_list["pinghe-question"][3] = 1;
  } else {
    question_list["pinghe-question"][3] = 0;
  }
  return question_list;
}

module.exports = router;
