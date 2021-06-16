<template>
  <div class="education-wrap">
    <etm-table-page
      :columns="columns"
      :data="tableData"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button
            v-has="{authId : 'daycare.clazzCare.create'}"
            type="primary"
            @click="ClassOpen"
          >
            <i class="el-icon-plus" />&nbsp;&nbsp;添加班级
          </el-button>
        </div>
      </etm-table-tool-bar>

      <el-table-column
        slot="left"
        label="班级名称"
        width="120"
      >
        <template slot-scope="scoped">
          <el-button
            type="text"
            @click="classDetailOpen(scoped.row.clazzName, scoped.row.clazzId, true)"
          >
            {{ scoped.row.clazzName }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="班主任"
        width="120"
      >
        <template slot-scope="scoped">
          {{ scoped.row.headTeacherName }}
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
            @click="classDetailOpen(scoped.row.clazzName, scoped.row.clazzId)"
          >
            编辑
          </etm-text>
          <etm-text
            v-has="{authId : 'daycare.clazzCare.remove'}"
            type="danger"
            @click="dropClass(scoped.row.clazzId)"
          >
            删除
          </etm-text>
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
        :teacher="teacher"
        @cancel="drawerShow=false"
        @update="update"
      />
    </etm-drawer>

    <etm-pop
      title="添加班级"
      :visible="showClassPop"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="ClassOpen"
      @close="showClassPop = false"
      @cancel="showClassPop = false"
      @confirm="ClassConfirm"
    >
      <etm-form
        ref="addClass"
        type="dialog"
        :model="form"
      >
        <!--        <el-form-item label="所属园区">-->
        <!--          天河-->
        <!--        </el-form-item>-->
        <el-form-item
          label="班级名称"
          prop="name"
          :required="true"
          :rules="formValidate.nullValueRule(true, '请输入班级姓名')"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入班级姓名"
            value=""
          />
        </el-form-item>
        <el-form-item
          label="班主任"
          prop="headTeacherId"
        >
          <el-select
            v-model="form.headTeacherId"
            placeholder="请选择班主任"
          >
            <el-option
              v-for="(item, index) in teacher"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!--        <el-form-item-->
        <!--          label="满班人数"-->
        <!--          prop="fullNumber"-->
        <!--          :rules="[-->
        <!--            { type: 'number', message: '请输入满班人数'}-->
        <!--          ]"-->
        <!--        >-->
        <!--          <el-input-->
        <!--            v-model="form.fullNumber"-->
        <!--            value="20"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            placeholder="最多输入20个字"
            maxlength="20"
            :show-word-limit="true"
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>

/**
 * education create by Administrator
 * createTime 2020/8/28 15:25
 */

import {
  queryNurseriesList,
  createClasses,
  removeClass
} from '@/api/newDaycare/classes'
import AddClass from './components/addClass'

// import SearchField from '@/views/daycare/childManage/myChild/components/searchField'

// import { queryEmployeeSelectByTabCode } from '@/api/base/employee'
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'

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
    },
    teacher: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      isShowNewStudent: false,
      showClassPop: false,
      drawerShow: false,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        paged: true
      },
      isEdit: false,
      curClassId: 0,
      activeName: 'education',
      switchIsOpen: true,
      formValidate,
      form: {
        headTeacherId: '',
        fullNumber: 20,
        remark: '',
        name: ''
      },
      detailInfo: {}, // 班级详情信息
      /* 学员详情table配置 */
      columns: [
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '学员数量',
          prop: 'childNumber',
          width: '120'
        }
      ],

      tableData: {
        content: []
      }

    }
  },
  computed: {},
  watch: {
    search (n, o) {
      // if (Object.keys(n).length) {
      this.pageInfo.pageNum = 1
      this.init(n)
      // }
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
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

      queryNurseriesList({ ...params }).then(res => {
        this.tableData = res.data
      })
    },

    ClassOpen () {
      this.showClassPop = true
    },

    /* 打开班级详情 */
    classDetailOpen (classname, id, edit = false) {
      this.drawerShow = true
      this.isEdit = edit
      this.curClassId = id
    },

    /* 新建班级确定 */
    ClassConfirm () {
      const addClasssComponent = this.$refs.addClass
      addClasssComponent.$children[0].validate(valid => {
        if (valid) {
          const queryParams = {}
          const _form = this.form
          Object.keys(_form).forEach(cur => {
            if (_form[cur]) {
              queryParams[cur] = _form[cur]
            }
          })

          // const params = Object.assign({
          //   headTeacherId: null,
          //   fullNumber: null,
          //   remark: '',
          //   name: ''
          // }, queryParams)

          createClasses({ ...queryParams }).then(res => {
            this.init(this.search)
            this.form.remark = ''
            addClasssComponent.$children[0].resetFields()
            this.showClassPop = false
          })
        }
      })
    },

    /* 删除班级 */
    dropClass (classid) {
      this.$etmTip.init({
        type: 'error',
        title: '确认要删除班级？',
        html: '<p>1、已排课程将自动取消</p><p>2、班级内的全部学员将自动退班</p>',
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          removeClass({ caeClazzId: classid }).then(res => {
            this.init(this.search)
            this.$etmTip.close()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
