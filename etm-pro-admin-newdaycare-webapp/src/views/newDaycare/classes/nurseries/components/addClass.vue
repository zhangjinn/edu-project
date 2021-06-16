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
              {{ form.caeClazzName }}
            </etm-field-label>
            <etm-field-label
              label="班主任"
              type="left"
            >
              {{ form.headTeacherName }}
            </etm-field-label>

            <!--            <etm-field-label label="满班人数" type="left">{{ form.fullNumber }}</etm-field-label>-->
            <etm-field-label
              label="学员数量"
              type="left"
            >
              {{ form.childNumber }}
            </etm-field-label>
            <!--            <etm-field-label label="剩余学位" type="left">{{ form.lastNumber }}</etm-field-label>-->
            <etm-field-label
              label="备注"
              type="left"
            >
              {{ form.remark }}
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
              prop="caeClazzName"
              :required="true"
              :rules="formValidate.nullValueRule(true, '请输入班级姓名')"
            >
              <el-input
                v-model="form.caeClazzName"
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
            <!--            <el-form-item-->
            <!--              label="满班人数"-->
            <!--              prop="fullNumber"-->
            <!--              :rules="[-->
            <!--                { type: 'number', message: '请输入满班人数'}-->
            <!--              ]"-->
            <!--            >-->
            <!--              <el-input-->
            <!--                v-model="form.fullNumber"-->
            <!--                value="20"-->
            <!--              />-->
            <!--            </el-form-item>-->
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                placeholder="最多输入20个字"
                maxlength="20"
                :show-word-limit="true"
              />
            </el-form-item>
            <!--            <el-form-item label="学员人数">-->
            <!--              {{ form.childNumber }}-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="剩余学位">-->
            <!--              {{ form.lastNumber }}-->
            <!--            </el-form-item>-->

            <el-form-item label="是否开启">
              <el-switch
                v-model="form.enable"
                @change="switchChange"
              />
            </el-form-item>
          </etm-form>
        </el-col>
      </el-row>

      <etm-table-page
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
          <div slot="right">
            <el-button
              :disabled="!form.enable"
              size="small"
              type="primary"
              @click="newStudentOpen"
            >
              <i class="el-icon-plus" />&nbsp;&nbsp;添加学员
            </el-button>
            <el-button
              :disabled="!form.enable"
              size="small"
              type="primary"
              @click="exchangeClasses(multipleStudent)"
            >
              批量调班
            </el-button>
          </div>
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
          slot="left"
          label="性别"
          width="120"
          align="center"
          header-align="center"
        >
          <template slot-scope="scoped">
            {{ scoped.row.genderEnum == 'MALE' ? '男' : '女' }}
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
      </etm-table-page>
    </etm-layout-split>

    <etm-pop
      title="新学员"
      :visible="isShowNewStudent"
      cancel-btn="取消"
      @cancel="close"
      @confirm="newStudentConfirm"
      @close="close"
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
// import SearchField from '@/views/daycare/childManage/myChild/components/searchField'
import formValidate from '@/utils/rules'
import {
  queryClassChildren,
  queryClassDetail,
  updateClassDetail,
  getOutClass,
  queryClasses,
  exchangeClass,
  queryAllChildren,
  createJoinChildren
} from '@/api/newDaycare/classes'

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
      columns2: [
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
        }, {
          label: '剩余时间',
          prop: 'lastLesson',
          width: '120',
          align: 'center',
          'header-align': 'center'
        }
      ],

      tableData2: {
        content: []
      },
      // tableData3: {
      //   content: []
      // },
      formValidate,
      form: {
        headTeacherId: '',
        fullNumber: 20,
        remark: '',
        caeClazzName: '',
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

    queryClassDetail({ caeClazzId: this.classid }).then(res => {
      this.detailData = res.data
      this.form = {
        headTeacherId: res.data.headTeacherId,
        fullNumber: res.data.fullNumber,
        remark: res.data.remark,
        caeClazzName: res.data.caeClazzName,
        enable: res.data.enable,
        childNumber: res.data.childNumber,
        lastNumber: res.data.lastNumber,
        headTeacherName: res.data.headTeacherName
      }
    })
  },
  mounted () {
  },
  methods: {
    close () {
      this.isShowNewStudent = false
      this.joinStudent = []
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
        this.tableData2.content = res.data
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

          updateClassDetail({ ...queryParams, caeClazzId: this.classid }).then(res => {
            this.$emit('update', {})
            this.isEdit = false
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

            if (this.tableData2.content.length) {
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
