<template>
  <section class="mylist">
    <nowelfare v-if="none">
      <div class="text">
        <p>还没有领取福利</p>
        <p>快去首页列表看看吧</p>
      </div>
    </nowelfare>
    <ul class="list"
      v-infinite-scroll="getList"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
      v-else
    >
      <li class="border-bottom" v-for="item in lists" :key="item.id" @click="detail(item.id)">
        <div class="pic">
          <img v-lazy="item.cover_img || item.img">
        </div>
        <p>{{item.title}}</p>
      </li>
    </ul>
    <div class="moreLoading" v-show="loading && showLoading">
      <mt-spinner class="circle" type="fading-circle" :size="26"></mt-spinner>
      <p>加载中...</p>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { InfiniteScroll, Lazyload, spinner, Toast } from 'mint-ui'
import { Action, State } from 'vuex-class'
import { Watch } from 'vue-property-decorator'
import nowelfare from '@/components/nowelfare'
import { go } from '../libs/router'

Vue.use(InfiniteScroll)
Vue.use(Lazyload)
Vue.component(spinner.name, spinner)

@Component({
  components: {
    nowelfare: nowelfare
  }
})
export default class MyList extends Vue {
  @Action('getMyList') getMyList
  @State('ml') mylist
  created (params = this.$route.params) {
    this.getList()
  }

  none = false
  loading = false
  showLoading = true
  duration = 3000
  lists = []
  limit = 10
  offset = 0

  @Watch('mylist', {deep: true})
  watchCount (newVal, oldVal) {
    if (newVal.mylist.errcode !== 0) {
      Toast({
        message: newVal.mylist.errmsg,
        duration: this.duration
      })
      return
    }
    this.lists = this.lists.concat(newVal.mylist.objects)
    this.$nextTick(() => {
      if (!this.lists.length) this.none = true
      if (!newVal.mylist.objects.length) {
        this.showLoading = false
        return
      }
      this.loading = false
    })
  }

  getList () {
    // if (this.loading) return
    this.loading = true
    this.getMyList({
      limit: this.limit,
      offset: this.offset
    })
    this.offset += this.limit
  }

  detail (id) {
    go(`/welfare/page/detail/${id}`, this.$router)
  }
}
</script>

<style lang="less" scoped>
.mylist {
  .ce {
    text-align: center;
    line-height: 80px;
  }
  .list {
    background: #fff;
    li {
      margin-left: 30px;
      overflow: hidden;
      .pic {
        width: 210px;
        height: 110px;
        float: left;
        margin: 30px 0;
        overflow: hidden;
        img {
          width: 100%;
          border-radius: 3px;
        }
      }
      p {
        width: 381px;
        font-family: PingFangSC-Regular;
        font-size: 28px;
        line-height: 40px;
        color: #333333;
        height: 80px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        float: left;
        margin: 30px 40px;
      }
    }
  }
  .border-bottom {
    &:last-child::after {
      background: #fff;
    }
    &::after {
      background: #eee;
    }
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
}
</style>
