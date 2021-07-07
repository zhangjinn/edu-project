<template>
  <div class="drag-wrap">
    <div ref="addMealsRef" class="add-meals" :size="size" @click="addMeals">
      <van-icon name="plus" />
    </div>
  </div>

</template>

<script>
/**
 * drag create by 油麦菜
 * createTime 2020/9/22 19:51
 */
export default {
  name: 'Drag',
  components: {},
  filters: {},
  mixins: [],
  props: {
    size: {
      type: String,
      default() {
        return 'default'
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    // 监听元素被点击
    this.$refs.addMealsRef.addEventListener('touchstart', event => {
      // event.preventDefault()
      event.stopPropagation()
      // 获取当前窗口的大小
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      // 获取当前触摸坐标
      const currentX = event.touches[0].pageX
      const currentY = event.touches[0].pageY
      // 获取元素的大小
      const elementWidth = this.$refs.addMealsRef.offsetWidth
      const elementHeight = this.$refs.addMealsRef.offsetHeight
      // 获取元素到屏幕边缘的距离
      const element2screenL = this.$refs.addMealsRef.offsetLeft
      const element2screenT = this.$refs.addMealsRef.offsetTop
      // console.log(element2screenL, element2screenT)
      // 计算当前鼠标到元素边缘的距离
      const mouse2elementX = currentX - element2screenL
      const mouse2elementY = currentY - element2screenT
      // console.log(mouse2elementX, mouse2elementY)
      // 开始监听元素是否移动
      this.$refs.addMealsRef.addEventListener('touchmove', event => {
        event.preventDefault()
        event.stopPropagation()
        // 动态获取当前鼠标的坐标
        const dynamicX = event.touches[0].pageX
        const dynamicY = event.touches[0].pageY
        // 计算元素要移动的坐标
        let moveX = dynamicX - mouse2elementX
        let moveY = dynamicY - mouse2elementY
        // 限制元素的移动范围
        if (moveX < 0) {
          moveX = 0
        } else if (moveX > screenWidth - elementWidth) {
          moveX = screenWidth - elementWidth
        }
        if (moveY < 0) {
          moveY = 0
        } else if (moveY > screenHeight - elementHeight) {
          moveY = screenHeight - elementHeight
        }
        // 将坐标赋值给元素
        this.$refs.addMealsRef.style.left = moveX + 'px'
        this.$refs.addMealsRef.style.top = moveY + 'px'
      }, false)
    }, false)
  },
  methods: {
    addMeals() {
      this.$router.push('/add_mealsRecord')
    }
  }
}
</script>
<style lang="scss" scoped>
.drag-wrap {
  .add-meals{
    position: fixed;
    top: 80%;
    right: 20px;
    background: $theme;
    border-radius: 50%;
    //border: 1px solid #ff0000;
    .van-icon-plus{
      position: absolute;
      top: 50%;
      left: 50%;
      color: #FFFFFF;
      font-size: 20px;
      transform: translate(-50%, -50%);
    }
    &[size='default'] {
      width: 2rem;
      height: 2rem;
    }
    &[size='mini'] {
      width: 1rem;
      height: 1rem;
    }
    &[size='normal'] {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
}
</style>
