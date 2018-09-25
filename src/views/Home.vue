<template>
  <div class="welfarehome">
    <div class="show" v-if="home.length && home">
      <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="isclosescroll" infinite-scroll-distance="10">
        <li v-for="item in home" :key="item.id" @click="godetail(item.id,item.title)">
          <div class="img">
            <i class="activityEnd" v-if="item.is_expire"></i>
            <img v-lazy="item.cover_img" alt="">
          </div>
          <div class="title">
            <i class="icon_new" v-if="item.isnew"></i>
            <span class="head dot">{{item.title}}</span>
          </div>
        </li>
      </ul>
      <div class="mywelfare" @click="gomywelfare"></div>
    </div>
    <div class="moreLoading" v-show="loading">
      <mt-spinner class="circle" type="fading-circle" :size="26"></mt-spinner>
      <p>加载中...</p>
    </div>
    <nowelfare v-if="isnodata">
      <div class="text">暂时没有福利哦~</div>
    </nowelfare>
  </div>
</template>

<script>
import { Action, State } from 'vuex-class'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { InfiniteScroll, spinner, Lazyload, Toast } from 'mint-ui'
import { go } from '@/libs/router'
import nowelfare from '@/components/nowelfare'

Vue.use(InfiniteScroll)
Vue.use(Lazyload)
Vue.component(spinner.name, spinner)

@Component({
  components: {
    nowelfare: nowelfare
  }
})
export default class WelfareHome extends Vue {
  @Action('getHomeData') getHomeData
  @State('Home') homeData
  loading = true
  isclosescroll = false
  isnodata = false
  home = []
  page = {
    size: 10,
    num: 0
  }
  dateSeconds = Math.round(new Date().getTime() / 1000)
  created () {
    this.loadMore()
  }
  @Watch('homeData', {deep: true})
  watchHomeData (newVal) {
    const data = newVal.homeData
    if (data.errcode !== 0) {
      Toast(data.errmsg)
      console.log(data.errmsg)
      return
    }
    if (data.objects.length) this.isnew(data.objects)
    this.home = this.home.concat(data.objects)
    if (!this.home.length) this.isnodata = true
    if (!data.objects.length || data.meta.total <= 10) this.isclosescroll = true
    this.loading = false
  }
  isnew (data) {
    let firstTime = window.config.lStorage.getItem('firstTime')
    data.forEach((val) => {
      if (!firstTime) val['isnew'] = true
      if (firstTime) val['isnew'] = false
      if (firstTime && firstTime < val.create_time) val['isnew'] = true
      if (val.is_expire) val['isnew'] = false
    })
  }
  loadMore () {
    this.loading = true
    this.getHomeData(this.page)
    this.page.num += this.page.size
  }
  godetail (id, title) {
    try {
      // window._gaq.push(['_trackEvent', '福利中心', '福利列表-点击查看', title])
      window.ga('send', 'event', '福利中心', '福利列表-点击查看', title)
    } catch (e) {}
    go(`/welfare/page/detail/${id}`, this.$router)
    // go(`/detail/${id}`, this.$router)
  }
  gomywelfare () {
    try {
      // window._gaq.push(['_trackEvent', '福利中心', '福利列表-我的福利', ''])
      window.ga('send', 'event', '福利中心', '福利列表-我的福利')
    } catch (e) {}
    go('/welfare/page/mylist', this.$router)
  }
  destroyed () {
    window.config.lStorage.setItem('firstTime', this.dateSeconds)
  }
}
</script>

<style lang="less" scoped>
.welfarehome {
  padding: 20px 30px 0;
}
.list {
  width: 100%;
  li {
    background: #FFFFFF;
    margin-bottom: 30px;
    box-shadow: 0 3px 10px 0 #E6E6E6; /*no*/
    border-radius: 8px; /*no*/
    overflow: hidden;
  }
  .img {
    width: 100%;
    height: 270px;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .activityEnd {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.68;
      background: url('../assets/images/activityEnd@2x.png') no-repeat 550px 130px;
      background-color: rgba(97, 94, 94, 68);
      background-size: 122px 122px;
      z-index: 10;
    }
  }
}

.title {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  font-family: PingFangSC-Regular;
  .icon_new {
    display: inline-block;
    width: 60px;
    height: 27px;
    background: url('../assets/images/new@3x.png') no-repeat center;
    background-size: 100%;
    margin-right: 10px;
  }
  .head {
    flex: 1;
    font-size: 30px; /*px*/
    color: #333333;
    letter-spacing: 0;
  }
}

.mywelfare {
  width: 96px;
  height: 109px;
  position: fixed;
  right: 14px;
  bottom: 77px;
  z-index: 100;
  background: url('') no-repeat center;
  background-size: cover;
}
.moreLoading {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px; /*px*/
    height: 80px;
    line-height: 80px;
    .circle {
      margin-right: 15px;
    }
  }
</style>
