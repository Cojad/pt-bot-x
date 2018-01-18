var DateTimeHelper = (function () {
  function getDateObj (data, timeZoneOffset) {
    if (!data) {
      return '';
    }
    var offset = getOffset(timeZoneOffset);
    var date = new Date(data.date.year, data.date.month - 1, data.date.day, data.time.hour,
      data.time.minute, data.time.second);
    date.setTime(date.getTime() + offset);
    return date;
  }

  function getOffset (timeZoneOffset) {
    var offset = 0;
    if (timeZoneOffset) {
      var hrsAndMin = timeZoneOffset.split(':');
      var hrs = +hrsAndMin[0];
      var mins = +hrsAndMin[1] ? +hrsAndMin[1] : 0;
      offset = hrs * 60 * 60 * 1000 + mins * 60 * 1000;
    }
    return offset;
  }

  function formatDate (dateObj, showSeconds) {
    if (!dateObj) {
      return '';
    }
    var month = _makeTwoDigits(dateObj.getMonth() + 1);
    var date = _makeTwoDigits(dateObj.getDate());
    var dateStr = date + '.' + month + '.' +
      dateObj.getFullYear();
    var timeStr = _makeTwoDigits(dateObj.getHours()) + ':' +
      _makeTwoDigits(dateObj.getMinutes());
    if (showSeconds) {
      timeStr += ':' + _makeTwoDigits(dateObj.getSeconds());
    }
    return dateStr + ' ' + timeStr;
  }

  function formatTime (dateObj) {
    var timeStr = _makeTwoDigits(dateObj.getHours()) + ':' +
      _makeTwoDigits(dateObj.getMinutes());
    return timeStr;
  }

  function _makeTwoDigits (value) {
    if (value < 10) {
      return '0' + value;
    }
    return value.toString();
  }

  function getUTCTime () {
    var now = new Date();
    var utcTimeStamp = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
    return DateTimeHelper.formatDate(utcTimeStamp);
  }

  function addTimeZoneOffset (timeZoneOffset, date) {
    var offset = DateTimeHelper.getOffset(timeZoneOffset);
    var dateObj = new Date(date);
    dateObj.setTime(dateObj.getTime() + offset);
    return DateTimeHelper.formatDate(dateObj, true);
  }

  function getUTCTimeOnly () {
    var utcTimeStamp = _getUTCDateObj();
    return DateTimeHelper.formatTime(utcTimeStamp);
  }

  function getUTCDateWithOffset (timeZoneOffset) {
    var offset = getOffset(timeZoneOffset);
    var utcTimeStamp = _getUTCDateObj();
    utcTimeStamp.setTime(utcTimeStamp.getTime() + offset);
    return utcTimeStamp;
  }

  function _getUTCDateObj () {
    var now = new Date();
    var utcTimeStamp = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
    return utcTimeStamp;
  }

  function getCurrentTimeZoneTime (timeZoneOffset) {
    var offset = DateTimeHelper.getOffset(timeZoneOffset);
    var utcTimeStamp = _getUTCDateObj();
    utcTimeStamp.setTime(utcTimeStamp.getTime() + offset);
    return DateTimeHelper.formatTime(utcTimeStamp);
  }

  return {
    formatTime: formatTime,
    getDateObj: getDateObj,
    formatDate: formatDate,
    getOffset: getOffset,
    getUTCTime: getUTCTime,
    getUTCTimeOnly: getUTCTimeOnly,
    getCurrentTimeZoneTime: getCurrentTimeZoneTime,
    addTimeZoneOffset: addTimeZoneOffset,
    getUTCDateWithOffset: getUTCDateWithOffset
  };
})();