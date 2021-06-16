<template>
  <div class="education-wrap">
    <etm-table-page
      :columns="columns"
      :data="tableData"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div>班级数量：<etm-text>{{ tableData.totalElements }}</etm-text></div>
        <el-button
          slot="right"
          type="primary"
          @click="settingDisable = true"
        >
          <i class="iconfont iconsetting-fill" />班级设置
        </el-button>
      </etm-table-tool-bar>

      <el-table-column
        slot="left"
        label="班级名称"
        width="120"
      >
        <template slot-scope="scoped">
          <el-button
            type="text"
            @click="classDetailOpen(scoped.row.clazzName, scoped.row.id, true)"
          >
            {{ scoped.row.clazzName }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="状态"
        width="120"
      >
        <template slot-scope="scoped">
          {{ scoped.row.enable ? '开启' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="操作"
        width="120"
      >
        <template slot-scope="scoped">
          <etm-text
            v-has="{authId : 'daycare.clazzCare.update'}"
            type="primary"
            @click="classDetailOpen(scoped.row.clazzName, scoped.row.id)"
          >
            编辑
          </etm-text>
          <!--          <etm-text v-has="{authId : 'daycare.clazzCare.remove'}" type="danger" @click="dropClass(scoped.row.clazzId)">删除</etm-text>-->
        </template>
      </el-table-column>
    </etm-table-page>

    <etm-drawer
      :visible.sync="drawerShow"
      type="big"
    >
      <add-class
        v-if="drawerShow"
        :classid="curClassId"
        :edit="isEdit"
        :classname="classname"
        :teacher="[]"
        @cancel="drawerShow=false"
        @update="update"
      />
    </etm-drawer>

    <etm-pop
      title="班级设置"
      cancle-btn="取消"
      :visible="settingDisable"
      @cancel="cancel"
      @close="cancel"
      @confirm="confirm"
    >
      <div style="min-height: 226px;">
        <el-tree
          ref="tree"
          :data="data"
          show-checkbox
          node-key="id"
          :default-checked-keys="treeChoice"
          :props="defaultProps"
        />
      </div>
    </etm-pop>
  </div>
</template>

<script>

/**
 * education create by Administrator
 * createTime 2020/8/28 15:25
 */

// import {
// // removeClass,
// // queryClassroomList
// } from '@/api/newDaycare/classes'
import {
  queryClazzLists,
  queryCareSetting,
  createCareSetting
} from '@/api/standardcare/listEdu/clazzCare'
import AddClass from './components/addClass'

import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
// import { queryEmployeeSelectByTabCode } from '@/api/base/employee'
// import { queryDaycareGenerationList } from '@/api/newDaycare/recipesManage'

export default {
  name: 'Education',
  components: {

    AddClass
  },
  filters: {},
  mixins: [baseMixin],

  props: {
    search: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      treeChoice: [],
      settingDisable: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      classname: '',
      isShowNewStudent: false,
      // showClassPop: false,
      drawerShow: false,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        paged: true
      },
      teacherList: [],
      clazzLists: [],
      daycareGenerationList: [],

      isEdit: false,
      curClassId: 0,
      activeName: 'education',
      switchIsOpen: true,
      formValidate,
      // form: {
      //   headTeacherId: '',
      //   fullNumber: 20,
      //   remark: '',
      //   name: '',
      //   teacherIdList: [],
      //   generationId: null,
      //   clazzRoomId: null
      // },
      detailInfo: {}, // 班级详情信息
      /* 学员详情table配置 */
      columns: [
        {
          label: '适用年龄段',
          prop: 'ageRange'
        },
        {
          label: '班级类型',
          prop: 'typeName'
        },
        {
          label: '容量',
          prop: 'capacity'
        },
        {
          label: '学员数量',
          prop: 'studentNumber'
        },
        {
          label: '班主任',
          prop: 'teacher'
        },
        {
          label: '助教老师',
          prop: 'secondTeacher'
        },
        {
          label: '保育员',
          prop: 'nurse'
        }
      ],

      tableData: {
        content: []
      }

    }
  },
  computed: {},
  watch: {
    settingDisable: {
      handler (n) {
        if (n) {
          this.getSettingList()
        }
      }
    },
    search (n, o) {
      // if (Object.keys(n).length) {
      this.pageInfo.pageNum = 1
      this.init(n)
      // }
    }
    // showClassPop: {
    //   immediate: true,
    //   handler(n) {
    //     if (n) {
    //       this.getData()
    //     }
    //   }
    // }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    handleCheckChange (n) {
      console.log(n)
    },
    cancel () {
      this.treeChoice = []
      this.settingDisable = false
    },
    confirm () {
      const ids = []
      this.$refs.tree.getCheckedNodes().forEach(cur => {
        if (!/^_/.test(cur.id)) {
          ids.push(cur.id)
        }
      })

      createCareSetting(ids).then(res => {
        this.init(this.search)
        this.$message.success('设置成功')
      })
      this.cancel()
    },
    getSettingList () {
      queryCareSetting().then(res => {
        const result = []

        res.data.forEach((cur, index) => {
          const item = {}
          item.id = `_${index + 1}`
          item.label = cur.type

          item.children = cur.clazzList.map(c => {
            if (c.enable) {
              this.treeChoice.push(c.id)
            }
            return {
              id: c.id,
              label: c.name
            }
          })

          result.push(item)
        })
        this.data = result
      })
    },
    // teacherChnage(event) {
    //   // console.log(event, contrast)
    //   if (Array.isArray(event)) {
    //     if (event[event.length - 1] === this.form['headTeacherId']) {
    //       this.form.teacherIdList.pop()
    //       this.$message.warning('老师不能重复选择')
    //     }
    //   } else {
    //     if (this.form.teacherIdList.includes(event)) {
    //       this.form['headTeacherId'] = null
    //       this.$message.warning('老师不能重复选择')
    //     }
    //   }
    // },
    update () {
      this.init(this.search)
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      // this.suc()
      this.init(this.search)
    },
    init (search) {
      //  获取列表
      const params = Object.assign({
        teacherId: null,
        clazzName: '',
        lastPositionEnum: ''
      }, search, this.pageInfo)

      queryClazzLists({ ...params }).then(res => {
        this.tableData = res.data
      })
    },

    /* 打开班级详情 */
    classDetailOpen (classname, id, edit = false) {
      this.drawerShow = true
      this.isEdit = edit
      this.classname = classname
      this.curClassId = id
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
