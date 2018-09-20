export default function(str, size) {
  let [nStr, base = 0] = ['']
  for (var i = 0; i < str.length; i++) {
    const index = str.substr(i, 1)
    if (index.charCodeAt() >= 255) {
      base += 1
    } else {
      base += 0.5
    }
    nStr += index
    if (base >= size) break
  }
  return nStr
}