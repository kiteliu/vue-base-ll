import axios from '@/plugins/ajax'
import { setheader } from '@/libs/utils'

export async function getDetailData ({commit}, id) {
  const headers = setheader(String(Math.random()), new Date().getTime())
  const key = window.debug ? ('?api_key=' + window.api_key) : ''
  const res = await axios.$http({
    method: 'get',
    url: `/welfare/${id}/${key}`,
    headers
  })
  // console.log(res.data)
  commit({type: 'getDetailData', detailData: res.data})
}
