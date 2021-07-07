<template>
  <div class="index-wrap">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="currentTab" @toggle="toggle">
          <el-tab-pane label="班级列表" name="first">
            <etm-tool-bar v-show="show" v-model="formData" @search="handleSearch" />
          </el-tab-pane>
        </etm-tabs>
      </div>
      <div slot="body">
        <template v-if="currentTab === 'first'">
          <etm-table-page :columns="columns" :data="tableData" index-type="index" border @currentChange="currentChange">
            <etm-table-tool-bar slot="tool" v-model="toolBar">
              <!--<el-checkbox border>选中所有页(共100条)</el-checkbox>-->
              <div slot="right">
                <el-button type="primary" @click="addClazz"><i class="el-icon-plus" />&nbsp;&nbsp;新增班级</el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column slot="left" label="班级名称">
              <template slot-scope="scoped">
                <etm-text type="primary" @click.stop="clazzDetail(scoped)">{{ scoped.row.clazzName }}</etm-text>
              </template>
            </el-table-column>
            <el-table-column slot="right" label="操作">
              <template v-slot="{row}">
                <etm-text type="primary" @click="edit(row)">修改</etm-text>
                <etm-text type="primary" @click.stop="deleteClazz(row)">删除</etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </template>
      </div>
    </etm-layout-split>
    <etm-side
      :visible="side"
      title="班级详情"
      @close="side = false"
      @open="side = true"
    >
      <etm-layout-split>
        <el-form>
          <el-form-item label="班级名称:">
            {{ selectedClass.clazzName || '-' }}
          </el-form-item>
          <el-form-item label="满班人数:">
            {{ selectedClass.fullNumber || '-' }}
          </el-form-item>
          <el-form-item label="班主任:">
            {{ selectedClass.headTeacherName || '-' }}
          </el-form-item>
          <el-form-item label="授课老师:">
            {{ selectedClass.teacherName || '-' }}
          </el-form-item>
          <el-form-item label="会员:" />
        </el-form>
        <etm-table :data="customerList">
          <el-table-column label="姓名" prop="customerName" />
          <el-table-column label="性别" prop="sex" />
          <el-table-column label="年龄" prop="age" />
        </etm-table>
      </etm-layout-split>
    </etm-side>
  </div>
</template>

<script>
import etmSide from '@/layout/main/EtmSide'
import baseMixin from '@/layout/mixin/baseMixin'
import { queryClazzListPage, deleteClazzById, getClazzDetail, queryClazzDetailById } from '@/api/clazz'

/**
   *  2020/4/17 9:26
   *  haijinsha
   */
export default {
  name: 'Index',
  filters: {},
  components: {
    etmSide
  },
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      currentTab: 'first',
      show: true,
      toolBar: [
        {
          label: '在园人数',
          type: 'input',
          prop: 'in',
          value: '',
          props: {
            placeholder: '请输入会员姓名'
          }
        },
        {
          label: '在园人数',
          type: 'input',
          prop: 'customerName',
          value: '',
          props: {
            placeholder: '请输入会员姓名'
          }
        }
      ],
      formData: [
        {
          label: '班级',
          type: 'input',
          prop: 'clazzName',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        },
        {
          label: '班主任',
          type: 'input',
          prop: 'headTeacherName',
          value: '',
          props: {
            placeholder: '请输入班主任姓名'
          }
        }
      ],
      tableData: {
        content: []
      },
      columns: [
        {
          label: '班主任',
          prop: 'headTeacherName'
        },
        {
          label: '授课老师',
          prop: 'teacherName'
        },
        {
          label: '会员人数',
          prop: 'clazzNumber'
        }
      ],
      side: false,
      selectedClass: {},
      customerList: []
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
    toggle(val) {
      this.show = val
    },
    search() {
      const params = {
        studentName: this.getValueByProp('studentName', this.formData),
        inPerson: this.getValueByProp('inPerson', this.formData)
      }
      console.log('ajax: ', params)
      for (let i = 0; i < 5; i++) {
        this.tableData.content.push(this.tableData.content[0])
      }
    },
    init() {
      queryClazzListPage({
        clazzName: this.getValueByProp('clazzName'),
        headTeacherName: this.getValueByProp('headTeacherName'),
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.tableData = res.data
        this.tableData.content.forEach(item => {
          item.month = item.monthAgeStart + '-' + item.monthAgeEnd
        })
      })
    },
    handleSearch(e) {
      this.init()
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.init()
    },
    addClazz() {
      this.$store.commit('clazz/set_clazz_id', '')
      this.$emit('switch', { target: 'addClass', index: 0 })
      // this.$router.push({ name: 'addclazz' })
    },
    deleteClazz(row) {
      getClazzDetail(row.clazzId).then(res => {
        const { data: { customerNameList, headTeacherNameList, teacherNameList }} = res
        if (customerNameList.length || headTeacherNameList.length || teacherNameList.length) {
          this.$etmTip.init({
            type: 'error',
            title: '提示',
            content: `${row.clazzName}班存在班主任、授课老师、会员，请进行移除再删除。`,
            confirmBtn: '知道了',
            confirm: () => {
              this.$etmTip.close()
            }
          })
          this.$etmTip.open()
        } else {
          this.$etmTip.init({
            type: 'error',
            title: '确认',
            content: '删除后无法撤销，是否继续删除？',
            confirmBtn: '删除',
            cancelBtn: '取消',
            confirm: () => {
              deleteClazzById(row.clazzId).then(res => {
                this.$message.success('删除成功')
                this.$etmTip.close()
                this.init()
              }).catch(err => {
                console.log(err)
              })
            },
            cancel: () => {
              this.$etmTip.close()
            }
          })
          this.$etmTip.open()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    edit(row) {
      this.$store.commit('clazz/set_clazz_id', row.clazzId)
      this.$emit('switch', { target: 'editClass', index: 1 })
    },
    clazzDetail(scoped) {
      this.selectedClass = scoped.row
      queryClazzDetailById({ clazzId: scoped.row.clazzId }).then(res => {
        const { data } = res
        this.selectedClass.fullNumber = data.fullNumber
        data.customerList.forEach(v => {
          if (v.gender === 'MALE') {
            v.sex = '男'
          } else if (v.gender === 'FEMALE') {
            v.sex = '女'
          } else {
            v.sex = '-'
          }
        })
        this.customerList = data.customerList
        this.side = true
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-wrap {

  }
</style>
