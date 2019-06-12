const mongoose = require('mongoose');

// 设置默认 mongoose 连接
const url = 'mongodb://127.0.0.1/my_database';
mongoose.connect(url,{useNewUrlParser: true});//connect参数包括数据库 URI，包括主机地址、数据库名、端口、选项等
// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;
// 取得默认连接
const db = mongoose.connection;
// 将连接与错误事件绑定（以获得连接错误的提示）
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));

var ObjectId = mongoose.Schema.Types.ObjectId;
// 定义一个模式
var SurveyModelSchema = new mongoose.Schema({
    //编号
    id:String,
    survey_id:Number,
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

exports.db = db;
exports.mongoose = mongoose;
exports.SurveyModelSchema = SurveyModelSchema;
exports.SurveyModel = SurveyModel;
exports.ObjectId = ObjectId;
