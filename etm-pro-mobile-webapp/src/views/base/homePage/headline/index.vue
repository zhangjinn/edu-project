<template>
  <div class="index-wrap">
    <etm-mobile-title @reback="reback">
      <div class="title">{{ title }}</div>
    </etm-mobile-title>
    <div class="content" v-html="headlineData.content" />
  </div>

</template>

<script>/**
 * index create by Administrator
 * createTime 2020/11/24 18:22
 */

import { queryHeadLineById } from '@/service/base/basic'
import EtmMobileTitle from '@/components/EtmMobileTitle'

export default {
  name: 'Index',
  components: { EtmMobileTitle },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      headlineId: null,
      headlineData: {},
      title: ''
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.headlineId = this.$route.query.headlineId
    this.getDetail()
  },
  methods: {
    reback() {
      this.$router.back(-1)
    },
    getDetail() {
      queryHeadLineById({ industryHeadlinesId: this.headlineId }).then(res => {
        this.headlineData = res.data.data
        this.title = this.headlineData.title
        // this.slideTitle()
      })
    },
    slideTitle() {
      const title = this.headlineData.title
      if (title && title.length > 21) {
        let count = -1
        const timer = setInterval(() => {
          count++
          const end = count + 21
          this.title = title.substring(count, end)
          if (end === title.length) {
            clearInterval(timer)
            setTimeout(() => {
              this.slideTitle(this.headlineData.title)
            }, 3000)
          }
        }, 500)
      } else {
        this.title = title
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  min-height: 100%;
  background-color: $white;

  .title {
    margin: 0 auto;
    max-width: 80%;
    white-space: nowrap;
    overflow-x: auto;
  }

  .content {
    padding: 12px;
    width: 100vw;
    text-align: left;
    overflow: auto;

    ::v-deep img {
      width: 100% !important;
    }
  }
}
</style>
