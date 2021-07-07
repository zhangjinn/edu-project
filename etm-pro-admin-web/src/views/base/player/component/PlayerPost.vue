<template>
  <div class="PlayerPost-wrap">
    <tool-search v-model="positionName" placeholder="请输入岗位按回车搜索" @search="search">
      <el-button type="primary" icon="el-icon-plus" @click="add">添加岗位</el-button>
      <!--<el-button type="plain">删除岗位</el-button>-->
    </tool-search>
    <etm-table-page
      ref="etmTable"
      :height="tableHeight"
      :columns="columns"
      :table-data="tableData"
      type="index"
      border
      @currentChange="currentChange"
      @size-change="sizeChange"
    >
      <el-table-column slot="right" label="操作">
        <template slot-scope="scope">
          <etm-text type="primary" @click.stop="edit(scope.row)">修改</etm-text>
        </template>
      </el-table-column>

    </etm-table-page>
    <!--     添加岗位-->
    <etm-pop
      :visible="addPostVisible"
      pop="complex"
      :title="postData.status === 'create' ? '添加岗位' : '编辑岗位'"
      @close="addPostVisible = false"
      @cancel="addPostVisible = false"
      @confirm="submitAddPost('addPost')"
    >
      <add-post ref="addPost" :post="postData" />
    </etm-pop>
  </div>
</template>

<script>
import ToolSearch from '@/views/base/player/component/toolSearch'
import EtmTablePage from '@/views/base/player/component/EtmTablePage'
import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import AddPost from '@/views/base/player/component/addPost'
import { addPosition, queryPositionList, updatePosition } from '@/api/employee'
import { parseTime } from '@/utils'
import baseMixin from '@/layout/mixin/baseMixin'

/**
   * PlayerPost create by    dengShen
   * createTime   2020/3/16 17:04:38
   */
export default {
  name: 'PlayerPost',
  components: { AddPost, EtmPop, EtmTablePage, ToolSearch },
  mixins: [baseMixin],
  props: {
    orgName: {
      type: [String, Number],
      default: ''
    },
    orgId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      addPostVisible: false,
      postData: {
        organizationName: this.orgName,
        positionName: ''
      },

      postRule: {
        postName: [
          {
            required: true, message: '请输入岗位名称', trigger: 'blur'
          }
        ]
      },
      columns: [
        {
          label: '岗位名称',
          prop: 'positionName'
        },
        {
          label: '岗位人数',
          prop: 'employeeCount'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        }
      ],
      tableData: {
        content: []
      },
      positionName: '',
      pageInfo: {
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  computed: {},
  watch: {
    'orgId'() {
      this.init()
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      console.log(`PlayerPost is running...`)
      queryPositionList({ pageSie: this.pageInfo.pageSize, pageNum: this.pageInfo.pageNum, positionName: this.positionName }).then(res => {
        console.log(res)
        this.tableData = res.data
        this.tableData.content.map(item => {
          item.createTime = parseTime(item.createTime, '{y}-{m}-{d}')
        })
      })
    },
    search(e) {
      this.pageInfo.pageNum = 1
      this.init()
    },
    sizeChange(val) {
      this.pageInfo.pageSize = val
      this.pageInfo.pageNum = 1
      this.init()
    },
    currentChange(val) {
      this.pageInfo.pageNum = val
      this.init()
    },
    submitAddPost(ref) {
      if (this.$refs[ref].validateForm()) {
        const { positionName } = this.postData
        if (this.postData.status === 'create') {
          addPosition({ positionName }).then(res => {
            this.$message.success('添加岗位成功')
            this.$refs[ref].$refs['addPost'].resetFields()
            this.search()
          })
        } else {
          updatePosition({ positionId: this.postData.id, positionName: this.postData.positionName }).then(res => {
            this.$message.success('更新岗位成功')
            this.$refs[ref].$refs['addPost'].resetFields()
            this.search()
          })
        }

        this.addPostVisible = false
      }
    },
    add() {
      this.$nextTick(() => {
        this.addPostVisible = true
        // this.$refs['addPost'].resetFields()
        console.log(this.orgName)
        this.postData.status = 'create'
        this.postData.organizationName = this.orgName
        console.log(this.postData)
      })
    },
    edit(row) {
      this.postData = Object.assign({ organizationName: this.orgName }, row)
      this.postData.status = 'edit'
      this.addPostVisible = true
      console.log(row)
    }
  }
}
</script>

<style lang="scss" scoped>
  .PlayerPost-wrap {
    .EtmTablePage-wrap {
      padding: 0;
      & /deep/ .el-pagination {
        margin-top: 16px;
        padding: 0!important;
      }
    }
  }
</style>
