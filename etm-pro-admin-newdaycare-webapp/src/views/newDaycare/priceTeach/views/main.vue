<template>
  <div class="main-wrap">
    <etm-layout-split>
      <div slot="header">
        <!--         :setting="hasAuthOfBool('daycare.materialCost.setting')" @setting="setting"-->
        <etm-tabs
          ref="tabs"
          v-model="activeName"
        >
          <!--          <el-tab-pane v-if="hasAuth('daycare.material.queryBatch', 'tabs', 'activeName')" label="物品" name="article">-->
          <!--            <etm-tool-bar v-model="article" @search="articleSearch" @reset="reset" />-->
          <!--          </el-tab-pane>-->
          <el-tab-pane
            v-if="hasAuth('daycare.cost.queryBatch', 'tabs', 'activeName')"
            label="早教费用"
            name="cost"
          >
            <etm-tool-bar
              v-model="cost"
              @search="priceSearch"
              @reset="reset"
            />
          </el-tab-pane>
        </etm-tabs>
      </div>
      <div slot="body">
        <!--        <article-list v-if="activeName === 'article'" :item-type="itemSearch" />-->
        <cost-list
          v-if="activeName === 'cost'"
          :price-type="costSearch"
        />
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
/**
 * main create by Administrator
 * createTime 2020/08/31 17:10
 */
// import articleList from '@/views/daycare/materialPriceManage/views/articleList/articleList'
import costList from '@/views/newDaycare/priceTeach/views/costList/costList'
import { queryMaterialType } from '@/api/newDaycare/materialPriceManage'
import baseMixin from '@/layout/mixin/baseMixin'
export default {
  name: 'Main',
  components: {
    // articleList,
    costList
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      itemSearch: {
        name: undefined,
        materialTypeId: undefined
      },
      costSearch: {
        priceName: undefined
      },
      activeName: 'cost',
      // article: [
      //   {
      //     label: '物品名称',
      //     type: 'input',
      //     prop: 'itemName',
      //     value: '',
      //     props: {
      //       placeholder: '请输入物品名称'
      //     }
      //   },
      //   {
      //     label: '物品类型',
      //     type: 'select',
      //     prop: 'materialTypeId',
      //     value: '',
      //     options: [],
      //     props: {
      //       placeholder: '请选择'
      //     }
      //   }
      // ],
      cost: [
        {
          label: '费用名称',
          type: 'input',
          prop: 'priceName',
          value: '',
          props: {
            placeholder: '请输入费用名称'
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
    articleSearch () {
      this.itemSearch.name = this.getObjectByProp('itemName', this.article).value
      this.itemSearch.materialTypeId = this.getObjectByProp('materialTypeId', this.article).value
      // console.log(this.itemSearch)
    },
    priceSearch () {
      this.costSearch.priceName = this.getObjectByProp('priceName', this.cost).value
      // console.log(this.costSearch)
    },
    reset () {
    },
    setting () {
      this.$router.push({ path: '/newdaycare_materialPriceManagesSetting' })
    },
    init () {
      queryMaterialType().then(res => {
        const itemSearch = []
        for (let i = 0; i < res.data.length; i++) {
          itemSearch.push({
            value: res.data[i].materialTypeId,
            label: res.data[i].materialTypeName
          })
        }
        this.$set(this.article[1], 'options', itemSearch)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
