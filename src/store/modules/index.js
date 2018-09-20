import receive from './receive/state'
import * as receiveMutations from './receive/mutations'
import * as receiveActions from './receive/action'

import mylist from './mylist/state'
import * as mylistMutations from './mylist/mutations'
import * as mylistActions from './mylist/action'

import HomeState from './homeData/state'
import * as HomeMutations from './homeData/mutations'
import * as HomeActions from './homeData/action'

import DetailState from './detail/state'
import * as DetailMutations from './detail/mutations'
import * as DetailActions from './detail/action'

const ml = {
  state: mylist,
  mutations: { ...mylistMutations },
  actions: { ...mylistActions }
}

const rc = {
  state: receive,
  mutations: { ...receiveMutations },
  actions: { ...receiveActions }
}

const Home = {
  state: HomeState,
  mutations: { ...HomeMutations },
  actions: { ...HomeActions }
}

const Detail = {
  state: DetailState,
  mutations: { ...DetailMutations },
  actions: { ...DetailActions }
}

export {
  rc,
  Detail,
  ml,
  Home
}
