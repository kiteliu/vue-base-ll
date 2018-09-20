export default function (value) {
	let d = new Date(parseInt(value) * 1000)
  return  (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + '-' + (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())+(d.getHours() > 9 ? d.getHours() : '0' + d.getHours())+(d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes())
}
