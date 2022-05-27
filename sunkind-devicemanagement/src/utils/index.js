import state from "./state"
function add0(m) {
    return m < 10 ? '0' + m : m
}
function doHandleMonth(month) {
    var m = month;
    if (month.toString().length == 1) {
        m = "0" + month;
    }
    return m;
}
function fillZero(str) {
    var realNum;
    if (str < 10) {
        realNum = '0' + str;
    } else {
        realNum = str;
    }
    return realNum;
}
export default {
    //处理数据字典
    getStateName: function (name, value) {
        let list = state[name];
        // console.log(list)
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === value) {
                return list[i].value;
            }
        }
    },
    getStateId: function (name, value) {
        let list = state[name];
        for (let i = 0; i < list.length; i++) {
            if (list[i].value == value) {
                return list[i].id;
            }
        }
    },
    //获取昨天时间
    getYesterdayDate: function () {
        var dateTime = [];
        var today = new Date();
        var yesterday = new Date(today.setTime(today.getTime() - 24 * 60 * 60 * 1000));
        var y = yesterday.getFullYear();
        var m = yesterday.getMonth() + 1;
        var d = yesterday.getDate();
        var s = y + '-' + add0(m) + '-' + add0(d);//开始
        var e = y + '-' + add0(m) + '-' + add0(d);//结束
        dateTime.push(s);
        dateTime.push(e);
        return (dateTime);
    },
    //获取最近几天日期
    getDay: function (day) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = doHandleMonth(tMonth + 1);
        tDate = doHandleMonth(tDate);
        return tYear + "-" + tMonth + "-" + tDate;
    },
    //获取当前日期
    getTime: function () {
        var myDate = new Date();
        var myYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        var myMonth = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        var myToday = myDate.getDate(); //获取当前日(1-31)
        var myDay = myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
        var myHour = myDate.getHours(); //获取当前小时数(0-23)
        var myMinute = myDate.getMinutes(); //获取当前分钟数(0-59)
        var mySecond = myDate.getSeconds(); //获取当前秒数(0-59)
        var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        var nowTime;

        // nowTime = myYear + '年' + fillZero(myMonth) + '月' + fillZero(myToday) + '日' + '  ' + fillZero(myHour) + ':' +
        //     fillZero(myMinute) + ':' + fillZero(mySecond) + '  ' + week[myDay] + '  ';
        nowTime = myYear + '-' + fillZero(myMonth) + '-' + fillZero(myToday)
        // console.log(nowTime);
        return nowTime
    },
    getTimes: function () {
        var myDate = new Date();
        var myYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        var myMonth = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        var myToday = myDate.getDate(); //获取当前日(1-31)
        var myDay = myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
        var myHour = myDate.getHours(); //获取当前小时数(0-23)
        var myMinute = myDate.getMinutes(); //获取当前分钟数(0-59)
        var mySecond = myDate.getSeconds(); //获取当前秒数(0-59)
        var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        var nowTime;

        // nowTime = myYear + '年' + fillZero(myMonth) + '月' + fillZero(myToday) + '日' + '  ' + fillZero(myHour) + ':' +
        //     fillZero(myMinute) + ':' + fillZero(mySecond) + '  ' + week[myDay] + '  ';
        nowTime = myYear + '-' + fillZero(myMonth)
        // console.log(nowTime);
        return nowTime
    },
    //获取前几个月日期
    GetPreMonthDay(date, monthNum) {
        var dateArr = date.split("-");
        var year = dateArr[0]; //获取当前日期的年份
        var month = dateArr[1]; //获取当前日期的月份
        var day = dateArr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        var year2 = year;
        var month2 = parseInt(month) - monthNum;
        if (month2 <= 0) {
            var absM = Math.abs(month2);
            year2 =
                parseInt(year2) - Math.ceil(absM / 12 == 0 ? 1 : parseInt(absM) / 12);
            month2 = 12 - (absM % 12);
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
            day2 = days2;
        }
        if (month2 < 10) {
            month2 = "0" + month2;
        }
        var t2 = year2 + "-" + month2;
        return t2;
    },

}