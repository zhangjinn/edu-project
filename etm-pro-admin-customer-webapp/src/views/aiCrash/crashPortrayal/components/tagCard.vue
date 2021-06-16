<template>
  <div class="tagCard-wrap">
    <template v-if="Object.keys(tags).length">
      <div
        class="event"
        @click="toggleLight"
      >
        <div class="top-tag">
          <div
            v-for="(item, index) in tags.slice(0, 2)"
            :key="index"
            :data-text="item.dataText"
            :class="['card', item.light ? 'light': '', item.animate ? 'animate': '', item.randomAnimate ? 'randomAnimate': '']"
          >
            {{ item.text }}
          </div>
        </div>
        <div class="bottom-tag">
          <template v-for="(item, index) in tags.slice(2, 6)">
            <div
              v-if="item.dataText !== '地区范围'"
              :key="index"
              :data-text="item.dataText"
              :class="['card', item.light ? 'light': '', item.animate ? 'animate': '', item.randomAnimate ? 'randomAnimate': '']"
            >
              {{ item.text }}
            </div>
            <div
              v-else
              :key="index"
              class="card no-card"
            >
              {{ item.text }}
            </div>
          </template>
        </div>
        <div class="left-tag rhombus">
          <div
            v-for="(item, index) in tags.slice(6, 15)"
            :key="index"
            :data-text="item.dataText"
            :class="['card', item.light ? 'light': '', item.animate ? 'animate': '', item.randomAnimate ? 'randomAnimate': '']"
          >
            {{ item.text }}
          </div>
        </div>
        <div class="right-tag rhombus">
          <div
            v-for="(item, index) in tags.slice(15, 24)"
            :key="index"
            :data-text="item.dataText"
            :class="['card', item.light ? 'light': '', item.animate ? 'animate': '', item.randomAnimate ? 'randomAnimate': '']"
          >
            {{ item.text }}
          </div>
        </div>
      </div>
    </template>
    <div
      :class="['start-portrayal', !portrayalText ? 'scan' : '', drawPortrayalStatus === 'drawing' ? 'drawing' : '']"
      @click.stop="startCrash"
    >
      <div class="start">
        {{ portrayalText }}
      </div>
      <div
        v-if="!canDrawPortrayal"
        class="batch"
      >
        请选择画像客户批次
      </div>
    </div>
  </div>
</template>

<script>
/**
   * tagCard create by 油麦菜
   * createTime 2021/2/1 10:03
   */
import {
  queryAreaByCode,
  startAiCrash
} from '@/api/aiCrash'
import { tagsData } from '../data'
import { getEnterpriseCurrent } from '@/api/base/base'

export default {
  name: 'TagCard',
  components: {},
  filters: {},
  mixins: [],
  props: {
    drawPortrayalStatus: {
      type: String,
      default () {
        return 'start'
      }
    },
    portrayalText: {
      type: String,
      default: '开始画像'
    },
    canDrawPortrayal: {
      type: Boolean,
      default: false
    },
    chooseBatchFormData: {
      type: Object,
      default () {
        return {}
      }
    },
    elFormRef: {
      type: Object,
      default () {
        return null
      }
    },
    portrayalList: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      tags: {},
      timer: null,
      lightTagData: [],
      address: '',
      province: '',
      city: '',
      region: ''
    }
  },
  computed: {},
  watch: {
    drawPortrayalStatus (val) {
      this.elFormRef && this.elFormRef.resetFields()
      this.setAnimateAndLight(val)
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      this.tags = this.generateTags()
      await this.getAddress()
    },
    getAddress () {
      getEnterpriseCurrent().then(res => {
        const { areaCode } = res.data
        queryAreaByCode({ code: areaCode }).then(r => {
          console.log(r.data)
          const { provinceName, cityName, countyName } = r.data
          this.province = provinceName
          this.city = cityName
          this.region = countyName
          this.address = `${provinceName}${cityName || ''}`
        })
      })
    },
    startCrash () {
      console.log(this.address)
      if (!this.elFormRef) {
        return false
      }
      this.elFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        if (!this.chooseBatchFormData.unPortrayedTotal) {
          return this.$message({
            type: 'info',
            message: '该批次客户数量为0，不能画像'
          })
        }
        if (!this.lightTagData.length) {
          return this.$message({
            type: 'info',
            message: '必须选择一个标签'
          })
        }
        if (this.drawPortrayalStatus === 'start') {
          startAiCrash({ address: this.address, batchId: this.chooseBatchFormData.batchId, queryCondition: this.lightTagData, province: this.province, city: this.city, region: this.region }).then(res => {
            if (res.data) {
              // 字典排序,父组件方便遍历
              const dict = {
                itemTotal: res.data.itemTotal,
                noItemTotal: res.data.noItemTotal,
                highItemTotal: res.data.highItemTotal,
                lowItemTotal: res.data.lowItemTotal,
                middleItemTotal: res.data.middleItemTotal
              }
              this.$emit('crashOver', dict)
            } else {
              this.$emit('crashOver', null)
            }
          })
        }
        if (!this.portrayalList.remainNum) {
          this.$emit('update:drawPortrayalStatus', 'start')
          return false
        }
        this.$emit('drawPortrayal')
      })
    },
    /*
     * 一些必要参数的说明
     * light: 卡片高亮的标志
     * text: 文本内容
     * dataText: data-text自定义属性的内容，配合伪类after的content:attr(data-text)动态设置文本内容（做动画的时候需要这个）
     * animate: 如果状态是在画像中，则一开始让全部的卡片上下浮动(做动画的是伪类after，因为父盒子有使用translateY和X布局，如果是父盒子做动画，则动画时原有布局会打乱)
     * randomAnimate: 随机设置卡片上下浮动（和animate设置的动画有所落差浮动）
     */
    generateTags (light = false, animate = false) {
      return tagsData.map(item => {
        return {
          light: false,
          text: item.text,
          dataText: item.text,
          animate: animate,
          randomAnimate: false
        }
      })
    },
    setAnimateAndLight (val) {
      if (val === 'drawing') {
        this.tags = this.generateTags(false, true)
        this.tags.forEach(item => {
          // 动画之前让父盒子的内容清空
          if (item.text !== '地区范围') item.text = ''
          item.light = Math.random() > 0.5
          item.randomAnimate = Math.random() > 0.5
        })
        // 设置随机高亮
        this.timer && clearInterval(this.timer)
        this.timer = setInterval(_ => {
          // this.tags.forEach(item => {
          //   item.light = Math.random() > 0.5
          // })
          this.tags.forEach(item => {
            item.light = false
          })
          const indexSet = new Set()
          let flag = 1
          while (flag) {
            const index = Math.floor(Math.random() * 23)
            indexSet.add(index)
            this.tags[index].light = true
            if (indexSet.size >= (Math.floor(Math.random() * 3) + 3)) {
              flag = 0
              break
            }
          }
        }, 100)
      } else if (val === 'end') {
        clearInterval(this.timer)
        this.tags = this.generateTags()
        // 结束的时候也让部分卡片高亮
        this.tags.forEach(item => {
          item.light = Math.random() > 0.5
          if (item.text === '地区范围') {
            item.light = false
          }
        })
      } else {
        clearInterval(this.timer)
        this.tags = this.generateTags()
      }
    },
    toggleLight (e) {
      if (this.drawPortrayalStatus === 'start' && e.target.className.includes('card')) {
        if (e.target.innerHTML.trim() === '地区范围') return
        e.target.classList.toggle('light')
        this.getLightTag()
      }
    },
    getLightTag () {
      const lightTagData = [...document.querySelectorAll('.light')].map(item => item.innerHTML.trim())
      // this.lightTagData = mapTags(lightTagData)
      this.lightTagData = []
      lightTagData.forEach(item => {
        const tmp = tagsData.filter(data => data.text === item)[0]
        if (tmp && tmp.text !== '地区范围') {
          this.lightTagData.push({
            queryCondition: tmp.formText,
            type: tmp.type
          })
        }
      })
      console.log(this.lightTagData)
    }
  }
}
</script>
<style lang="scss" scoped>

  .tagCard-wrap {
    [class|=card], [class~=light], .animate {
      position: relative;
      width: 128px;
      height: 46px;
      text-align: center;
      line-height: 46px;
      color: rgba(#ffffff, .5);
      font-size: 14px;
      font-weight: 400;
      &:after {
        position: absolute;
        left: 0;
        top: 0;
        content: attr(data-text); /*获取文本内容*/
        width: 128px;
        height: 46px;
        text-align: center;
        line-height: 46px;
        color: rgba(#ffffff, .5);
        font-size: 14px;
        font-weight: 400;
      }
    }
    [class|=card] {
      background: url("../../../../assets/images/card-normal.png") no-repeat;
      background-size: 100% 100%;
    }
    /*  动画,上下浮动*/
    @keyframes floatAnimate {
      from {
        transform: translateY(0px);
      }
      to {
        transform: translateY(8px);
      }
    }
    /*  动画,上下浮动和上一个动画相反，形成落差感*/
    @keyframes floatAnimate1 {
      from {
        transform: translateY(8px);
      }
      to {
        transform: translateY(0px);
      }
    }
    .animate {
      /*一开始的时候是全部动画一起上下整齐的浮动，且背景图片是暗的*/
      &:after {
        background: url("../../../../assets/images/card-normal.png") no-repeat;
        background-size: 100% 100%;
        animation: floatAnimate 1s linear infinite alternate;
      }
    }
    .randomAnimate {
      /*然后是随机一些盒子相反的浮动，形成落差感，此时背景图片不变，由高亮的类名控制背景高亮*/
      &:after {
        animation: floatAnimate1 1s linear infinite alternate;
      }
    }
    .light {
      /*控制卡片随机高亮*/
      &:after {
        color: #ffffff;
        background: url("../../../../assets/images/card-light.png") no-repeat;
        background-size: 100% 100%;
      }
    }

    .top-tag, .bottom-tag {
      position: absolute;
      left: 50%;
      display: flex;
      justify-content: space-between;
      transform: translateX(-50%);
    }
    .top-tag {
      top: 193px;
      width: 300px;
    }
    .bottom-tag {
      bottom: 125px;
      align-items: center;
      width: 485px;
      height: 105px;
      .no-card {
        color: #ffffff;
      }
      .card {
        position: absolute;
      }
      .card:nth-child(1), .card:nth-child(4) {
        top: 50%;
        transform: translateY(-50%);
      }
      .card:nth-child(2), .card:nth-child(3) {
        left: 50%;
        transform: translateX(-50%);
      }
      .card:nth-child(1) {
        left: 0;
      }
      .card:nth-child(2) {
        top: 0;
      }
      .card:nth-child(3) {
        bottom: 0;
      }
      .card:nth-child(4) {
        right: 0;
      }
    }

    .left-tag, .right-tag {
      position: absolute;
      top: 50%;
      width: 450px;
      height: 355px;
      transform: translateY(-50%);
    }
    .left-tag {
      left: 11%;
    }
    .right-tag {
      right: 11%;
    }

    /*上到下一个菱形*/
    [class~=rhombus] {
      .card {
        position: absolute;
      }
      .card:nth-child(1) {
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      .card:nth-child(2), .card:nth-child(3) {
        top: 21%;
      }
      .card:nth-child(2) {
        left: 80px;
      }
      .card:nth-child(3) {
        right: 80px;
      }

      .card:nth-child(4), .card:nth-child(5), .card:nth-child(6) {
        top: 50%;
        transform: translateY(-50%);
      }
      .card:nth-child(4) {
        left: 0;
      }
      .card:nth-child(5) {
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .card:nth-child(6) {
        right: 0;
      }

      .card:nth-child(7), .card:nth-child(8) {
        bottom: 21%;
      }
      .card:nth-child(7) {
        left: 80px;
      }
      .card:nth-child(8) {
        right: 80px;
      }
      .card:nth-child(9) {
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
      }
    }

    /*中间的头像*/
    .start-portrayal {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 230px;
      height: 153px;
      background: url("../../../../assets/images/normal-status.png") no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
      user-select: none;
      &:hover {
        cursor: pointer;
        background: url("../../../../assets/images/hover-status.png") no-repeat;
        background-size: 100% 100%;
      }
      .start {
        font-size: 18px;
        font-weight: 700;
        color: #FFFFFF;
      }
      .batch {
        font-size: 12px;
        font-weight: 400;
        color: #FFFFFF;
        opacity: 0.8;
      }
    }
    /*动画时中间的棍子*/
    .scan {
      width: 230px;
      height: 153px;
      background: url("../../../../assets/images/crash-scan.png") no-repeat;
      background-size: 100% 100%;
      /*覆盖之前的hover样式，使其动画时一直是头像的图片*/
      &:hover {
        cursor: pointer;
        background: url("../../../../assets/images/crash-scan.png") no-repeat;
        background-size: 100% 100%;
      }
      @keyframes scanAnimate {
        50% {
          width: 210px;
        }

        100% {
          width: 90px;
          transform: translateY(136px);
        }
      }
      &:after {
        display: block;
        position: absolute;
        top: 0;
        content: '';
        width: 90px;
        height: 20px;
        background: url("../../../../assets/images/scan-stick.png") no-repeat;
        background-size: 100% 100%;
        animation: scanAnimate 1s linear infinite alternate;
      }
    }
    @keyframes avatarLight {
      to {
        background: url("../../../../assets/images/hover-status.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    /*动画时让头像高亮*/
    .drawing {
      animation: avatarLight 1s linear infinite alternate;
    }

    /*  150原型更新*/
    .card {
      user-select: none;
      cursor: pointer;
    }
  }
</style>
