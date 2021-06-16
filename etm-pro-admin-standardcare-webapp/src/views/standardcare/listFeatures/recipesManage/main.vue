<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs
          ref="tabs"
          v-model="activeName"
          :setting="true"
          @setting="setting"
          @tab-click="tabChange"
        >
          <el-tab-pane
            label="食谱库"
            name="tab1"
          >
            <etm-tool-bar
              v-model="formData1"
              @search="search('tab1',formData1)"
              @reset="reset('tab1',formData1)"
            />
          </el-tab-pane>
          <el-tab-pane
            label="菜肴库"
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

import { queryLabelList, queryScopeList, queryFoodTypeList } from '@/api/standardcare/listFeatures/recipesManage'

export default {
  name: 'Index',
  components: {
    materialTable,
    priceTable
  },
  mixins: [baseMixin],
  data () {
    return {
      activeName: 'tab1',
      formData1: [
        {
          label: '食谱名称',
          type: 'input',
          prop: 'name',
          value: null,
          props: {
            filterable: true,
            placeholder: '请输入食谱名称'
          }
        },
        {
          label: '适用范围',
          type: 'select',
          prop: 'range',
          value: null,
          props: {
            filterable: true,
            placeholder: '请选择适用范围'
          },
          options: []
        },
        {
          label: '标签',
          type: 'select',
          prop: 'tag',
          value: [],
          props: {
            filterable: true,
            multiple: true,
            placeholder: '请选择标签'
          },
          options: []
        }
      ],
      formData2: [
        {
          label: '菜肴名称',
          type: 'input',
          prop: 'name',
          value: null,
          props: {
            placeholder: '请输入菜肴名称'
          }
        },
        {
          label: '菜肴类型',
          type: 'select',
          prop: 'type',
          value: null,
          props: {
            placeholder: '请选择菜肴类型'
          },
          options: []
        }
      ]

    }
  },
  created () {
    this.queryScopeOptions()
    this.queryLabelOptions()
  },
  activated () {

  },
  mounted () {
    this.$nextTick(() => {
      this.tabChange()
    })
  },
  methods: {
    setting () {
      this.$router.push({ path: '/standardcare_recipesManageSetting' })
    },

    search (ref, formData) {
      this.$refs[ref].formData = formData
      this.$refs[ref].reset()
    },
    tabChange () {
      console.log(this.activeName)
      if (this.activeName === 'tab1') {
        this.reset('tab1', this.formData1)
      } else if (this.activeName === 'tab2') {
        this.getFoodTypeData()
        this.reset('tab2', this.formData2)
      }
    },
    reset (ref, formData) {
      formData.forEach((item, index) => {
        item.value = null
      })

      setTimeout(() => {
        this.$refs[ref].formData = formData
        this.$refs[ref].reset()
      }, 300)
    },

    // 适用范围列表
    queryScopeOptions () {
      queryScopeList().then(res => {
        if (res.data) {
          this.formData1[1].options = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    },
    // 标签列表
    queryLabelOptions () {
      queryLabelList().then(res => {
        if (res.data) {
          this.formData1[2].options = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    },
    // 菜肴类型
    getFoodTypeData () {
      if (this.formData2[1].options.length > 0) {
        return
      }
      queryFoodTypeList().then(res => {
        if (res.data) {
          this.formData2[1].options = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
