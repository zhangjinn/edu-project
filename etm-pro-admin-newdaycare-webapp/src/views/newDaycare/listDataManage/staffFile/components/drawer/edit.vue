<template>
  <div>
    <el-form
      ref="form"
      class="edit"
      :model="employeeDetailData"
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
              v-if="employeeDetailData.avatar"
              style="border-radius: 4px;
  height: 130px;
  width: 130px;"
              :src="employeeDetailData.avatar"
            >
            <img
              v-else
              src="@/assets/images/newDaycare/photo.png"
              style="border-radius: 4px;
  height: 130px;
  width: 130px;"
            >
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
              :rules="formValidate.nullValueRule(true,'请输入姓名')"
            >
              <el-input
                v-model="employeeDetailData.employeeRecordName"
                size="small"
                maxlength="10"
                placeholder="请输入姓名"
              />
            </el-form-item>
            <el-form-item
              label="联系电话"
              prop="telephone"
              style="width: 27%;"
              :rules="formValidate.nullValueRule(true,'联系电话')"
            >
              <el-input
                v-model="employeeDetailData.telephone"
                size="small"
                maxlength="10"
                placeholder="联系电话"
              />
            </el-form-item>
            <el-form-item
              label="入职时间"
              prop="entryTime"
              style="width: 27%;"
            >
              <el-date-picker
                v-model="employeeDetailData.entryTime"
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
                v-model="employeeDetailData.gender"
                placeholder="请选择性别"
                @change="changeNation"
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
                v-model="employeeDetailData.birthday"
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
                v-model="employeeDetailData.certificateType"
                placeholder="请选择证件类型"
                size="small"
                @change="changeNation"
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
                v-model="employeeDetailData.certificateNumber"
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
                v-model="employeeDetailData.clan"
                placeholder="请选择民族"
                size="small"
                @change="changeNation"
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
                v-model="employeeDetailData.hometown"
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
                v-model="employeeDetailData.marriage"
                placeholder="请选择民族"
                size="small"
                @change="changeMarrige"
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
                v-model="employeeDetailData.hukouType"
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
              <etm-address
                v-model="employeeDetailData.areaCode"
                :area-id="employeeDetailData.areaCode"
              />
              <!--<el-input-->
              <!--  v-model="employeeDetailData.areaCode"-->
              <!--  size="small"-->
              <!--  maxlength="10"-->
              <!--  placeholder="请选择户口所在地"-->
              <!--/>-->
            </el-form-item>
            <el-form-item
              label="家庭地址"
              prop="address"
              style="width: 27%;"
            >
              <el-input
                v-model="employeeDetailData.address"
                size="small"
                maxlength="10"
                placeholder="请输入家庭地址"
              />
            </el-form-item>
            <!--暂据空间-->
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
                v-model="employeeDetailData.positionId"
                placeholder="请选择职位类型"
                size="small"
                @change="changeNation"
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
                v-model="employeeDetailData.professionId"
                placeholder="请选择职称"
                size="small"
                @change="changeNation"
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
                v-model="employeeDetailData.vocationalCertificate"
                size="small"
                maxlength="10"
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
                v-model="employeeDetailData.education"
                placeholder="请选择学历"
                size="small"
                @change="changeNation"
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
                v-model="employeeDetailData.graduatedSchool"
                size="small"
                maxlength="10"
                placeholder="请输入毕业院校"
              />
            </el-form-item>
            <el-form-item
              label="专业"
              prop="profession"
              style="width: 27%;"
            >
              <el-input
                v-model="employeeDetailData.profession"
                size="small"
                maxlength="10"
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
                v-model="employeeDetailData.contractType"
                placeholder="请选择合同类型"
                size="small"
                @change="changeNation"
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
                v-model="employeeDetailData.contractStartTime"
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
                v-model="employeeDetailData.contractEndTime"
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
                v-model="employeeDetailData.contractCount"
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
                v-model="employeeDetailData.compilationStatus"
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
            <!--暂据空间-->
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
                v-model="employeeDetailData.remarks"
                type="textarea"
                size="small"
                maxlength="200"
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
                :file-list="employeeDetailData.annex"
                action="#"
                :auto-upload="false"
                :on-preview="handlePreview"
                :on-change="fileChange"
                :on-remove="fileRemove"
                @click.native="handleFile"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
              </el-upload>
              <p class="file-tip">
                只能上传JPG/PNG/PDF/DOC/DOCX/XLS/XLSX文件
              </p>
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
import formValidate from '@/utils/rules'
import StaffMixin from '../../staffMixin'
import { queryStaffSettingsList } from '@/api/newDaycare/staffFile'
import baseMixin from '@/layout/mixin/baseMixin'
import EtmAddress from '@/views/base/org/EtmAddress'
import { deepCopy } from '@/utils/common'
export default {
  name: 'Edit',
  components: { EtmAddress },
  filters: {},
  mixins: [StaffMixin, baseMixin],
  props: {
    employeeRecordId: {
      type: Number,
      default: () => {
        return undefined
      }
    },
    employeeDetailData: {
      type: Object,
      default: () => {
        return {
          annex: []
        }
      }
    }
  },
  data () {
    return {
      formValidate,
      positionOptions: [],
      professionOptions: []
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      await queryStaffSettingsList({ type: 'PROFESSION' }).then(res => {
        this.positionOptions = this.convertDataToOptions(res.data, 'headquartersSettingName', 'headquartersSettingId')
      })
      await queryStaffSettingsList({ type: 'POSITION' }).then(res => {
        this.professionOptions = this.convertDataToOptions(res.data, 'headquartersSettingName', 'headquartersSettingId')
      })
    },
    changeNation () {},
    changeMarrige () {},
    fileChange (file) {
      console.log(file, 'data')
      const total = 1024 * 1024 * 10
      const files = deepCopy(this.employeeDetailData.annex)
      if (file.size > total) {
        this.employeeDetailData.annex = null
        setTimeout(() => {
          this.employeeDetailData.annex = files
        }, 0)
        return this.$message.error('文件不能超过10M')
      }

      if (!this.checkFile(file)) {
        this.employeeDetailData.annex = null

        setTimeout(() => {
          this.employeeDetailData.annex = files
        }, 0)
        return this.$message.error('请上传JPG/PNG/PDF/DOC/DOCX/XLS/XLSX文件')
      }
      this.employeeDetailData.annex.push(file)
      console.log(this.employeeDetailData.annex, 'annex')
    },
    checkFile (file) {
      const typeList = ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'xls', 'xlsx']
      return typeList.includes(file.name.split('.')[1])
    },
    fileRemove (file) {
      this.employeeDetailData.annex.forEach((cur, index) => {
        if (cur.name === file.name) {
          this.employeeDetailData.annex.splice(index, 1)
        }
      })
    },
    handleFile (e) {
      if (e.target.className === 'el-upload-list__item-name' && e.target.tagName === 'A') {
        const file = this.employeeDetailData.annex.find(item => item.name === e.target.innerText)
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
    handlePreview () {},
    handleAddAvatar () {
      this.$refs.addCoverRef.click()
    },
    changeFileImg () {
      const file = this.$refs.addCoverRef.files[0]
      this.employeeDetailData.avatar = URL.createObjectURL(file)
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    .file-tip {
      color: #999;
      font-size: 12px;
      margin-top: 8px;
    }
  }

  .edit {
    max-width: 100%;

    .basic {
      margin-top: 8px;
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
        z-index: 5;
      }

      .cover {
        display: none;
      }

      .basic-avatar:hover {
        .avatarBtn {
          display: inline-block;
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
        justify-content: space-around;
        /*margin-left: 22px;*/
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
