<template>
  <etm-main-body>
    <etm-layout-split>
      <div class="productDetail-wrap">
        <div class="title">{{ productDetail.title }}</div>
        <div class="date-time">发布时间: {{ productDetail.date }}</div>
        <div class="content" v-html="productDetail.content" />
      </div>
    </etm-layout-split>
  </etm-main-body>

</template>

<script>/**
 * productDetail create by haijinsha
 * createTime 2020/11/6 16:11
 */

import { queryProductDynamicById } from '@/api/base/base'
import EtmMainBody from '@/layout/main/EtmMainBody/src/EtmMainBody'
import { parseTime } from '@/utils'
import { queryIndustryHeadlineById } from '@/api/base/dashboard'

export default {
  name: 'ProductDetail',
  components: { EtmMainBody },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      productDetail: {
        productNewsId: '',
        type: '',
        title: '',
        content: '',
        date: ''
      }
    }
  },
  computed: {},
  watch: {
    '$route': {
      handler() {
        this.init()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { productNewsId, id } = this.$route.query
      if (productNewsId) {
        return queryProductDynamicById({ id: productNewsId }).then(res => {
          this.productDetail = res.data
          this.productDetail.date = parseTime(this.productDetail.createTime, '{y}-{m}-{d}')
        })
        // this.productDetail = {
        //   'productNewsId': 26,
        //   'type': 'UPGRADE',
        //   'title': '廖丽',
        //   'content': '程芳',
        //   date: 1604486291000
        // }
      }
      // 行业头条
      if (id) {
        queryIndustryHeadlineById({ industryHeadlinesId: id }).then(res => {
          this.productDetail = res.data
          this.productDetail.date = parseTime(this.productDetail.createTime, '{y}-{m}-{d}')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.productDetail-wrap {
  height: 100%;
  background-color: #fff;
  padding-bottom: 16px;

  .title {
    text-align: center;
    color: $title-color;
    font-size: 22px;
    font-weight: bold;
  }

  .date-time {
    margin-top: 16px;
    text-align: center;
    color: $secondary-color;
    font-size: 14px;
  }

  .content {
    width: 960px;
    margin: 0 auto;
  }
}
</style>

