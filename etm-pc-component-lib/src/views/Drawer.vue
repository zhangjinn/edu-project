<template>
  <div class="EtmDrawer-wrap">
    <etm-layout-split>
      <etm-title title="标题哦~">
        <template slot="tool">
          <el-button type="text" @click="small = true">打开小弹窗</el-button>
          <el-button type="text" @click="big = true">打开大弹窗</el-button>
        </template>
      </etm-title>

      <etm-title title="标题哦~">
        <template slot="tool">
          <el-button type="primary" icon="el-icon-plus" @click="small = true">打开小弹窗</el-button>
        </template>
      </etm-title>

      <etm-drawer :visible.sync="small" :before-close="before">
        <etm-layout-split line>
          <div slot="header">
            <etm-title border size="big" title="脑壳呢~">
              <div slot="tool">
                <el-button type="primary" size="mini" @click="handleDialog">弹窗</el-button>
                <el-button type="primary" size="small">编辑</el-button>
              </div>
            </etm-title>
          </div>
          <template slot="body">
            123
          </template>
        </etm-layout-split>
      </etm-drawer>
      <etm-drawer type="big" :visible.sync="big">
        <etm-layout-split style="height: 100%">
          <div slot="left">
            <etm-field-label label="姓名">Jack 马</etm-field-label>
            <etm-field-label label="姓名">Jack 马</etm-field-label>
          </div>
          <div slot="right">
            <etm-tabs>
              <el-tab-pane label="测试" />
              <el-tab-pane label="测试" />
              <el-tab-pane label="测试" />
            </etm-tabs>
          </div>
        </etm-layout-split>
      </etm-drawer>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * EtmDrawer create by haijinsha
 * createTime 2020/8/19 15:59
 */
export default {
  name: 'Drawer',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      small: false,
      big: false
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    before(done) {
      alert('1秒后关闭')
      setTimeout(() => {
        done()
      }, 1000)
    },
    handleDialog() {
      this.$etmTip.init({
        confirm() {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>
<style lang="scss" scoped>
  .EtmDrawer-wrap {

  }
</style>
