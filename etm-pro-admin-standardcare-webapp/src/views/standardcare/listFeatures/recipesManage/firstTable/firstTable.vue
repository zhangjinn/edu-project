<template>
  <div class="firstTable">
    <etm-table-page
      :data="tableData"
      :columns="columns"
      :index="true"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <el-button
          slot="right"
          type="primary"
          @click="handleAdd"
        >
          <i class="el-icon-plus" />&nbsp;&nbsp;添加食谱
        </el-button>
      </etm-table-tool-bar>
      <template slot="left">
        <el-table-column
          label="名称"
          width="200px"
          fixed
          show-overflow-tooltip
        >
          <template v-slot="scoped">
            <div class="recipe-name">
              <div class="img-left">
                <img
                  v-if="scoped.row.cover && scoped.row.cover!=='--'"
                  :src="scoped.row.cover"
                  alt=""
                >
                <img
                  v-else
                  :src="recipeDefaultCover"
                  alt=""
                  @click="handleEditRecipe(scoped.row)"
                >
              </div>
              <div class="info-right">
                <etm-text
                  type="primary"
                  @click="handleEditRecipe(scoped.row)"
                >
                  {{ scoped.row.name }}
                </etm-text>
                <div class="author">
                  {{ scoped.row.labelNameList }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        slot="right"
        label="操作"
      >
        <template v-slot="scoped">
          <etm-text @click="handleEditRecipe(scoped.row)">
            编辑食谱
          </etm-text>
          <etm-text @click="handleEditInfo(scoped.row)">
            编辑信息
          </etm-text>
          <etm-text
            type="danger"
            @click="handleDelete(scoped.row)"
          >
            删除
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <!--添加弹框-->
    <etm-pop
      :visible="popVisible"
      pop="complex"
      title="添加食谱"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popVisible = false"
      @cancel="popVisible = false"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <edit
          v-if="popVisible && proType==='add'"
          ref="childPopForm"
          :type="proType"
          :item-id="recipesId"
        />
      </div>
    </etm-pop>

    <!--详情/编辑抽屉-->
    <etm-drawer :visible.sync="drawerVisible">
      <etm-layout-split line>
        <etm-title
          title="编辑食谱"
          border
          size="big"
        >
          <template
            v-if="drawerVisible"
            slot="tool"
          >
            <el-button
              plain
              size="mini"
              @click="drawerVisible = false"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="popConfirm"
            >
              保存
            </el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <edit
            v-if="drawerVisible && proType==='edit' && recipesId"
            ref="childPopForm"
            :type="proType"
            :item-id="recipesId"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import edit from './edit'
import { parseTime } from '@/utils'

import { addRecipes, queryRecipesList, removeRecipes, updateRecipes } from '@/api/standardcare/listFeatures/recipesManage'
export default {
  name: 'FirstTable',
  components: {
    edit
  },
  mixins: [baseMixin],
  data () {
    return {
      popVisible: false,
      drawerVisible: false,
      proType: 'add',
      formData: [],
      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '适用范围',
          prop: 'scopeName'
        },
        {
          label: '录入日期',
          prop: 'createTime'
        },
        {
          label: '备注',
          prop: 'remarks'
        }
      ],
      recipeDefaultCover: require('@/assets/images/book-cover.png'),
      recipesId: null

    }
  },

  methods: {
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },

    // 重置
    reset () {
      this.pageInfo.pageNum = 1
      this.init()
    },

    // 获取列表
    init () {
      const param = {
        name: this.getValueByProp('name', this.formData) ? this.getValueByProp('name', this.formData) : null,
        scopeId: this.getValueByProp('range', this.formData) ? this.getValueByProp('range', this.formData) : null,
        labelIdListStr: this.getValueByProp('tag', this.formData) ? this.getValueByProp('tag', this.formData).join(',') : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      queryRecipesList(param).then((res) => {
        const { data } = res
        this.tableData = data
        this.tableData.content.map((val) => {
          val.createTime = val.createTime ? parseTime(val.createTime, '{y}-{m}-{d}') : ''
          val.labelNameList = val.labelNameList.join(',')
        })
      })
    },

    // 删除
    handleDelete (row) {
      this.$etmTip.init({
        type: 'error',
        title: '确认删除该数据？',
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          removeRecipes({
            recipesId: row.id
          }).then((res) => {
            this.$etmTip.close()
            this.$message.success('已删除')
            this.reset()
          }).catch(() => {
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
    },

    // 添加
    handleAdd () {
      this.proType = 'add'
      this.recipesId = null
      this.popVisible = true
    },

    // 编辑食谱详情
    handleEditRecipe (row) {
      this.recipesId = row.id
      this.$router.push({
        path: '/standardcare_recipeDetail',
        query: {
          recipesId: this.recipesId,
          range: row.scopeName
        }
      })
    },

    // 编辑食谱信息
    handleEditInfo (row) {
      this.proType = 'edit'
      this.recipesId = row.id
      this.drawerVisible = true
    },

    // 弹窗确定
    popConfirm () {
      this.$refs.childPopForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs.childPopForm.form

          let imageList = ''
          if (formData.previewSrcKey.length > 0) {
            formData.previewSrcKey.map((val) => {
              imageList = val
            })
          }
          const param = {
            cover: imageList,
            recipesName: formData.name,
            scopeId: formData.range,
            timeQuantumGroupId: formData.meals,
            labelIdList: formData.tags,
            remarks: formData.remarks,
            color: formData.color
          }
          if (this.proType === 'add') {
            addRecipes(param).then((res) => {
              this.popVisible = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.proType === 'edit') {
            param.recipesId = this.recipesId
            updateRecipes(param).then((res) => {
              this.drawerVisible = false
              this.$message({
                message: '已修改',
                type: 'success'
              })
              this.reset()
            })
          }
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
.firstTable {
  ::v-deep.el-table__row {
    td:nth-child(2) {
      padding: 17px 0;

      .cell {
        padding-left: 17px;
      }

      .recipe-name {
        display: flex;

        .img-left {
          border-radius: 4px;
          flex-shrink: 0;
          height: 60px;
          margin-right: 17px;
          width: 94px;

          img {
            height: 100%;
            object-fit: cover;
            width: 100%;
          }
        }

        .info-right {
          display: flex;
          flex-direction: column;
          justify-content: center;

          .author {
            color: #999;
            text-align: start;
          }
        }
      }
    }
  }
}

</style>
