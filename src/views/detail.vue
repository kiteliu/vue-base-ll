<template>
  <div class="detail">
    <div class="img">
      <img :src="detail.cover_img" alt="">
    </div>
    <div class="title">
      <div class="head dottwo">{{detail.title}}</div>
      <div class="time_num">
        <span>领取截止日期: <em>{{detail.expire_time}}</em></span>
        <span v-if="detail.count > 0">已领取: <em>{{detail.received_count}}/{{detail.count}}</em></span>
      </div>
    </div>
    <div class="textarea">
      <h2 class="head">福利描述</h2>
      <div class="desc" v-html="detail.desc"></div>
      <h2 class="head mt50">领取方法</h2>
      <div class="desc" v-html="detail.receive_desc"></div>
    </div>
    <div class="btn" @click="btnclick" :class="(detail.status === 2 || detail.status === 3) ? 'end': '' ">{{detail.status_text}}</div>
  </div>
</template>

<script>
import { Action, State } from 'vuex-class'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Toast } from 'mint-ui'
// import utils from '../libs/utils'
import { go } from '@/libs/router'

@Component
export default class welfarehome extends Vue {
  @Action('getDetailData') getDetailData
  @State('Detail') detailData
  created (params = this.$route.params) {
    this.getDetailData(params.id)
  }
  @Watch('detailData', {deep: true})
  watchDetail (newVal) {
    const data = newVal.detailData
    if (data.errcode === 0) {
      this.detail = newVal.detailData
    } else {
      Toast(data.errmsg)
      console.log(data.errmsg)
    }
  }
  detail = {}
  btnclick () {
    let _this = this
    let feedbackUrl = _this.detail.feedback_url ? _this.detail.feedback_url : ' '
    if (this.detail.status === 1) {
      if (window.is_visitor) {
        return false
      }
      go(`/welfare/page/userinfo/${this.detail.id}`, this.$router)
    }
    if (this.detail.status === 4) {
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  width: 100%;
}
.img {
  width: 100%;
  height: 293px;
  overflow: hidden;
  position: relative;
  img {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.title {
  padding: 40px;
  background-color: #fff;
  margin-bottom: 20px;
  .head {
    font-family: PingFangSC-Medium;
    font-size: 34px; /*px*/
    color: #333333;
    letter-spacing: 0;
  }
  .time_num {
    display: flex;
    justify-content: space-between;
    font-family: PingFangSC-Regular;
    font-size: 24px;
    color: #999999;
    letter-spacing: 0;
    height: 33px;
    line-height: 33px;
    margin-top: 14px;
    em {
      color: #F5A623;
    }
  }
}
.btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  line-height: 100px;
  background-image: linear-gradient(90deg, #FAD961 0%, #F9AC45 30%, #F76B1C 100%);
  font-family: PingFangSC-Regular;
  font-size: 34px;/*px*/
  color: #FFFFFF;
  letter-spacing: 0;
  text-align: center;
  &.end {
    background: #D5D5D5;
  }
}
.textarea {
  padding: 30px;
  background-color: #fff;
  margin-bottom: 100px;
  .head {
    font-family: PingFangSC-Medium;
    font-size: 34px;/*px*/
    color: #333333;
    letter-spacing: 0;
    margin-bottom: 10px;
  }
  .mt50 {
    margin-top: 50px;
  }
  .desc {
    font-family: PingFangSC-Regular;
    font-size: 28px;/*px*/
    color: #666666;
    letter-spacing: 0;
    line-height: 50px;
    word-break: break-all;
  }
}
</style>

<style lang="less">
.textarea .desc {
  img {
    max-width: 100%;
    height: auto;
    width: auto;
  }
}
</style>
