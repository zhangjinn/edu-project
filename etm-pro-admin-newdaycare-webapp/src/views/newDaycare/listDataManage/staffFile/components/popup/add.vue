<template>
  <div>
    <el-form
      ref="form"
      class="edit"
      :model="addForm"
      type="dialog"
      label-position="top"
      :inline="true"
    >
      <!--基础信息栏-->
      <div class="basic">
        <etm-title
          :border="false"
          title="基础信息"
        />
        <div class="basic-form-item">
          <div
            class="basic-avatar"
            style="position: relative;"
          >
            <img
              v-if="addForm.avatar"
              style="height: 130px;
  width: 130px;"
              :src="addForm.avatar"
            >
            <img
              v-else
              src="@/assets/images/newDaycare/photo.png"
            >
            <!--蒙层-->
            <div class="cover" />
            <el-button
              class="avatarBtn"
              size="mini"
              @click="handleAddAvatar"
            >
              <i class="el-icon-plus" />添加图片
            </el-button>
            <input
              ref="addCoverRef"
              type="file"
              accept="image/*"
              style="display: none;"
              @change="changeFileImg"
            >
          </div>
          <div class="basic-info">
            <!--<div class="info-item">-->
            <el-form-item
              label="员工名称"
              prop="employeeRecordName"
              style="width: 27%;"
              :rules="staffRules.name"
            >
              <el-input
                ref="first"
                v-model="addForm.employeeRecordName"
                size="small"
                maxlength="10"
                placeholder="请输入姓名"
              />
            </el-form-item>
            <el-form-item
              label="联系电话"
              prop="telephone"
              style="width: 27%;"
              :rules="staffRules.phone"
            >
              <el-input
                v-model="addForm.telephone"
                size="small"
                maxlength="11"
                placeholder="联系电话"
              />
            </el-form-item>
            <el-form-item
              label="入职时间"
              prop="entryTime"
              style="width: 27%;"
            >
              <el-date-picker
                v-model="addForm.entryTime"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                type="date"
                size="small"
                placeholder="请选择入职时间"
              />
            </el-form-item>
            <el-form-item
              label="性别"
              prop="gender"
              size="small"
              style="width: 27%;"
            >
              <el-select
                v-model="addForm.gender"
                placeholder="请选择性别"
              >
                <el-option
                  v-for="item in genderOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="出生日期"
              prop="birthday"
              style="width: 27%;"
            >
              <el-date-picker
                v-model="addForm.birthday"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                type="date"
                size="small"
                placeholder="请选择生日"
              />
            </el-form-item>
            <el-form-item
              prop="birthday"
              style="width: 27%;"
            />
            <!--</div>-->
          </div>
        </div>
      </div>

      <!--个人信息栏-->
      <div class="basic">
        <etm-title
          :border="false"
          title="个人信息"
        />
        <div class="basic-form-item">
          <div class="basic-info clear-margin">
            <el-form-item
              label="证件类型"
              prop="certificateType"
              style="width: 27%;"
            >
              <el-select
                v-model="addForm.certificateType"
                placeholder="请选择证件类型"
                size="small"
              >
                <el-option
                  v-for="item in cardOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="证件号码"
              prop="certificateNumber"
              style="width: 27%;"
            >
              <el-input
                v-model="addForm.certificateNumber"
                size="small"
                maxlength="20"
                placeholder="请输入证件号码"
              />
            </el-form-item>
            <el-form-item
              label="民族"
              prop="clan"
              style="width: 27%;"
            >
              <el-select
                v-model="addForm.clan"
                placeholder="请选择民族类型"
                size="small"
              >
                <el-option
                  v-for="item in nationOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="籍贯"
              prop="hometown"
              style="width: 27%;"
            >
              <el-input
                v-model="addForm.hometown"
                size="small"
                maxlength="10"
                placeholder="请选择籍贯"
              />
            </el-form-item>
            <el-form-item
              label="婚姻状况"
              prop="marriage"
              style="width: 27%;"
            >
              <el-select
                v-model="addForm.marriage"
                placeholder="请选择婚姻情况"
                size="small"
              >
                <el-option
                  v-for="item in marrigeOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="户口类型"
              prop="hukouType"
              style="width: 27%;"
            >
              <el-select
                v-model="addForm.hukouType"
                placeholder="请选择户口类型"
                size="small"
              >
                <el-option
                  v-for="item in hukouTypeOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="户口所在地"
              prop="areaCode"
              style="width: 27%;"
            >
              <!--<el-input-->
              <!--  v-model="addForm.areaCode"-->
              <!--  size="small"-->
              <!--  placeholder="请选择户口所在地"-->
              <!--/>-->
              <etm-address
                v-model="addForm.areaCode"
                :area-id="addForm.areaCode"
              />
            </el-form-item>
            <el-form-item
              label="家庭地址"
              prop="address"
              style="width: 27%;"
            >
              <el-input
                v-model="addForm.address"
                size="small"
                placeholder="请输入家庭地址"
              />
            </el-form-item>
            <el-form-item
              prop="address"
              style="width: 27%;"
            />
          </div>
        </div>
      </div>

      <!--工作信息栏-->
      <div class="basic">
        <etm-title
          :border="false"
          title="工作信息"
        />
        <div class="basic-form-item">
          <div class="basic-info clear-margin">
            <el-form-item
              label="职位"
              prop="positionId"
              style="width: 27%;"
            >
              <el-select
                v-model="addForm.positionId"
                placeholder="请选择职位类型"
                size="small"
              >
                <el-option
                  v-for="item in positionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="职称"
              prop="professionId"
              style="width: 27%;"
            >
              <el-select
                v-model="addForm.professionId"
                placeholder="请选择职称"
                size="small"
              >
                <el-option
                  v-for="item in professionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="职位证书"
              prop="vocationalCertificate"
              style="width: 27%;"
            >
              <el-input
                v-model="addForm.vocationalCertificate"
                size="small"
                maxlength="20"
                placeholder="请输入证书名称"
              />
            </el-form-item>
          </div>
        </div>
      </div>

      <!--学历信息栏-->
      <div class="basic">
        <etm-title
          :border="false"
          title="学历信息"
        />
        <div class="basic-form-item">
          <div class="basic-info clear-margin">
            <el-form-item
              label="学历"
              prop="education"
              style="width: 27%;"
            >
              <el-select
                v-model="addForm.education"
                placeholder="请选择学历"
                size="small"
              >
                <el-option
                  v-for="item in educationOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="毕业院校"
              prop="graduatedSchool"
              style="width: 27%;"
            >
              <el-input
                v-model="addForm.graduatedSchool"
                size="small"
                placeholder="请输入毕业院校"
              />
            </el-form-item>
            <el-form-item
              label="专业"
              prop="profession"
              style="width: 27%;"
            >
              <el-input
                v-model="addForm.profession"
                size="small"
                maxlength="20"
                placeholder="请输入专业名称"
              />
            </el-form-item>
          </div>
        </div>
      </div>

      <!--合同信息栏-->
      <div class="basic">
        <etm-title
          :border="false"
          title="合同信息"
        />
        <div class="basic-form-item">
          <div class="basic-info clear-margin">
            <el-form-item
              label="合同类型"
              prop="contractType"
              style="width: 27%;"
            >
              <el-select
                v-model="addForm.contractType"
                placeholder="请选择合同类型"
                size="small"
              >
                <el-option
                  v-for="item in contractTypeOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="合同起始日"
              prop="contractStartTime"
              style="width: 27%;"
            >
              <el-date-picker
                v-model="addForm.contractStartTime"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                type="date"
                size="small"
                placeholder="请选择日期"
              />
            </el-form-item>
            <el-form-item
              label="合同终止日"
              prop="contractEndTime"
              style="width: 27%;"
            >
              <el-date-picker
                v-model="addForm.contractEndTime"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                type="date"
                size="small"
                placeholder="请选择日期"
              />
            </el-form-item>
            <el-form-item
              label="签合同次数"
              prop="contractCount"
              style="width: 27%;"
            >
              <el-input
                v-model="addForm.contractCount"
                size="small"
                maxlength="10"
                placeholder="请输入签合同次数"
              />
            </el-form-item>
            <el-form-item
              label="编制情况"
              prop="compilationStatus"
              style="width: 27%;"
            >
              <el-select
                v-model="addForm.compilationStatus"
                placeholder="请选择编制情况"
                size="small"
              >
                <el-option
                  v-for="item in compilationStatusOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="compilationStatus"
              style="width: 27%;"
            />
          </div>
        </div>
      </div>

      <!--其他信息栏-->
      <div class="basic">
        <etm-title
          :border="false"
          title="其他信息"
        />
        <div class="basic-form-item">
          <div class="basic-info clear-margin">
            <el-form-item
              label="备注"
              prop="remarks"
              style="width: 100%;"
            >
              <el-input
                v-model="addForm.remarks"
                type="textarea"
                maxlength="200"
                size="small"
                placeholder="请输入备注"
              />
            </el-form-item>

            <el-form-item
              label="附件"
              prop="annex"
              style="width: 100%;"
            >
              <el-upload
                ref="upload"
                class="upload-demo"
                drag
                :file-list="addForm.annex"
                action="#"
                :auto-upload="false"
                :on-change="fileChange"
                :on-remove="fileRemove"
                @click.native="handleFile"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
              </el-upload>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
/**
 * edit create by Administrator
 * createTime 2021/1/28 11:41
 */
import baseMixin from '@/layout/mixin/baseMixin'
import StaffMixin from '../../staffMixin'
import formValidate from '@/utils/rules'
import { queryStaffSettingsList } from '@/api/newDaycare/staffFile'
import EtmAddress from '@/views/base/org/EtmAddress'
import { deepCopy } from '@/utils/common'
import { validPhoneNumber } from '@/utils/validate'

export default {
  name: 'Edit',
  components: { EtmAddress },
  filters: {},
  mixins: [baseMixin, StaffMixin],
  props: {},
  data () {
    const validatorPhone = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('手机号码不能为空'))
      }
      if (!validPhoneNumber(value)) {
        return cb(new Error('手机号码不正确'))
      }

      return cb()
    }
    return {
      formValidate,
      positionOptions: [],
      validatorPhone: validatorPhone,
      professionOptions: [],
      addForm: {
        avatar: '',
        name: '',
        annex: []
      },
      staffRules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validatorPhone }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.first.focus()
    })
    this.init()
  },
  methods: {
    async init () {
      await queryStaffSettingsList({ type: 'PROFESSION' }).then(res => {
        this.positionOptions = this.convertDataToOptions(res.data, 'headquartersSettingName', 'headquartersSettingId')
        // console.log(this.positionOptions, 'p[s')
      })
      await queryStaffSettingsList({ type: 'POSITION' }).then(res => {
        this.professionOptions = this.convertDataToOptions(res.data, 'headquartersSettingName', 'headquartersSettingId')
        console.log(this.professionOptions, '2323')
      })
    },
    fileChange (file) {
      console.log(this.addForm, 'annex')

      const total = 1024 * 1024 * 10
      const files = deepCopy(this.addForm.annex)
      if (file.size > total) {
        this.addForm.annex = null
        setTimeout(() => {
          this.addForm.annex = files
        }, 0)
        return this.$message.error('文件不能超过10M')
      }

      if (!this.checkFile(file)) {
        this.addForm.annex = null

        setTimeout(() => {
          this.addForm.annex = files
        }, 0)
        return this.$message.error('请上传JPG/PNG/PDF/DOC/DOCX/XLS/XLSX文件')
      }
      this.addForm.annex.push(file)
    },
    checkFile (file) {
      const typeList = ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'xls', 'xlsx']
      return typeList.includes(file.name.split('.')[1])
    },
    fileRemove (file) {
      this.addForm.annex.forEach((cur, index) => {
        if (cur.name === file.name) {
          this.addForm.annex.splice(index, 1)
        }
      })
    },
    handleFile (e) {
      if (e.target.className === 'el-upload-list__item-name' && e.target.tagName === 'A') {
        const file = this.addForm.annex.find(item => item.name === e.target.innerText)
        let getUrl = ''
        if (window.createObjectURL !== undefined) {
          getUrl = window.createObjectURL(file.raw)
        } else if (window.URL !== undefined) { // mozilla(firefox)
          getUrl = window.URL.createObjectURL(file.raw)
        } else if (window.webkitURL !== undefined) { // webkit or chrome
          getUrl = window.webkitURL.createObjectURL(file.raw)
        }
        open(getUrl)
      }
    },
    handleAddAvatar () {
      this.$refs.addCoverRef.click()
    },
    changeFileImg () {
      const file = this.$refs.addCoverRef.files[0]
      console.log(file, 'file')
      this.addForm.avatar = URL.createObjectURL(file)
      // console.log(this.addForm.avatar, 'detail')
    }
  }
}
</script>
<style lang="scss" scoped>
  .edit {
    max-width: 100%;

    .basic {
      margin-top: 20px;
    }

    .basic-form-item {
      display: flex;
      width: 100%;

      .basic-avatar img {
        position: relative;
        top: 9%;
      }

      .avatarBtn {
        bottom: 64px;
        display: none;
        position: absolute;
        right: 20px;
      }

      .cover {
        display: none;
      }

      .basic-avatar:hover {
        .avatarBtn {
          display: inline-block;
          z-index: 5;
        }

        .cover {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          bottom: 20px;
          display: inline-block;
          height: 130px;
          position: absolute;
          right: 0;
          width: 130px;
          z-index: 2;
        }
      }

      .basic-info {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        margin-left: 10px;
        width: 100%;
      }

      .clear-margin {
        display: flex;
        justify-content: space-between;
        margin-left: 0;

        ::v-deep .el-form-item {
          margin-right: 36px;
        }
      }
    }
  }

  ::v-deep .edit .el-form {
    max-width: 100% !important;
    width: 100%;
  }

  ::v-deep .basic-info .el-form-item .el-form-item__label {
    padding: 0;
  }

  ::v-deep .basic-info .el-form-item .el-form-item__content .el-select {
    width: 100% !important;
  }

  ::v-deep .basic-info .el-form-item .el-form-item__content .el-date-editor {
    width: 100% !important;
  }

  ::v-deep .basic-info .el-form-item {
    margin-right: 32px;
  }

  ::v-deep .basic .EtmTitle-wrap {
    min-height: 30px;
    padding-bottom: 5px !important;
  }
</style>
