import axios from '@/plugins/ajax'
import { setheader } from '@/libs/utils'

export async function welfare ({commit}, info) {
  console.log(info)
  const headers = setheader(String(Math.random()), new Date().getTime())
  const key = window.debug ? ('?' + window.api_key) : ''
  const data = await axios.$http({
    method: 'post',
    url: `/welfare/receive/${info.id}/${key}`,
    headers,
    data: {
      nickname: info.name,
      sex: info.gender,
      grade: info.grade,
      address: info.address,
      mobile: info.tlp,
      zone: info.ct
    }
  })
  commit({type: 'welfare', receive: data.data})
}
