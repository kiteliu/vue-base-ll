'use strict'
const wx = window.jWeixin
let u = navigator.userAgent
let browser = {
  versions: {
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
    iPhone: u.indexOf('iPhone') > -1,
    iPad: u.indexOf('iPad') > -1,
    jzb: u.indexOf('patriarch') > -1,
    ios7: u.indexOf('iOS 7') > -1,
    ios8: u.indexOf('iOS 8') > -1,
    wechat: /micromessenger/i.test(u),
    iPhoneX: u.indexOf('iPhoneX') > -1
  }
}

let wxShareConfig = ({title, desc, link, imgUrl}, success, fail) => {
  wx.ready(() => {
    wx.onMenuShareAppMessage({
      title: title,
      desc: desc,
      link: link,
      imgUrl: imgUrl,
      success: success,
      fail: fail
    })
    wx.onMenuShareTimeline({
      title: title,
      link: link,
      imgUrl: imgUrl,
      success: success,
      fail: fail
    })
    wx.onMenuShareQQ({
      title: title,
      desc: desc,
      link: link,
      imgUrl: imgUrl,
      success: success,
      fail: fail
    })
  })
}
function CountDown (ele, dataDate) {
  this.ele = ele
  this.dataDate = dataDate
  this.fn()
}
CountDown.prototype.fn = function () {
  const leftTime = new Date(this.dataDate).getTime() - new Date().getTime()
  const days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10)
  const hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10)
  const minutes = parseInt(leftTime / 1000 / 60 % 60, 10)
  const seconds = parseInt(leftTime / 1000 % 60, 10)
  this.ele.innerHTML = `<span class="red">${days}</span>天<span class="red">${this.checkTime(hours)}：${this.checkTime(minutes)}：${this.checkTime(seconds)}</span>后过期`
  setInterval(() => {
    this.fn()
  }, 1000)
}
CountDown.prototype.checkTime = function (i) {
  if (i < 10) {
    i = '0' + i
  }
  return i
}

let matchs = navigator.userAgent.match(/patriarch\/(\d[0-9.]+)/i)
let vs = 0
if (matchs && matchs.length === 2) {
  vs = parseFloat(matchs[1].replace(/(\d\.)(\d)\.(\d+)$/, '$1$2$3'))
}

exports.vs = vs

exports.setheader = (randstr, timestamp) => {
  return {
    'Accept': 'application/json',
    'jzbapi-accesskey': 'frontend',
    'jzbapi-timestamp': timestamp,
    'jzbapi-randstr': randstr,
    'jzbapi-signature': window.md5('80b013563e4c127eae737f543778539a' + randstr + timestamp)
  }
}

exports.changeTitle = (t) => {
  document.title = t
  var i = document.createElement('iframe')
  i.src = '//m.baidu.com/favicon.ico'
  i.style.display = 'none'
  i.onload = function () {
    setTimeout(function () {
      i.remove()
    }, 9)
  }
  document.body.appendChild(i)
}
exports.browser = browser
exports.wxShareConfig = wxShareConfig
