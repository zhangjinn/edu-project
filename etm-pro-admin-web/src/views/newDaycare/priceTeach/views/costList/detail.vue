<template>
  <div class="detail-wrap">
    <!--    <el-carousel v-if="baseInfo.imageList.length>0" class="banner" trigger="click" height="200px">-->
    <el-carousel v-if="baseInfo.image && baseInfo.image.length" class="banner" trigger="click" height="200px">
      <el-carousel-item v-for="(item, index) in baseInfo.image" :key="index">
        <el-image :src="item.url" fit="contain" />
        <!--        <img :src="item.url" alt="">-->
      </el-carousel-item>
    </el-carousel>
    <div v-else class="defaultImg">
      <img :src="defaultImg">
    </div>
    <etm-title :show-line="false" border>
      <div class="title">
        <span>{{ baseInfo.priceName }}</span>
        <span>单价  ¥:{{ baseInfo.price }}</span>
      </div>
    </etm-title>

    <div class="desc">
      {{ baseInfo.details }}
    </div>

  </div>

</template>

<script>
/**
 * detail create by Administrator
 * createTime 2020/08/31 16:12
 */
import { queryCostDetail } from '@/api/newDaycare/materialPriceManage'

export default {
  name: 'Detail',
  components: {},
  filters: {},
  mixins: [],
  props: {
    itemId: {
      type: Number,
      default: null
    },
    trigger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      baseInfo: {
        imageList: []
        // name: null,
        // capacity: null,
        // type: null,
        // principal: null,
        // desc: null
        // enable: null
      },
      defaultImg: require('@/assets/images/daycare/img-fygl.png')
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    if (this.trigger) {
      this.init()
    }
  },
  methods: {
    init() {
      queryCostDetail({ priceId: this.itemId }).then(res => {
        this.baseInfo = res.data
        // console.log(res.data)
      })
    },
    getData(id) {
      queryCostDetail({ priceId: id }).then(res => {
        this.baseInfo = res.data
        // console.log(res.data)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-wrap {
  ::v-deep .el-image {
    height: 200px;
  }

  .banner {
    margin-bottom: 16px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .defaultImg {
    margin-bottom: 16px;
    padding-top: 24px;
    height: 200px;
    text-align: center;
    @include bgc_hover_color();
  }

  .title {
    display: flex;
    justify-content: space-between;

    span:nth-child(2) {
      @include etm-color();
    }
  }

  .desc {
    padding-bottom: 16px;
  }
}
</style>
