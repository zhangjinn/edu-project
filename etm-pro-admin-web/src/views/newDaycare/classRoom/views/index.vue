<template>
  <div class="classRoom-wrap">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs setting>
          <el-tab-pane label="教室">
            <etm-tool-bar v-show="show" v-model="formData" @search="handleSearch" />
          </el-tab-pane>
        </etm-tabs>
      </div>
      <div slot="body">
        <etm-table-page
          :columns="columns"
          :data="tableData"
          border
          @currentChange="currentChange"
        >
          <etm-table-tool-bar slot="tool">
            <el-button slot="right" type="primary" @click="showAddClass"> 新增</el-button>
            <el-button slot="right" type="primary"> 新增推荐场地</el-button>
          </etm-table-tool-bar>
          <el-table-column slot="left" fixed="left" label="教室名称" width="120">
            <template slot-scope="scoped">
              <etm-text type="primary" @click.stop="classDetail(scoped)">{{ scoped.row.classId }}</etm-text>
            </template>
          </el-table-column>
          <el-table-column slot="right" fixed="right" label="操作" width="120">
            <template v-slot="{row}">
              <etm-text type="primary" @click="handleEdit(row)">修改</etm-text>
              <etm-text type="primary" @click="handleDelete(row)">删除</etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>
    <etm-pop
      :visible="showPop"
      :pop="popType"
      title="添加教室"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="showPop = true"
      @close="showPop = false"
      @confirm="addClass"
      @cancel="showPop = false"
    >
      <add-class-name />
    </etm-pop>
    <etm-drawer
      :visible.sync="showSide"
      :type="type"
    >
      <etm-layout-split>
        <div v-if="!showClassDetail">
          <etm-title :show-line="false" border size="big">编辑教室
            <template slot="tool">
              <el-button size="mini" plain>取消</el-button>
              <el-button size="mini" type="primary" @click="saveClass">保存</el-button>
            </template>
          </etm-title>
          <add-class-name />
        </div>
        <div v-if="showClassDetail">
          <etm-title :show-line="false" border size="big">教室详情
            <template slot="tool">
              <el-button size="mini" plain @click="handleEdit">编辑</el-button>
            </template>
          </etm-title>
          <class-detail />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>

</template>

<script>
/**
 * classRoom create by Administrator
 * createTime 2020/08/28 15:23
 */
import baseMixin from '@/layout/mixin/baseMixin'
import addClassName from '@/views/newDaycare/classRoom/views/components/addClassName'
import classDetail from '@/views/newDaycare/classRoom/views/components/classDetail'
export default {
  name: 'Index',
  components: {
    addClassName,
    classDetail
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      show: true,
      showPop: false,
      type: 'small',
      showSide: false,
      showClassDetail: false,
      popType: 'complex',
      formData: [
        {
          label: '教师名称',
          type: 'input',
          prop: 'teacherName',
          value: '',
          props: {
            placeholder: '请输入教师名称'
          }
        },
        {
          label: '使用班级',
          type: 'input',
          prop: 'className',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        },
        {
          label: '教室容量',
          type: 'select',
          prop: 'classroomCapacity',
          value: '',
          default: '',
          options: [
            {
              label: '20',
              value: '20 '
            },
            {
              label: '30',
              value: '30 '
            }
          ],
          props: {
            placeholder: '请选择教室容量',
            clearable: true,
            filterable: true
          }
        }
      ],
      columns: [
        {
          label: '使用班级',
          prop: 'className'
        },
        {
          label: '备注',
          prop: 'detail'
        },
        {
          label: '教室容量',
          prop: 'classroomCapacity'
        },
        {
          label: '状态',
          prop: 'status'
        }
      ],
      tableData: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 888,
        totalPages: 22,
        content: [
          {
            classId: 1,
            className: '零零',
            detail: '立刻释放',
            classroomCapacity: 30,
            status: '开启'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    handleSearch() {
    },
    classDetail() {
      this.showSide = true
      this.showClassDetail = true
    },
    handleEdit(row) {
      this.showSide = true
      this.showClassDetail = false
    },
    handleDelete(row) {
    },
    currentChange(pageNum, pageSize) {
      // this.pageInfo = {
      //   pageNum, pageSize
      // }
      // this.init()
    },
    showAddClass() {
      this.showPop = true
    },
    addClass() {
      this.showPop = false
    },
    saveClass() {
      this.showClassDetail = true
    }
  }
}
</script>
<style lang="scss" scoped>
.classRoom-wrap {
  margin-top: 16px;
}
</style>
