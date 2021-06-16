<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <!--:setting="hasAuthOfBool('guardcare.recipes.setting')"-->
        <etm-tabs
          ref="tabs"
          v-model="activeName"
          @tab-click="tabChange"
        >
          <!--v-if="hasAuth('guardcare.recipes.queryBatch', 'tabs', 'activeName')"-->
          <el-tab-pane
            label="人群管理"
            name="tab1"
          >
            <etm-tool-bar
              v-model="formData1"
              @search="search('tab1',formData1)"
              @reset="reset('tab1',formData1)"
            />
          </el-tab-pane>

          <el-tab-pane
            label="食材库"
            name="tab2"
          >
            <etm-tool-bar
              v-model="formData2"
              @search="search('tab2',formData2)"
              @reset="reset('tab2',formData2)"
            />
          </el-tab-pane>

          <!--v-if="hasAuth('guardcare.food.queryBatch', 'tabs', 'activeName')"-->
          <el-tab-pane
            label="菜肴库"
            name="tab3"
          >
            <etm-tool-bar
              v-model="formData3"
              @search="search('tab3',formData3)"
              @reset="reset('tab3',formData3)"
            />
          </el-tab-pane>
        </etm-tabs>
      </template>

      <template slot="body">
        <group-manage
          v-if="activeName === 'tab1'"
          ref="tab1"
        />
        <food-warehouse
          v-if="activeName === 'tab2'"
          ref="tab2"
        />
        <cook-food-warehouse
          v-if="activeName === 'tab3'"
          ref="tab3"
        />
      </template>
    </etm-layout-split>
  </div>
</template>

<script>
/**
 * main create by Administrator
 * createTime 2021/3/22 11:50
 */
import groupManage from './components/groupManage/index'
import foodWarehouse from './components/foodWarehouse/index'
import cookFoodWarehouse from './components/cookFoodWarehouse/index'
export default {
  name: 'Main',
  components: { groupManage, foodWarehouse, cookFoodWarehouse },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      activeName: 'tab1',
      formData1: [
        {
          label: '人群名称',
          type: 'input',
          value: '',
          prop: 'peopleName',
          props: {
            placeholder: '请输入人群名称'
          }
        }
      ],
      formData2: [
        {
          label: '食材类型',
          type: 'select',
          value: '',
          prop: 'foodType',
          props: {
            placeholder: '请选择食材类型'
          },
          options: []
        },
        {
          label: '食材名称',
          type: 'input',
          value: '',
          prop: 'foodName',
          props: {
            placeholder: '请输入食材名称'
          }
        }
      ],
      formData3: [
        {
          label: '菜肴类型',
          type: 'select',
          value: '',
          prop: 'coodFoodType',
          props: {
            placeholder: '请选择菜肴类型'
          }
        },
        {
          label: '菜肴名称',
          type: 'input',
          value: '',
          prop: 'cookFoodName',
          props: {
            placeholder: '请输入菜肴名称'
          }
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
    },
    async tabChange () {
      if (this.activeName === 'tab1') {
        this.getGradeList()
        await this.getSemesterSettingData()
        this.search('tab1', this.formData1)
      } else if (this.activeName === 'tab2') {
        this.getIngredientsTypeData()
        this.search('tab2', this.formData2)
      } else if (this.activeName === 'tab3') {
        this.getFoodTypeData()
        this.search('tab3', this.formData3)
      }
    },

    search (ref, formData) {
      const that = this
      this.$nextTick(() => {
        that.$refs[ref].formData = formData
        console.log(this.$refs[ref].formData, 'form')
        that.$refs[ref].reset()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
