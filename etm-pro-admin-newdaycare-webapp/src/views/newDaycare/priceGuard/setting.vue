<template>
  <div class="setting-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="wrapper">
          <etm-tabs
            v-model="tabsValue"
            tab-position="left"
            :show-toggle="false"
          >
            <el-tab-pane
              label="收费科目设置"
              name="price"
            >
              <div class="callWrap">
                <rule />
              </div>
            </el-tab-pane>
          </etm-tabs>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
/**
 * setting create by Administrator
 * createTime 2021/1/15 13:55
 */
import rule from '@/views/newDaycare/priceGuard/component/rule'

export default {
  name: 'Setting',
  components: {
    rule
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      tabsValue: 'price'
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.setting-wrap {
  .wrapper {
    padding-bottom: 16px;
  }
}
</style>
