<template>
  <div class="index-wrap">
    <etm-layout-split>
      <etm-tabs v-model="activeTab" tab-position="left" :show-toggle="false">
        <el-tab-pane label="收款信息设置" name="payAccountSetting">
          <payAccountSetting />
        </el-tab-pane>
        <el-tab-pane label="公众号授权设置" name="wechatAuth">
          <wechatAuth />

        </el-tab-pane>
        <el-tab-pane label="萤石云授权设置" name="yingshiyunAuth">
          <yingshiyunAuth />
        </el-tab-pane>
      </etm-tabs>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * index create by haijinsha
 * createTime 2021/1/19 13:37
 */
import wechatAuth from '../systemSetting/index'
import payAccountSetting from '@/views/base/payAccountSetting'
import yingshiyunAuth from '@/views/base/cameraSetting/index'

export default {
  name: 'Index',
  components: { wechatAuth, payAccountSetting, yingshiyunAuth },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      activeTab: 'payAccountSetting'
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  margin-top: 16px;
  padding-bottom: 16px;
  background: #fff;

  ::v-deep .collectionManage {
    .subBreadCrumb {
      padding-bottom: 16px;
      line-height: 12px;

      &.hide {
        display: none;
      }
    }

    .layout-default {
      padding-top: 0;
    }
  }

  ::v-deep .systemSetting {
    .content {
      margin: 0;
    }
  }

  ::v-deep .cameraSetting {
    margin: 0;

    .layout-default {
      padding-top: 0;
    }
  }
}
</style>
