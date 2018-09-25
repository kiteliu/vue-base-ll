<template>
  <section class="userInfo">
    <div class="title">福利中心</div>
    <p class="des">请填写以下信息用于本次福利的发放，点击可修改</p>
    <div class="infoBox">
      <div v-if="nicknameStatus" class="au" :class="{'auHi': !gender, 'auLo': gender}" @click="changeGender(0)">先生</div>
      <div v-if="nicknameStatus" class="au" :class="{'auHi': gender, 'auLo': !gender}" @click="changeGender(1)">女士</div>
      <div v-if="nicknameStatus" class="cell w3 border-bottom">
        <div class="tit">称呼</div>
        <input class="nameInp" type="text" v-model="name">
      </div>
      <div v-if="mobileStatus" class="cell border-bottom">
        <div class="tit">联系方式</div>
        <input class="pubInp" type="number" v-model="tlp">
      </div>
      <div v-if="zoneStatus" class="cell border-bottom">
        <div class="tit">地区</div>
        <div class="val" @click="onAddressShow">{{addressProvince}}{{addressCity ? `, ${addressCity}` : ''}}</div>
      </div>
      <div v-if="gradeStatus" class="cell border-bottom">
        <div class="tit">年级</div>
        <div class="val" @click="onXShow">{{xd}}</div>
      </div>
      <div v-if="addressStatus" class="cell border-bottom">
        <div class="tit">地址</div>
        <input class="pubInp" type="text" v-model="address">
      </div>
    </div>
    <div class="statement">
      领取声明：<br />
      <p>定制类福利商品（包括但不限于课程、营地、旅游等）为了更好地匹配个性化需求，有时需要客服人员等介入与您进一步沟通需求。</p>
      <p>在未经您允许的情况下，家长帮不会泄漏您在平台预留的任何资料信息。</p>
    </div>
    <div class="bottButt" :class="{'buttLo': !loaded || status !== 1, 'buttHi': loaded && status === 1}" @click="success">
      <p v-if="loaded">
        <span v-if='status == 1'>确认并领取</span>
        <span v-if='status == 2'>已领取</span>
        <span v-if='status == 3'>活动已结束</span>
        <span v-if='status == 4'>填写反馈</span>
      </p>
      <div class="spinner" v-else>
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    </div>
    <mt-popup v-model="addressVisible" position="bottom">
      <mt-picker :slots="addressSlots" @change="onAddressChange"></mt-picker>
    </mt-popup>
    <mt-popup v-model="sVisible" position="bottom">
      <mt-picker :slots="xSlots" @change="onXChange"></mt-picker>
    </mt-popup>
  </section>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Button, Picker, Popup, Toast } from 'mint-ui'
import { Action, State } from 'vuex-class'
import { Watch } from 'vue-property-decorator'
import { go } from '../libs/router'

const address = {
  '北京': ['北京'],
  '广东': ['广州', '深圳', '珠海', '汕头', '韶关', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'],
  '上海': ['上海'],
  '天津': ['天津'],
  '重庆': ['重庆'],
  '辽宁': ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'],
  '江苏': ['南京', '苏州', '无锡', '常州', '镇江', '南通', '泰州', '扬州', '盐城', '连云港', '徐州', '淮安', '宿迁'],
  '湖北': ['武汉', '黄石', '十堰', '荆州', '宜昌', '襄樊', '鄂州', '荆门', '孝感', '黄冈', '咸宁', '随州', '恩施土家族苗族自治州', '仙桃', '天门', '潜江', '神农架林区'],
  '四川': ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'],
  '陕西': ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'],
  '河北': ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'],
  '山西': ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'],
  '河南': ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店'],
  '吉林': ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边朝鲜族自治州'],
  '黑龙江': ['哈尔滨', '齐齐哈尔', '鹤岗', '双鸭山', '鸡西', '大庆', '伊春', '牡丹江', '佳木斯', '七台河', '黑河', '绥化', '大兴安岭地区'],
  '内蒙古': ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '锡林郭勒盟', '兴安盟', '阿拉善盟'],
  '山东': ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '莱芜', '临沂', '德州', '聊城', '滨州', '菏泽'],
  '安徽': ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '巢湖', '六安', '亳州', '池州', '宣城'],
  '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'],
  '福建': ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德'],
  '湖南': ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西土家族苗族自治州'],
  '广西': ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左'],
  '江西': ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'],
  '贵州': ['贵阳', '六盘水', '遵义', '安顺', '铜仁地区', '毕节地区', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'],
  '云南': ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州', '大理白族自治州', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州'],
  '西藏': ['拉萨', '那曲地区', '昌都地区', '林芝地区', '山南地区', '日喀则地区', '阿里地区'],
  '海南': ['海口', '三亚', '五指山', '琼海', '儋州', '文昌', '万宁', '东方', '澄迈县', '定安县', '屯昌县', '临高县', '白沙黎族自治县', '昌江黎族自治县', '乐东黎族自治县', '陵水黎族自治县', '保亭黎族苗族自治县', '琼中黎族苗族自治县'],
  '甘肃': ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '酒泉', '张掖', '庆阳', '平凉', '定西', '陇南', '临夏回族自治州', '甘南藏族自治州'],
  '宁夏': ['银川', '石嘴山', '吴忠', '固原', '中卫'],
  '青海': ['西宁', '海东地区', '海北藏族自治州', '海南藏族自治州', '黄南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'],
  '新疆': ['乌鲁木齐', '克拉玛依', '吐鲁番地区', '哈密地区', '和田地区', '阿克苏地区', '喀什地区', '克孜勒苏柯尔克孜自治州', '巴音郭楞蒙古自治州', '昌吉回族自治州', '博尔塔拉蒙古自治州', '石河子', '阿拉尔', '五家渠', '伊犁哈萨克自治州'],
  '香港': ['香港'],
  '澳门': ['澳门'],
  '台湾': ['台北市', '高雄市', '台北县', '桃园县', '新竹县', '苗栗县', '台中县', '彰化县', '南投县', '云林县', '嘉义县', '台南县', '高雄县', '屏东县', '宜兰县', '花莲县', '台东县', '澎湖县', '基隆市', '新竹市', '台中市', '嘉义市', '台南市']
}

Vue.component(Button.name, Button)
Vue.component(Picker.name, Picker)
Vue.component(Popup.name, Popup)

@Component
export default class UserInfo extends Vue {
  @Action('welfare') welfare
  @Action('getDetailData') getDetailData
  @State('rc') receive
  @State('Detail') detailData
  created (params = this.$route.params) {
    this.id = params.id
    if (this.detailData.errcode !== 0) this.getDetailData(this.id)
    else this.setStatus(this.detailData)
  }

  duration = 3000
  loaded = true
  pickerRoot = {
    address: true,
    xd: true
  }
  status = -1
  nicknameStatus = false
  mobileStatus = false
  zoneStatus = false
  addressStatus = false
  gradeStatus = false
  name = window.config.lStorage.getItem('name') || ''
  gender = parseInt(window.config.lStorage.getItem('gender')) || 1
  addressProvince = ''
  addressCity = ''
  xd = ''
  tlp = window.config.lStorage.getItem('tlp') || ''
  address = window.config.lStorage.getItem('address') || ''
  addressVisible = false
  sVisible = false
  xSlots = [{
    flex: 1,
    values: ['未出生', '未入园', '幼儿园', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三', '高一', '高二', '高三', '大学及以上'],
    className: 'slot1'
  }]
  addressSlots = [
    {
      flex: 1,
      values: Object.keys(address),
      className: 'slot1',
      textAlign: 'center'
    }, {
      divider: true,
      content: '-',
      className: 'slot2'
    }, {
      flex: 1,
      values: ['北京'],
      className: 'slot3',
      textAlign: 'center'
    }
  ]

  @Watch('receive', {deep: true})
  watchCount (newVal, oldVal) {
    setTimeout(() => {
      if (newVal.receive.errcode === 0) {
        Toast({
          message: '领取成功',
          duration: this.duration
        })
        setTimeout(() => {
          go('/welfare/page/', this.$router)
        }, this.duration)
      } else {
        this.loaded = true
        Toast({
          message: newVal.receive.errmsg,
          duration: this.duration
        })
      }
    }, 600)
  }

  @Watch('detailData', {deep: true})
  watchDetail (newVal) {
    if (newVal.detailData.errcode === 0) {
      this.setStatus(newVal.detailData)
    } else {
      Toast(newVal.detailData.errmsg)
    }
  }

  onAddressChange (picker, values) {
    if (this.pickerRoot.address) {
      this.pickerRoot.address = false
      return
    }
    picker.setSlotValues(1, address[values[0]])
    this.addressProvince = values[0]
    this.addressCity = values[1]
  }

  onXChange (picker, values) {
    if (this.pickerRoot.xd) {
      this.pickerRoot.xd = false
      return
    }
    this.xd = values[0]
  }

  onAddressShow () {
    this.addressVisible = true
  }

  onXShow () {
    this.sVisible = true
  }

  changeGender (val) {
    this.gender = val
  }

  setStatus (data) {
    this.status = data.status
    this.getInfo(data)
    data.data_fields.forEach(item => {
      switch (item.uri) {
        case 'nickname':
          this.nicknameStatus = true
          break
        case 'mobile':
          this.mobileStatus = true
          break
        case 'zone':
          this.zoneStatus = true
          break
        case 'address':
          this.addressStatus = true
          break
        case 'grade':
          this.gradeStatus = true
          break
      }
    })
  }

  getInfo (data) {
    this.addressProvince = window.config.lStorage.getItem('addressProvince') || data.zone || '北京'
    this.addressCity = window.config.lStorage.getItem('addressCity') || ''
    this.xd = window.config.lStorage.getItem('xd') || (typeof data.grade === 'number' && this.xSlots[0].values[data.grade + 2]) || '幼儿园'
  }

  success () {
    if (!this.loaded) return
    if (this.status === 4) {
      window.location.href = this.detailData.feedback_url || 'https://baidu.com'
      return
    }
    if (this.status !== 1) return
    if (this.nicknameStatus && !this.name) {
      Toast('请填写昵称')
      return
    }
    if (this.mobileStatus && !this.tlp) {
      Toast('请填写联系方式')
      return
    }
    if (this.addressStatus && !this.address) {
      Toast('请填写联系地址')
      return
    }
    this.loaded = false
    try {
      // window._gaq.push(['_trackEvent', '福利中心', '领取福利-确认领取', '领取福利'])
      window.ga('send', 'event', '福利中心', '领取福利-确认领取')
    } catch (e) {}
    let opt = {
      id: this.id
    }
    if (this.nicknameStatus) {
      opt.name = this.name
      opt.gender = this.gender
    }
    if (this.mobileStatus) opt.tlp = this.tlp
    if (this.addressStatus) opt.address = this.address
    if (this.gradeStatus) {
      // opt.grade = this.xd
      this.xSlots[0].values.forEach((item, index) => {
        if (item === this.xd) opt.grade = index - 2
      })
    }
    if (this.zoneStatus) {
      const city = this.addressCity ? `, ${this.addressCity}` : ''
      opt.ct = `${this.addressProvince}${city}`
    }
    this.welfare(opt)
    window.config.lStorage.setItem('name', this.name)
    window.config.lStorage.setItem('gender', this.gender)
    window.config.lStorage.setItem('tlp', this.tlp)
    window.config.lStorage.setItem('address', this.address)
    window.config.lStorage.setItem('xd', this.xd)
    window.config.lStorage.setItem('addressProvince', this.addressProvince)
    window.config.lStorage.setItem('addressCity', this.addressCity)
  }
}
</script>

<style lang="less" scoped>
.userInfo {
  background: url('') no-repeat left top;
  background-size: 100% auto;
  overflow: hidden;
  .title {
    font-family: PingFangSC-Medium;
    font-size: 50px;
    color: #fff;
    margin: 42px 0 0 30px;
    line-height: 70px;
  }
  .des {
    font-family: PingFangSC-Regular;
    color: #fff;
    font-size: 24px;
    line-height: 33px;
    margin: 5px 0 0 30px;
  }
  .infoBox {
    width: 690px;
    background: #FFFFFF;
    box-shadow: 0 4px 18px 0 #FBF6F3;
    border-radius: 10px;
    margin: 43px 0 0 30px;
    min-height: 110px;
    .au {
      width: 130px;
      height: 50px;
      float: right;
      border-radius: 8px;
      margin: 30px 20px 0 0;
      line-height: 50px;
      text-align: center;
    }
    .auHi {
      border: 1px solid #fff;
      background: #FFBC4D;
      color: #fff;
    }
    .auLo {
      border: 1px solid #999;
      color: #999;
    }
    .cell {
      height: 110px;
      margin: 0 40px;
      clear: left;
      .tit, .val {
        font-family: PingFangSC-Regular;
        font-size: 30px;
        color: #333333;
        float: left;
        line-height: 110px;
        width: 130px;
      }
      .val {
        width: 450px;
        float: right;
      }
      .nameInp, .pubInp {
        height: 70px;
        line-height: 70px;
        font-size: 30px;
        margin-top: 21px;
        border: none;
        background: none;
      }
      .nameInp {
        float: left;
        width: 160px;
      }
      .pubInp {
        width: 450px;
        float: right;
      }
    }
    .w3 {
      width: 300px;
      float: left;
    }
    .border-bottom {
      &:last-child::after {
        background: #fff;
      }
      &::after {
        background: #D8D8D8;
      }
    }
  }
  .statement {
    font-family: PingFangSC-Regular;
    font-size: 24px;
    line-height: 33px;
    color: #666;
    margin: 40px 40px 120px;
    p {
      color: #999;
      padding: 10px 0 0 40px;
      &::before {
        content: ' ';
        display: inline-block;
        width: 12px;
        height: 12px;
        background: #CBCBCB;
        border-radius: 12px;
        margin-left: -38px;
        margin-right: 26px;
      }
    }
  }
  .bottButt {
    width: 100%;
    color: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    height: 100px;
    font-family: PingFangSC-Regular;
    font-size: 34px;
    text-align: center;
    line-height: 100px;
  }
  .buttHi {
    background-image: linear-gradient(-90deg, #FAD961 0%, #F9AC45 30%, #F76B1C 100%);
  }
  .buttLo {
    background: #D5D5D5;
  }
  .mint-popup-bottom {
    width: 100%;
  }
  .picker-center-highlight {
    &::before, &::after {
      height: 1px; /* no */
    }
  }
}
.spinner {
  margin: -3px auto 0;
  width: 150px;
  text-align: center;
}

.spinner > div {
  width: 12px;
  height: 12px;
  background-color: #fff;
  border-radius: 100%;
  display: inline-block;
  -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
  animation: bouncedelay 1.4s infinite ease-in-out;
  /* Prevent first frame from flickering when animation starts */
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0.0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes bouncedelay {
  0%, 80%, 100% {
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 40% {
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}
</style>
