const formatTime = function (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(timeFormat).join('/') + ' ' + [hour, minute, second].map(timeFormat).join(':')
}

const timeFormat = num => num.toString().padStart(2, "0")

const milliseconds2Time = (ms) => {
  let Time = {};
  ms = ms / 1000;
  if (ms > 0) {
    const days = parseInt(ms / (60 * 60 * 24));
    const hours = parseInt(ms % (60 * 60 * 24) / 3600);
    const mins = parseInt(ms % (60 * 60 * 24) % 3600 / 60);
    const secs = parseInt(ms % (60 * 60 * 24) % 3600 % 60);
    Time = {
      days: timeFormat(days),
      hours: timeFormat(hours),
      mins: timeFormat(mins),
      secs: timeFormat(secs)
    }
  } else {
    Time = {
      days: '00',
      hours: '00',
      mins: '00',
      secs: '00'
    }
  }
  return Time
}

module.exports = {
  milliseconds2Time,
  formatTime
}