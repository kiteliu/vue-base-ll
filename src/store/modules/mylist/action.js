import axios from '@/plugins/ajax'
import { setheader } from '@/libs/utils'

export async function getMyList ({commit}, obj) {
  const headers = setheader(String(Math.random()), new Date().getTime())
  const key = window.debug ? ('&' + window.api_key) : ''
  const data = await axios.$http({
    method: 'get',
    url: `/welfare/me/?limit=${obj.limit}&offset=${obj.offset}${key}`,
    headers
  })
  commit({type: 'getMyList', mylist: data.data})
}
