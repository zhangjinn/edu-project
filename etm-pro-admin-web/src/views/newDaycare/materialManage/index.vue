<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs ref="tabs" v-model="activeName" :setting="true" @setting="setting">
            <el-tab-pane label="物品" name="article">
              <etm-tool-bar v-model="article" @search="articleSearch" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <article-list :item-type="itemSearch" />
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
import { queryMaterialType } from '@/api/newDaycare/materialPriceManage'
import baseMixin from '@/layout/mixin/baseMixin'
import articleList from '@/views/newDaycare/materialManage/articleList/articleList'

/**
 * index create by Administrator
 * createTime 2020/12/03 18:01
 */
export default {
  name: 'Index',
  components: { articleList },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      activeName: 'article',
      itemSearch: {
        name: undefined,
        materialTypeId: undefined
      },
      article: [
        {
          label: '物品名称',
          type: 'input',
          prop: 'itemName',
          value: '',
          props: {
            placeholder: '请输入物品名称'
          }
        },
        {
          label: '物品类型',
          type: 'select',
          prop: 'materialTypeId',
          value: '',
          options: [],
          props: {
            placeholder: '请选择'
          }
        }
      ]
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
    articleSearch() {
      this.itemSearch.name = this.getObjectByProp('itemName', this.article).value
      this.itemSearch.materialTypeId = this.getObjectByProp('materialTypeId', this.article).value
      // console.log(this.itemSearch)
    },
    setting() {
      this.$router.push({ path: '/newdaycare_materialPriceManagesSetting' })
    },
    init() {
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
.index-wrap {

}
</style>
