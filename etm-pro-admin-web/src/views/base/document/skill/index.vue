<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split :left-styles="{minWidth: 'calc(100% - 317px)', maxWidth: 'calc(100% - 317px)'}">
        <div slot="left">
          <div class="title">托育中心如何设计一日流程？</div>
          <div class="subTitle">
            <span>2020-08-07</span>
          </div>
          <div class="headerFileImg">
            <img src="../../../../assets/images/guardcare/document_image3.jpeg">
          </div>
          <div class="contentText">
            <file />
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
import file from '@/views/base/document/skill/file'
import rightContent from '@/views/base/document/component/rightContent'

/**
 * index create by Administrator
 * createTime 2020/9/8 15:28
 */
export default {
  name: 'Index',
  components: {
    file,
    rightContent
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .title {
    padding: 16px 0;
    font-size: 16px;
    @include c_title_color();
    font-weight: bold;
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
