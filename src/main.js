// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import FastClick from 'fastclick'
import { sync } from 'vuex-router-sync'
import VueLazyComponent from '@xunlei/vue-lazy-component'
import Vuex from 'vuex'
// import VueLazyload from 'vue-lazyload'
import 'babel-polyfill'
import VueRouter from 'vue-router'
import routes from './router'
// import axios from './plugins/ajax'
// import utils from './libs/utils'
import store from './store'


// const wx = window.jWeixin
Vue.use(VueRouter)
Vue.use(VueLazyComponent)
Vue.use(Vuex)
// Vue.use(VueLazyload)
// Vue.use(VueLazyload, {
//   preLoad: 1.3,
//   error: 'https://atths.jzb.com/website/fe/pub_images/logo300.png',
//   loading: 'https://atths.jzb.com/website/fe/pub_images/logo300.png',
//   attempt: 1,
//   listenEvents: [ 'scroll', 'mousewheel' ]
// })
// vue router
const router = new VueRouter({
  mode: 'history',
  routes
})
sync(store, router)
//  微信分享公用
window.shareTitle = ''
window.shareDesc = ''
window.shareLink = ''
window.shareImgUrl = ''

Vue.config.productionTip = false
FastClick.attach(document.body)
/* eslint-disable no-new */

// router.afterEach(route => {
//   window.scrollTo(0, 1)
//   setTimeout(() => {
//     var url
//     if (window.__wxjs_is_wkwebview === true) {
//       // url = encodeURIComponent(store.state.routervar.surl.split('#')[0])
//     } else {
//       url = encodeURIComponent(window.location.href.split('#')[0])
//     }
//     axios.$http.get('/jssdk?url=' + url).then((res) => {
//       const data = res.data
//       wx.config(data)
//       const [title, desc, link, imgUrl] = [window.shareTitle, window.shareDesc, window.shareLink, window.shareImgUrl]
//       utils.wxShareConfig({title, desc, link, imgUrl})
//     })
//   }, 500)
// })
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
