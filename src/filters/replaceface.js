export default function (str) {
  str = str.replace(/\</g, '&lt;')
  str = str.replace(/\>/g, '&gt;')
  str = str.replace(/\n/g, '<br/>')
  str = str.replace(/\[em_([0-9]*)\]/g, '<img src="/live/img/emoji/$1.png" border="0" />')
  var reg =  /(http[s]?:\/\/([\w-]+.)+([:\d+])?(\/[\w-\.\/\?%&=]*)?)/gi
  str = str.replace(reg, function($1){
    return "<a href='" + $1 + "' target='_blank'>" + $1 + "</a>"
  })
  return str
}
