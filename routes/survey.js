var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

// 设置默认 mongoose 连接
const mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB,{useNewUrlParser: true});//connect参数包括数据库 URI，包括主机地址、数据库名、端口、选项等
// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;
// 取得默认连接
const db = mongoose.connection;
// 将连接与错误事件绑定（以获得连接错误的提示）
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));

// 定义一个模式
var Schema = mongoose.Schema;
var SurveyModelSchema = new Schema({
    //汇总
    pinghe_question_result:Number, qixu_question_result:Number, yangxu_question_result:Number, yinxu_question_result:Number,
    tanxu_question_result:Number, shire_question_result:Number, xueyu_question_result:Number, qiyu_question_result:Number,
    teling_question_result:Number,
    //每个表的得分
    pinghe_question_sum:Number, qixu_question_sum:Number, yangxu_question_sum:Number, yinxu_question_sum:Number,
    tanxu_question_sum:Number, shire_question_sum:Number, xueyu_question_sum:Number, qiyu_question_sum:Number,
    teling_question_sum:Number,
    //每个选项的得分
    pinghe_question1: Number,pinghe_question2: Number,pinghe_question3: Number,pinghe_question4: Number,
    pinghe_question5: Number,pinghe_question6: Number,pinghe_question7: Number,pinghe_question8: Number,

    qixu_question1: Number,qixu_question2: Number,qixu_question3: Number,qixu_question4: Number,
    qixu_question5: Number,qixu_question6: Number,qixu_question7: Number,qixu_question8: Number,

    yangxu_question1: Number,yangxu_question2: Number,yangxu_question3: Number,yangxu_question4: Number,
    yangxu_question5: Number,yangxu_question6: Number,yangxu_question7: Number,

    yinxu_question1: Number,yinxu_question2: Number,yinxu_question3: Number,yinxu_question4: Number,
    yinxu_question5: Number,yinxu_question6: Number,yinxu_question7: Number,yinxu_question8: Number,

    tanxu_question1: Number,tanxu_question2: Number,tanxu_question3: Number,tanxu_question4: Number,
    tanxu_question5: Number,tanxu_question6: Number,tanxu_question7: Number,tanxu_question8: Number,

    shire_question1: Number,shire_question2: Number,shire_question3: Number,shire_question4: Number,
    shire_question5: Number,shire_question6: Number,shire_question7: Number,

    xueyu_question1: Number,xueyu_question2: Number,xueyu_question3: Number,xueyu_question4: Number,
    xueyu_question5: Number,xueyu_question6: Number,xueyu_question7: Number,

    qiyu_question1: Number,qiyu_question2: Number,qiyu_question3: Number,qiyu_question4: Number,
    qiyu_question5: Number,qiyu_question6: Number,qiyu_question7: Number,

    teling_question1: Number,teling_question2: Number,teling_question3: Number,teling_question4: Number,
    teling_question5: Number,teling_question6: Number,teling_question7: Number,
});
// 使用模式“编译”模型
const SurveyModel = mongoose.model('SurveyModel', SurveyModelSchema);
// 使用圆点来访问模型的字段值
// console.log(awesome_instance.pinghe_question1); // 控制台将显示

/* 调查问卷 */
router.get('/', function(req, res, next) {
  res.render('survey');
});
router.post('/', function(req, res, next) {
  console.log("look here")
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
  for (var i in question_list) {
    var num = question_list[i][0];
    var sum = 0;
    for (var j=1;j<=num;j++) {
      if (req.body[i+j] == undefined) {
        var data = 1;
      } else {
        //将前端传到的字符串数据 转换为 数字类型
        var data = Number(req.body[i+j]);
      }
      //question_list[i][2]把前端的命名 转换为 符合js命名规范的名称
      row[question_list[i][2] + j] = data;//把每个表的每个问题得分都存入数据库
      sum = sum + data;
    }
    var score = Math.round( (sum - num) / (num * 4) * 100 );
    row[question_list[i][2]+"_sum"] = score;//把每个表的转换分数存入数据库
    question_list[i][1] = score;
  }
  //计算判定结果,存入数据库
  question_list = SurveyResult(question_list);
  for (var i in question_list) {
    row[question_list[i][2]+"_result"] = question_list[i][3];
  }
  //入库
  const awesome_instance = new SurveyModel(row);
  awesome_instance.save( function (err) {
    if (err) {
      return handleError(err);
    } // 已保存
  });

  console.log("question_list:", question_list);
  //TODO:发送成功页面
  // var translate = ["不是","倾向是(基本是)","是"];
  res.render('result',{question_list:question_list});
});


function SurveyResult(question_list) {
  var flag_30=false;//用来判定平和体质的flag
  var flag_40=false;//用来判定平和体质的flag
  for (var i in question_list) {
    if (i != "pinghe-question") { // 除平和体质以外
      if (question_list[i][1]>= 40 ) {
        flag_30 = false;
        flag_40 = false;
        question_list[i][3] = 2;
      } else if ( (30 <= question_list[i][1]) && (question_list[i][1] < 40) ) {
        flag_40 = true;
        question_list[i][3] = 1;
      } else {
        flag_30 = true;
        flag_40 = true;
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
