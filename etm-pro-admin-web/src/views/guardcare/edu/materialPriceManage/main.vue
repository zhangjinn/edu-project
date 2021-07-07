<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs ref="tabs" v-model="activeName" :setting="hasAuthOfBool('guardcare.materialCost.setting')" @setting="setting" @tab-click="tabChange">
          <el-tab-pane
            v-if="hasAuth('guardcare.material.queryBatch', 'tabs', 'activeName')"
            label="物品管理"
            name="tab1"
          >
            <etm-tool-bar
              v-model="formData1"
              @search="search('tab1',formData1)"
              @reset="reset('tab1',formData1)"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="hasAuth('guardcare.cost.queryBatch', 'tabs', 'activeName')"
            label="费用管理"
            name="tab2"
          >
            <etm-tool-bar
              v-model="formData2"
              @search="search('tab2',formData2)"
              @reset="reset('tab2',formData2)"
            />
          </el-tab-pane>
        </etm-tabs>
      </template>
      <template slot="body">
        <material-table
          v-if="activeName==='tab1'"
          ref="tab1"
        />
        <price-table
          v-if="activeName==='tab2'"
          ref="tab2"
        />
      </template>
    </etm-layout-split>

  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import materialTable from './firstTable/firstTable'
import priceTable from './secondTable/secondTable'

export default {
  name: 'Index',
  components: {
    materialTable,
    priceTable
  },
  mixins: [baseMixin],
  data() {
    return {
      activeName: 'tab1',
      formData1: [
        {
          label: '物品名称',
          type: 'input',
          prop: 'materialName',
          value: null,
          props: {
            placeholder: '请输入物品名称'
          }
        }
      ],
      formData2: [
        {
          label: '费用',
          type: 'input',
          prop: 'priceName',
          value: null,
          props: {
            placeholder: '请输入费用'
          }
        },
        {
          label: '使用状态',
          type: 'select',
          prop: 'status',
          value: null,
          props: {
            placeholder: '请选择使用状态'
          },
          options: [
            {
              value: '1',
              label: '已启用'
            }, {
              value: '2',
              label: '未启用'
            }
          ]
        }
      ]

    }
  },
  created() {

  },
  activated() {
    if (this.$store.state.guardcareDashboard.pageEntry === 'addMaterial') {
      this.activeName = 'tab1'
      this.$nextTick(() => {
        this.$refs.tab1.handleAdd()
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    } else if (this.$store.state.guardcareDashboard.pageEntry === 'addPrice') {
      this.activeName = 'tab2'
      this.$nextTick(() => {
        this.$refs.tab2.handleAdd()
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    }
  },
  mounted() {
    this.tabChange()
  },
  methods: {
    setting() {
      this.$router.push({ path: '/guardcareSettings/materialPriceManageSetting' })
    },
    search(ref, formData) {
      this.$refs[ref].formData = formData
      this.$refs[ref].reset()
    },
    tabChange() {
      if (this.activeName === 'tab1') {
        this.reset('tab1', this.formData1)
      } else if (this.activeName === 'tab2') {
        this.reset('tab2', this.formData2)
      }
    },
    reset(ref, formData) {
      formData.forEach((item, index) => {
        item.value = null
      })

      this.$nextTick(() => {
        this.$refs[ref].formData = formData
        this.$refs[ref].reset()
      })
    }

  }
}
</script>

<style scoped>

</style>
