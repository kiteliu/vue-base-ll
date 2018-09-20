<template>
  <div class="nowelfare">
    <slot></slot>
  </div>
</template>
<script>
import { Vue, Component } from 'vue-property-decorator'

@Component()
export default class Nowelfare extends Vue { }

</script>
<style lang="less" scoped>
.nowelfare {
  width: 412px;
  height: 500px;
  margin: 300px auto 0;
  background: url('https://atths.jzb.com/website/fe/welfareCenter/static/img/none@2x.e1864d9.png') no-repeat center center;
  background-size: 100% auto;
  overflow: hidden;
  .text {
    font-family: PingFangSC-Regular;
    font-size: 28px; /*px*/
    color: #D2D2D2;
    text-align: center;
    margin-top: 400px;
  }
}
</style>
