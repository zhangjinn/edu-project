<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split :left-styles="{minWidth: 'calc(100% - 256px)', maxWidth: 'calc(100% - 256px)'}">
        <div slot="left">
          <div class="title">
            中华人民共和国学前教育法草案（征求意见稿）
          </div>
          <div class="subTitle">
            <span>2020-05-26 10:22:23</span>
            <span>来源：教育部</span>
            <span>字数：5569</span>
          </div>
          <div class="headerFileImg">
            <img src="../../../../../assets/images/guardcare/fileTitle.png">
          </div>
          <div class="contentText">
            <agreement />
          </div>
        </div>
        <div slot="right">
          <right-content />
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
import agreement from '@/views/newDaycare/dashboard/contentGuide/policy/component/agreement'
import rightContent from '@/views/newDaycare/dashboard/contentGuide/component/rightContent'

/**
 * index create by Administrator
 * createTime 2020/9/8 15:28
 */
export default {
  name: 'Index',
  components: {
    agreement,
    rightContent
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .title {
    @include c_title_color();
    font-size: 16px;
    font-weight: bold;
    padding: 16px 0;
  }

  .subTitle {
    @include c_secondary_color();

    span {
      margin-right: 16px;
    }
  }

  .headerFileImg {
    padding: 16px 0;
    text-align: center;
  }
}
</style>
