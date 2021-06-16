<template>
  <div class="add">
    <etm-form
      ref="form"
      type="dialog"
      :model="formData"
      :rules="rules"
    >
      <el-form-item
        label="请假幼儿"
        prop="childTargets"
      >
        <div class="childSelect">
          <template v-if="type === 'add'">
            <el-tag
              v-for="(tag, index) in formData.childTargets"
              :key="index"
              :closable="type === 'add'"
              @close="removeTag(index)"
            >
              {{ tag.childName }}
            </el-tag>
            <el-button
              v-show="type === 'add'"
              type="dashed"
              @click.stop="selectChild"
            >
              <i class="el-icon-plus" /> 选择幼儿
            </el-button>
          </template>

          <template v-else>
            <span
              v-for="(tag, index) in formData.childTargets"
              :key="index"
            >
              {{ tag.childName }}
              <span v-if="index < formData.childTargets.length-1">、</span>
            </span>
          </template>
        </div>
        <etm-pop
          :visible="showPop"
          pop="complex"
          title="选择幼儿"
          confirm-btn="选好了"
          cancel-btn="取消"
          @open="handlePopOpen"
          @close="handlePopClose"
          @confirm="handlePopConfirm"
          @cancel="handlePopCancel"
        >
          <div class="selPop">
            <div class="search">
              <template>
                <EtmClazzCascader
                  @change="val => {searchInfo.clazzValue = val}"
                />
                <el-input
                  v-model="searchInfo.childName"
                  prefix-icon="el-icon-search"
                  placeholder="请输入幼儿姓名"
                />
              </template>
              <el-button
                type="primary"
                @click="search"
              >
                搜索
              </el-button>
            </div>
            <etm-table
              ref="selTable"
              class="selTable"
              highlight-current-row
              :stripe="false"
              :columns="column"
              :data="selTableData"
              @current-change="handleCurrentChange"
            >
              <template>
                <el-table-column
                  slot="right"
                  label="性别"
                >
                  <template slot-scope="scoped">
                    {{ scoped.row.gender === 'MALE' ? '男' : scoped.row.gender === 'FEMALE' ? '女' : '' }}
                  </template>
                </el-table-column>
              </template>
            </etm-table>
          </div>
        </etm-pop>
      </el-form-item>
      <el-form-item
        label="开始时间"
        prop="startTime"
      >
        <el-date-picker
          v-model="formData.startTime"
          type="date"
          placeholder="请选择日期"
          @change="timeChange"
        />
      </el-form-item>
      <el-form-item
        label="结束时间"
        prop="endTime"
      >
        <el-date-picker
          v-model="formData.endTime"
          type="date"
          placeholder="请选择日期"
          :picker-options="{ disabledDate }"
          @change="timeChange"
        />
      </el-form-item>
      <el-form-item label="请假时长">
        {{ formData.leaveLast }}
      </el-form-item>
      <el-form-item
        label="请假类型"
        prop="leaveType"
      >
        <el-radio
          v-model="formData.leaveType"
          label="SICK_LEAVE"
          @change="formData.disease = []"
        >
          病假
        </el-radio>
        <el-radio
          v-model="formData.leaveType"
          label="LEAVE"
          @change="formData.disease = [1]"
        >
          事假
        </el-radio>
      </el-form-item>
      <el-form-item
        v-if="formData.leaveType === 'SICK_LEAVE'"
        label="病状"
        prop="disease"
      >
        <etm-screen-tab
          v-model="formData.disease"
          :options="list"
          multiple
        />
      </el-form-item>
      <el-form-item
        label="请假事由"
        prop="leaveReason"
      >
        <el-input
          v-model="formData.leaveReason"
          type="textarea"
          placeholder="请输入请假事由"
        />
      </el-form-item>
      <el-form-item
        label="上传图片"
        prop="previewSrcLists"
      >
        <etm-upload-img
          :resource-name="'newdaycare/attendanceGuard'"
          :preview-src-list="formData.previewSrcLists"
          :preview-src-key="formData.previewSrcKey"
          :limit="9"
          @getImgList="getImgList"
        />
      </el-form-item>
      <el-form-item
        label="通知家长"
        prop="notify"
      >
        <el-radio
          v-model="formData.notify"
          label="yes"
        >
          是
        </el-radio>
        <el-radio
          v-model="formData.notify"
          label="no"
        >
          否
        </el-radio>
      </el-form-item>
    </etm-form>
  </div>
</template>
<script>
import etmUploadImg from '@/components/EtmUploadImg/index'
import { getImgUrlRelativePath } from '@/utils'
import { queryLeaveLast, queryLeaveItemDetail } from '@/api/newDaycare/attendanceGuard'
import transferDate from '@/utils/date'
import EtmClazzCascader from '@/views/newDaycare/childManageGuard/EtmClazzCascader'
import { queryGuardChildList } from '@/api/newDaycare/childManageGuard'
export default {
  components: {
    etmUploadImg,
    EtmClazzCascader
  },
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      formData: {
        childTargets: [],
        startTime: '',
        endTime: '',
        leaveLast: '-',
        leaveType: '',
        disease: [],
        leaveReason: '',
        previewSrcLists: [],
        previewSrcKey: [],
        notify: ''
      },
      rules: {
        childTargets: [{
          required: true,
          validator (rule, value, callback) {
            if (value.length) {
              callback()
            } else {
              callback(new Error('请选择请假幼儿'))
            }
          }
        }],
        startTime: [{
          required: true,
          message: '请选择开始时间'
        }],
        endTime: [{
          required: true,
          message: '请选择结束时间'
        }],
        leaveType: [{
          required: true,
          message: '请选择请假类型'
        }],
        disease: [{
          required: true,
          validator (rule, value, callback) {
            if (value.length) {
              callback()
            } else {
              callback(new Error('请选择请假类型'))
            }
          }
        }],
        leaveReason: [{
          required: true,
          message: '请输入请假事由'
        }],
        // previewSrcLists: [{
        //   required: true,
        //   validator(rule, value, callback) {
        //     if (value.length) {
        //       callback()
        //     } else {
        //       callback(new Error('请上传图片'))
        //     }
        //   }
        // }],
        notify: [{
          required: true,
          message: '请选择是否通知家长'
        }]
      },
      showPop: false,
      searchInfo: {
        clazzValue: '',
        childName: ''
      },
      selTableData: [],
      childSelection: [], // 幼儿弹窗选中的数据
      column: [],
      type: 'add'
    }
  },
  created () {

  },
  methods: {
    getData (id) {
      this.type = 'edit'
      queryLeaveItemDetail(id).then(res => {
        const { data } = res
        const formData = {
          childTargets: [{
            childName: data.childName,
            childId: data.childId
          }],
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
          leaveLast: '-',
          leaveType: data.leaveType,
          disease: data.illnessIdList,
          leaveReason: data.leaveReason,
          notify: data.isNotice ? 'yes' : 'no'
        }
        formData.previewSrcKey = []
        formData.previewSrcLists = []
        Array.isArray(data.imageList) && data.imageList.forEach(v => {
          formData.previewSrcLists.push(v.url)
          formData.previewSrcKey.push(getImgUrlRelativePath(v.url))
        })
        this.formData = formData
        this.timeChange()
      }).catch(err => {
        console.error(err)
      })
    },
    search () { // 弹窗里搜索
      if (this.searchInfo.clazzValue || this.searchInfo.childName) {
        this.getChild()
      }
    },
    getChild () { // 请求幼儿列表
      const param = {}
      if (this.searchInfo.childName) {
        param.childName = this.searchInfo.childName
      }
      if (this.searchInfo.clazzValue) {
        param.clazzId = this.searchInfo.clazzValue[1]
      }
      queryGuardChildList(param).then(res => {
        this.selTableData = res.data
        this.$nextTick(() => {
          this.setSelection()
        })
      })
    },
    setSelection () { // 打开弹窗选中已选择的数据
      const arr = []
      for (let i = 0; i < this.selTableData.length; i++) {
        for (let v = 0; v < this.childSelection.length; v++) {
          if (this.selTableData[i].childId === this.childSelection[v].childId) {
            arr.push(this.selTableData[i])
          }
        }
      }
      arr.forEach(row => { // 选中数据
        this.$refs.selTable.$children[0].toggleRowSelection(row)
      })
    },
    handleCurrentChange (val) {
      this.childSelection = [val]
    },
    getImgList (val, key) {
      this.formData.previewSrcLists = val
      this.formData.previewSrcKey = key
    },
    disabledDate (time) {
      if (this.formData.startTime) {
        return time.getTime() < this.formData.startTime.getTime()
      } else {
        return false
      }
    },
    timeChange () {
      if (this.formData.startTime && this.formData.endTime) {
        if (this.formData.startTime.getTime() > this.formData.endTime.getTime()) {
          this.formData.startTime = ''
          this.formData.leaveLast = '-'
          this.$message.warning('结束时间不能早于开始时间！')
        } else {
          queryLeaveLast({
            startTIme: transferDate(this.formData.startTime).fullTime,
            endTime: transferDate(this.formData.endTime).fullTime
          }).then(res => {
            this.formData.leaveLast = res.data.length
          }).catch(err => {
            console.error(err)
          })
        }
      } else {
        this.formData.leaveLast = '-'
      }
    },
    selectChild () {
      this.selTableData = []
      this.column = [
        {
          label: '幼儿姓名',
          prop: 'childName'
        },
        {
          label: '班级',
          prop: 'clazzName'
        }
      ]
      this.getChild()
      this.handlePopOpen()
    },
    removeTag (index) {
      this.formData.childTargets.splice(index, 1)
    },
    handlePopOpen () {
      this.showPop = true
    },
    handlePopClose () {
      this.searchInfo = {}
      this.showPop = false
    },
    handlePopConfirm () {
      this.formData.childTargets = this.childSelection
      this.handlePopClose()
    },
    handlePopCancel () {
      this.handlePopClose()
    }
  }
}
</script>

<style scoped lang="scss">
.add {
  .childSelect {
    .el-tag {
      height: 32px;
      line-height: 32px;
      margin: 0 8px 8px 0;
    }
  }

  ::v-deep .EtmScreenTab-wrap {
    margin-bottom: 0;
  }
}

.selPop {
  .search {
    display: flex;
    padding-bottom: 16px;

    ::v-deep .el-cascader,
    .el-input {
      margin-right: 8px;
      width: 240px;
    }

    ::v-deep .el-cascader .el-input__suffix {
      > i {
        display: none;
      }
    }
  }
}
</style>
