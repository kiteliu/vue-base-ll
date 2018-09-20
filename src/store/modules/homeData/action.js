import axios from '@/plugins/ajax'
import { setheader } from '@/libs/utils'

export async function getHomeData ({commit}, page) {
  const headers = setheader(String(Math.random()), new Date().getTime())
  const key = window.debug ? ('&api_key=' + window.api_key) : ''
  const res = await axios.$http({
    method: 'get',
    url: `/welfare/?limit=${page.size}&offset=${page.num}${key}`,
    headers
  })
  // console.log(res.data)
  commit({type: 'getHomeData', homeData: res.data})
}
