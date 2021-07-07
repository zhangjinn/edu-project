<template>
  <div class="detail-wrap">
    <!--    <el-carousel v-if="baseInfo.imageList.length>0" class="banner" trigger="click" height="200px">-->
    <el-carousel v-if="baseInfo.imageList && baseInfo.imageList.length" class="banner" trigger="click" height="200px">
      <el-carousel-item v-for="(item, index) in baseInfo.imageList" :key="index">
        <el-image :src="item.url" fit="contain" />
        <!--        <img :src="item.url" alt="">-->
      </el-carousel-item>
    </el-carousel>
    <div v-else class="defaultImg">
      <img :src="defaultImg">
    </div>
    <etm-title :show-line="false" border>
      <div class="title">
        <span>{{ baseInfo.materialName }}</span>
        <span>单价  ¥:{{ baseInfo.price }}</span>
      </div>
    </etm-title>

    <div class="desc">
      {{ baseInfo.details }}
    </div>
    <etm-title :show-line="false" border>
      <div class="title">
        <span>物品信息</span>
      </div>
    </etm-title>

    <ul>
      <li>
        <etm-field-label label="物品类型">{{ baseInfo.materialTypeName }}</etm-field-label>
      </li>
    </ul>
  </div>

</template>

<script>
/**
 * detail create by Administrator
 * createTime 2020/08/31 16:12
 */
import { queryArticleDetail } from '@/api/newDaycare/materialPriceManage'

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
        // materialName: null,
        // capacity: null,
        // type: null,
        // principal: null,
        // desc: null
        // enable: null
      },
      defaultImg: require('@/assets/images/daycare/img-wpgl.png')
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
      queryArticleDetail({ materialId: this.itemId }).then(res => {
        // console.log(res.data)
        this.baseInfo = res.data
      })
    },
    getData(id) {
      queryArticleDetail({ materialId: id }).then(res => {
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
