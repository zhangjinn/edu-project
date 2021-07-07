<template>
  <div class="cloudOrder">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="tabs">
          <el-tab-pane v-for="tab in tabsList" :key="tab.name" :label="tab.label" :name="tab.name">
            <etm-tool-bar v-model="tab.filters" @search="handleSearch" @reset="reset" />
          </el-tab-pane>
        </etm-tabs>
      </div>

      <div slot="body">
        <cloudOrder :search-info="orderInfo" />
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
// import EtmClazzCascader from '@/components/EtmClazzCascader'
import cloudOrder from './table/cloudOrder'

export default {
  name: 'Index',
  components: {
    // EtmClazzCascader,
    cloudOrder
  },
  data() {
    return {
      tabs: 'cloudOrder',
      clear: false,
      clazzValue: [],
      orderInfo: {},
      tabsList: [
        {
          label: '云视频订单',
          name: 'cloudOrder',
          filters: [
            {
              type: 'input',
              label: '订单编号',
              prop: 'orderNumber',
              props: {
                placeholder: '请输入订单编号'
              },
              value: ''
            },
            {
              type: 'input',
              label: '家长姓名',
              prop: 'parentName',
              props: {
                placeholder: '请输入家长姓名'
              },
              value: ''
            },
            {
              type: 'input',
              label: '家长电话',
              prop: 'parentPhone',
              props: {
                placeholder: '请输入家长电话'
              },
              value: ''
            }
          ]
        }
      ]
    }
  },
  methods: {
    getClazz(value) {
      this.clazzValue = value
    },
    // 搜索查询
    handleSearch(value) {
      const searchInfo = {}
      if (this.clazzValue.length) {
        searchInfo.gradId = this.clazzValue[0]
        searchInfo.clazzId = this.clazzValue[1]
      }
      // 遍历value 将item的每个
      value.forEach(item => {
        searchInfo[item.prop] = item.value
      })
      this.orderInfo = searchInfo
      // console.log(this.orderInfo, 'order')
    },
    // 重置orderInfo
    reset() {
      this.orderInfo = {}
    }
  }
}
</script>

<style scoped lang="scss">
.cloudOrder {
  margin-top: 16px;
}
</style>
