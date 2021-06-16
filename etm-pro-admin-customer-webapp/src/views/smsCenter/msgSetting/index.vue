<template>
  <div class="index-wrap">
    <etm-layout-split>
      <div class="wrapper">
        <etm-tabs
          v-model="tabsValue"
          tab-position="left"
          :show-toggle="false"
        >
          <el-tab-pane
            v-for="(tab, index) in tabsList"
            :key="index"
            :label="tab.label"
            :name="tab.name"
          >
            <component
              :is="tab.component"
              v-if="tabsValue === tab.name"
            />
          </el-tab-pane>
        </etm-tabs>
      </div>
    </etm-layout-split>
  </div>
</template>

<script>

import msgTemplate from './msgTemplate'
import msgSignature from './msgSignature'
// import msgPromote from '@/views/daycare/smsCenter/msgSetting/msgPromote'

/**
 * index create by Administrator
 * createTime 2020/08/31 17:32
 */
export default {
  name: 'Index',
  components: {
    msgTemplate
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      tabsValue: 'msgTemplate',
      tabsList: [{
        label: '通知类短信模板',
        name: 'msgTemplate',
        component: msgTemplate
      },
      {
        label: '通知类短信签名',
        name: 'msgSignature',
        component: msgSignature
      }
      // {
      //   label: '推广类短信签名',
      //   name: 'msgPromote',
      //   component: msgPromote
      // }
      ]
    }
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
  //padding-top: 16px;

  .wrapper {
    padding-bottom: 16px;
  }
}
</style>
