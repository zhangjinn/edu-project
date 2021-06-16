<template>
  <div class="card-wrap">
    <div class="cards">
      <template v-if="cards.length">
        <div
          v-for="item in cards"
          :key="item.resultCustomerAddressId"
          class="card"
        >
          <div class="avatar">
            <span class="iconfont iconmorentouxiang" />
          </div>
          <div class="tags">
            <div
              v-for="(it, ind) in item.tagList"
              :key="ind"
              class="tag"
            >
              {{ it }}
            </div>
          </div>
          <div class="op-con">
            <div
              v-if="isOver"
              class="operate"
              @click.stop="$emit('getCustomerEmit', item)"
            >
              获取客户 <span />
            </div>
            <div
              v-else
              class="operate"
            >
              冷却中... <span />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
/**
   * card create by 油麦菜
   * createTime 2021/1/11 11:20
   */
export default {
  name: 'Card',
  components: {},
  filters: {},
  mixins: [],
  props: {
    cardsProp: {
      type: Array,
      default () {
        return []
      }
    },
    isOver: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      cards: [],
      tmpCards: [],
      timer: null
    }
  },
  computed: {},
  watch: {
    cardsProp (val) {
      this.tmpCards = val.slice(0, val.length)
      this.pushData()
    }
  },
  created () {
  },
  mounted () {
    document.querySelectorAll('.card').forEach((item, index) => {
      item.style.top = `${index * 66}px`
    })
    const elCards = document.querySelector('.cards')
    elCards.addEventListener('animationend', (e) => {
      e.target.style.display = 'none'
      const length = [...elCards.querySelectorAll('.card')].filter(item => item.style.display === 'none').length
      if (length >= 2) {
        this.cards.splice(0, length)
      }
    })
    let running = true
    elCards.addEventListener('animationstart', (e) => {
      // 鼠标进入事件触发比动画开始事件要快，所以先判断是否有动画，有的时候才添加数据，避免盒子堆成一团
      if (running) {
        this.pushData()
      }
    })
    elCards.addEventListener('mouseenter', (e) => {
      this.timer && clearTimeout(this.timer)
      this.animeStatus(elCards, '.card', 'paused')
      running = false
    })
    elCards.addEventListener('mouseleave', (e) => {
      this.animeStatus(elCards, '.card', 'running')
      running = true
      this.pushData()
    })
  },
  methods: {
    pushData () {
      this.timer = setTimeout(() => {
        if (this.tmpCards.length) {
          this.cards.push(this.tmpCards.shift())
        } else {
          // 一组数据空了，需要重新请求数据
          this.$emit('emptyData')
        }
        // this.tmpCards.length && this.cards.push(this.tmpCards.shift())
      }, 2000)
    },
    animeStatus (ele, selector, status) {
      ele.querySelectorAll(selector).forEach(item => {
        item.style.animationPlayState = status
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .card-wrap {
    @keyframes cardDown {
      0% {
        transform: translateY(0);
        opacity: 0;
      }

      25% {
        opacity: 1;
      }

      75% {
        opacity: 1;
      }

      100% {
        transform: translateY(450px);
        opacity: 0;
      }
    }
    .cards {
      position: relative;
      width: 100%;
      .card {
        animation: cardDown 10s linear;
        position: absolute;
        display: flex;
        align-items: center;
        padding-left: 22px;
        width: 415px;
        height: 44px;
        background: url("../../../assets/images/card-tag.png") no-repeat;
        background-size: 100% 100%;
        box-shadow: 0 6px 7px 0 rgba(25, 22, 18, 0.3);
        &:hover {
          cursor: pointer;
          .op-con {
            display: block;
            cursor: pointer;
          }
        }
        .avatar {
          margin-right: 8px;
          .iconmorentouxiang {
            color: #ffffff;
            font-size: 25px;
          }
        }
        .tags {
          display: flex;
          .tag {
            margin-right: 5px;
            height: 24px;
            line-height: 24px;
            padding: 0 8px;
            font-size: 14px;
            font-weight: 400;
            color: #FFFFFF;
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
          }
        }
        .op-con {
          display: none;
          position: absolute;
          right: 7px;
          bottom: -45px;
          width: 100px;
          height: 45px;
          background: transparent;
        }
        .operate {
          position: absolute;
          right: 0;
          bottom: 0;
          padding: 0 20px;
          height: 36px;
          line-height: 36px;
          font-size: 14px;
          font-weight: 400;
          color: #FFFFFF;
          background: rgba(241, 106, 6, 0.8);
          border: 1px solid #FE6700;
          border-radius: 2px;
          span {
            position: absolute;
            left: 50%;
            top: -10px;
            width: 0;
            height: 0;
            border: 5px solid;
            border-color: transparent transparent #FE6700;
            transform: translateX(-50%);
          }
        }
      }

      .card:nth-child(2n) {
        right: 0;
      }
    }
  }
</style>
