<template>
  <div class="addClass-wrap">
    <etm-layout-split>
      <etm-title
        :show-line="false"
        border
        size="big"
      >
        班级详情
        <template slot="tool">
          <template v-if="is_edit">
            <el-button
              plain
              size="mini"
              @click="cancel"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="toggleSave"
            >
              保存
            </el-button>
          </template>
          <template v-else>
            <el-button
              v-has="{authId : 'daycare.clazzCare.update'}"
              plain
              size="mini"
              @click="isEdit = true"
            >
              编辑
            </el-button>
          </template>
        </template>
      </etm-title>

      <el-row>
        <el-col :span="14">
          <div v-if="!is_edit">
            <etm-field-label
              label="班级名称"
              type="left"
            >
              {{ classname }}
            </etm-field-label>
            <etm-field-label
              label="班主任"
              type="left"
            >
              {{ form.teacher }}
            </etm-field-label>
            <etm-field-label
              label="助教老师"
              type="left"
            >
              {{ form.secondTeacher.join(', ') }}
            </etm-field-label>
            <etm-field-label
              label="保育员"
              type="left"
            >
              {{ form.nurse.join(', ') }}
            </etm-field-label>
            <etm-field-label
              label="班级容量"
              type="left"
            >
              {{ form.capacity }}
            </etm-field-label>
            <etm-field-label
              label="适用年龄段"
              type="left"
            >
              {{ daycareGeneration.name }}
            </etm-field-label>
            <etm-field-label
              label="备注"
              type="left"
            >
              {{ form.mark }}
            </etm-field-label>
            <etm-field-label
              label="学员数量"
              type="left"
            >
              {{ form.childNumber }}
            </etm-field-label>
          </div>
          <etm-form
            v-else
            ref="addClass"
            type="dialog"
            :model="form"
          >
            <el-form-item
              label="班级名称"
              prop="clazzName"
            >
              <!--              :rules="formValidate.nullValueRule(true, '请输入班级名称')"-->
              {{ classname }}
            </el-form-item>
            <el-form-item
              label="班主任"
              prop="headTeacherId"
            >
              <el-select
                v-model="form.teacher"
                placeholder="请选择班主任"
                @change="teacherChnage"
              >
                <el-option
                  v-for="(item, index) in teacherList"
                  :key="index"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="助教老师"
              prop="teacherIdList"
            >
              <el-select
                v-model="form.secondTeacher"
                placeholder="请选择老师"
                multiple
                @change="teacherChnage"
              >
                <el-option
                  v-for="(item, index) in teacherList"
                  :key="index"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="保育老师"
              prop="teacherIdList"
            >
              <el-select
                v-model="form.nurse"
                placeholder="请选择老师"
                multiple
                @change="teacherChnage"
              >
                <el-option
                  v-for="(item, index) in teacherList"
                  :key="index"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="适用年龄段"
              prop="generationId"
            >
              <el-select
                v-model="form.ageId"
                placeholder="请选择适用年龄段"
              >
                <el-option
                  v-for="(item, index) in daycareGenerationList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="form.mark"
                placeholder="最多输入20个字"
                maxlength="20"
                :show-word-limit="true"
              />
            </el-form-item>
            <el-form-item
              label="容量"
              prop="capacity"
            >
              {{ form.capacity || 0 }}
            </el-form-item>
            <el-form-item
              label="学员数量"
            >
              {{ form.studentNumber || 0 }}
            </el-form-item>

            <el-form-item label="是否开启">
              <div>
                <el-switch
                  v-model="form.enable"
                  @change="switchChange"
                />
              </div>
            </el-form-item>
          </etm-form>
        </el-col>
      </el-row>

      <etm-table
        selection
        index
        :columns="columns2"
        :data="tableData2"
        @selection-change="multipleSelect"
      >
        <etm-table-tool-bar slot="tool">
          <div class="drawerSearch">
            <el-input
              v-model="searchKey2"
              suffix-icon="el-icon-search"
              :disabled="!form.enable"
              placeholder="请输入学员姓名搜索"
              @blur="childSearch($event)"
            />
          </div>
          <el-button
            slot="right"
            type="primary"
            size="small"
            :disabled="!form.enable"
            @click="newStudentOpen"
          >
            <i class="el-icon-plus" />&nbsp;&nbsp;添加学员
          </el-button>
          <el-button
            slot="right"
            type="primary"
            size="small"
            :disabled="!form.enable"
            @click="exchangeClasses(multipleStudent)"
          >
            批量调班
          </el-button>
        </etm-table-tool-bar>

        <el-table-column
          slot="left"
          label="学员姓名"
          width="120"
          align="center"
          header-align="center"
        >
          <template slot-scope="scoped">
            {{ scoped.row.childName }}
          </template>
        </el-table-column>
        <el-table-column
          slot="right"
          label="操作"
          width="120"
          align="center"
          header-align="center"
        >
          <template slot-scope="scoped">
            <etm-text
              type="primary"
              @click="exchangeClasses([scoped.row])"
            >
              调班
            </etm-text>
            <etm-text
              type="danger"
              @click="getoutClasses(scoped.row)"
            >
              退班
            </etm-text>
          </template>
        </el-table-column>
      </etm-table>
    </etm-layout-split>

    <etm-pop
      title="新学员"
      :visible="isShowNewStudent"
      cancel-btn="取消"
      @cancel="isShowNewStudent = false"
      @confirm="newStudentConfirm"
      @close="isShowNewStudent = false"
    >
      <el-form label-width="80px">
        <el-form-item label="选择学员">
          <el-select
            v-model="joinStudent"
            style="width: 100%;"
            filterable
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in allStudent"
              :key="index"
              :label="item.childName"
              :value="item.childId"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </etm-pop>

    <etm-pop
      :visible="showExchange"
      title="学员调班"
      cancel-btn="取消"
      @cancel="showExchange = false"
      @close="showExchange = false"
      @confirm="exchangeConfirm"
    >
      <etm-form type="dialog">
        <el-form-item label="调班学员">
          {{ choiceChildName }}
        </el-form-item>
        <el-form-item label="选择班级">
          <el-select
            v-model="choiceClass"
            filterable
            placeholder="请选择班级"
          >
            <el-option
              v-for="(item, index) in classList"
              :key="index"
              :label="item.caeClazzName"
              :value="item.caeClazzId"
            />
          </el-select>
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
/**
 * addClass create by Administrator
 * createTime 2020/9/2 14:10
 */
import formValidate from '@/utils/rules'
import {
  queryClassChildren,
  getOutClass,
  queryClasses,
  exchangeClass,
  queryAllChildren,
  createJoinChildren
} from '@/api/standardcare/classes'

import {
  queryClazzDetail,
  updateClazz,
  queryDaycareGenerationList,
  queryDaycareGenerationSingle
} from '@/api/standardcare/listEdu/clazzCare'
import { queryEmployeeSelectByTabCode } from '@/api/base/employee'
// import { queryDaycareGenerationList } from '@/api/newDaycare/recipesManage'

export default {
  name: 'AddClass',
  components: {},
  filters: {},
  mixins: [],
  props: {
    teacher: {
      type: Array,
      default () {
        return []
      }
    },
    classname: {
      type: String,
      default: ''
    },
    classid: {
      type: Number,
      default: 0
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShowNewStudent: false,
      isEdit: '',
      searchKey: '',
      choiceChildName: '', // 调班选中的幼儿名
      choiceClass: '', // 调班选中的目标班级
      childIds: [], // 选中的学员id<Array>
      classList: [], // 班级列表
      multipleStudent: [], // 多选学员
      showExchange: false,
      searchKey2: '',
      detailData: {},
      allStudent: [],
      joinStudent: [],

      teacherList: [],
      clazzLists: [],
      daycareGenerationList: [],
      daycareGeneration: {
        name: '',
        id: null
      },
      columns2: [
        {
          label: '性别',
          prop: 'genderEnum',
          width: '120',
          align: 'center',
          'header-align': 'center'
        },
        {
          label: '家长姓名',
          prop: 'parentName',
          width: '120',
          align: 'center',
          'header-align': 'center'
        }, {
          label: '联系电话',
          prop: 'phone',
          align: 'center',
          'header-align': 'center'
        }
        // {
        //   label: '剩余时间',
        //   prop: 'lastLesson',
        //   width: '120',
        //   align: 'center',
        //   'header-align': 'center'
        // }
      ],

      tableData2: [],

      formValidate,
      form: {
        clazzId: null,
        typeId: null,
        capacity: 20,
        studentNumber: 0,
        teacher: '',
        secondTeacher: '',
        ageId: null,
        mark: '',
        nurse: '',
        enable: true
      }
    }
  },
  computed: {
    is_edit () {
      return this.isEdit === '' ? !this.edit : this.isEdit
    }
  },
  watch: {},
  created () {
    this.getChildren()
    this.getData()

    this.init()
  },
  mounted () {
  },
  methods: {
    teacherChnage (event) {
      // if (Array.isArray(event)) {
      //   if (event[event.length - 1] === this.form['headTeacherId']) {
      //     this.form.teacherIdList.pop()
      //     this.$message.warning('老师不能重复选择')
      //   }
      // } else {
      //   if (this.form.teacherIdList.includes(event)) {
      //     this.form['headTeacherId'] = null
      //     this.$message.warning('老师不能重复选择')
      //   }
      // }
    },
    init () {
      queryClazzDetail({ caeClazzId: this.classid }).then(res => {
        this.detailData = res.data
        this.form = {
          teacher: res.data.teacher,
          capacity: res.data.capacity,
          secondTeacher: (res.data.secondTeacher || '').split(','),
          nurse: (res.data.nurse || '').split(','),
          clazzId: res.data.clazzId,
          typeId: res.data.typeId,
          mark: res.data.mark,
          ageId: res.data.ageId,
          caeClazzName: res.data.caeClazzName,
          enable: res.data.enable,
          studentNumber: res.data.studentNumber

          // teacherNameLists: ((res.data.caeClazzTeacherList || []).map(cur => {
          //   return cur.teacherName
          // })).join(', '),
          // teacherIdList: (res.data.caeClazzTeacherList || []).map(cur => {
          //   return cur.teacherId
          // })
        }

        this.$nextTick(() => {
          this.getSingleDaycareGeneration()
        })
      })
    },
    getSingleDaycareGeneration () {
      queryDaycareGenerationSingle(this.form.ageId).then(res => {
        this.daycareGeneration = res.data
      })
    },
    getData () {
      queryEmployeeSelectByTabCode({
        tagCode: ''
      }).then(res => {
        const result = res.data.map((cur) => {
          return {
            label: cur.name,
            value: cur.id
          }
        })
        this.teacherList = result
      })

      // 年龄段
      queryDaycareGenerationList().then(res => {
        this.daycareGenerationList = res.data.map(cur => {
          return {
            label: cur.name,
            value: cur.id
          }
        })
      })
    },
    exchangeConfirm () {
      if (this.choiceClass) {
        exchangeClass({
          childIdList: this.childIds,
          currentClazzId: this.classid,
          clazzId: this.choiceClass
        }).then(res => {
          this.showExchange = false
          this.choiceClass = ''

          this.getChildren()
        })
      } else {
        this.$message('请选择班级')
      }
    },
    exchangeClasses (choiceData) {
      if (!choiceData.length) {
        this.$message('请选择学员')
        return
      }

      this.showExchange = true

      const name = []
      const ids = []

      choiceData.forEach(cur => {
        name.push(cur.childName)
        ids.push(cur.childId)
      })

      this.choiceChildName = name.join(', ')
      this.childIds = ids

      // if (!this.classList.length) {
      queryClasses({ clazzName: null }).then(res => {
        this.classList = res.data
      })
      // }
    },
    childSearch (event) {
      // if (event.target.value) {
      this.searchKey = event.target.value
      this.getChildren(event.target.value)
      // }
    },
    getChildren (search = null) {
      queryClassChildren({ clazzId: this.classid, childName: search }).then(res => {
        this.tableData2 = res.data.map(cur => {
          cur.genderEnum = cur.genderEnum === 'MALE' ? '男' : (cur.genderEnum === 'FEMALE' ? '女' : '')
          return cur
        })
      })
    },
    toggleSave () {
      // this.is_Edit = !this.is_Edit

      this.$refs.addClass.$children[0].validate(valid => {
        if (valid) {
          const queryParams = {}
          const _form = this.form
          Object.keys(_form).forEach(cur => {
            // if (_form[cur]) {
            queryParams[cur] = _form[cur]
            // }
          })

          queryParams.secondTeacher = queryParams.secondTeacher.join(',')
          queryParams.nurse = queryParams.nurse.join(',')

          updateClazz({ ...queryParams, careClazzId: this.classid }).then(res => {
            this.$emit('update', {})
            this.isEdit = false
            this.init()
            this.$message({
              type: 'success',
              message: '更新成功'
            })
          })
        }
      })
    },
    newStudentConfirm () {
      if (!this.joinStudent.length) {
        this.$message('请选择学员')
        return
      }

      createJoinChildren({ clazzId: this.classid, childIdList: this.joinStudent }).then(res => {
        this.isShowNewStudent = false
        this.init()
        this.getChildren(this.searchKey)
      })
    },
    newStudentOpen () {
      this.isShowNewStudent = true
      queryAllChildren().then(res => {
        this.allStudent = res.data
      })
    },
    query () {

    },
    cancel () {
      // this.$emit('cancel', {})

      this.isEdit = false
    },
    multipleSelect (event) {
      this.multipleStudent = event
    },
    getoutClasses (row) {
      this.$etmTip.init({
        type: 'error',
        title: '确认要对学员执行退班操作？',
        content: `${row.childName}将退出班级`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          getOutClass({ childId: row.childId, clazzId: this.classid }).then(res => {
            this.$message({
              type: 'success',
              message: '退班成功'
            })
            this.getChildren(this.searchKey)
            this.$etmTip.close()

            this.getChildren()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },

    /* 给学员调班 */
    // exchangeClassMethod(ids, targetClassid) {
    //   exchangeClass(ids, 1, targetClassid).then(res => {
    //
    //   })
    // },
    switchChange (event) {
      if (!this.form.enable) {
        this.$etmTip.init({
          type: 'warn',
          title: '确定要关闭班级？',
          content: '已排课程将自动取消',
          confirmBtn: '确定',
          cancelBtn: '取消',
          confirm: () => {
            this.$etmTip.close()

            if (this.tableData2.length) {
              this.$etmTip.init({
                type: 'warn',
                title: '无法关闭班级？',
                content: '班级内有在册学员',
                confirmBtn: '确定',
                cancelBtn: '取消',
                confirm: () => {
                  this.form.enable = true
                  this.$etmTip.close()
                },
                cancel: () => {
                  this.form.enable = true
                  this.$etmTip.close()
                }
              })
              this.$etmTip.open()
            }
          },
          cancel: () => {
            this.form.enable = true
            this.$etmTip.close()
          }
        })
        this.$etmTip.open()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.addClass-wrap {
  .drawerSearch {
    width: 260px;
  }

  ::v-deep .EtmLayoutSplit-wrap {
    height: 100vh;

    .layout-default {
      overflow-y: auto;
    }
  }
}
</style>
