<template>
  <div
    class="addChildForm-wrap"
    :class="{layout : !childId}"
  >
    <etm-form
      ref="etmForm"
      type="dialog"
      :model="childForm"
      :rules="childRules"
    >
      <etm-title>基础信息</etm-title>
      <el-form-item label="头像">
        <etm-upload-avatar
          v-model="childForm.avatar"
          resource-name="newDaycare/childManage/image"
          media-type="image"
          :upload-file="uploadFile"
          @success="uploadSuccess"
        />
      </el-form-item>
      <div class="layout-row">
        <div class="layout-col">
          <el-form-item
            label="学员姓名"
            prop="childName"
          >
            <el-input
              ref="first"
              v-model="childForm.childName"
            />
          </el-form-item>
        </div>
        <div class="layout-col">
          <el-form-item label="性别">
            <el-select v-model="childForm.gender">
              <el-option
                value="MALE"
                label="男"
              />
              <el-option
                value="FEMALE"
                label="女"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="生日">
        <el-date-picker
          v-model="childForm.birthday"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择生日"
        />
      </el-form-item>
      <el-form-item label="地区">
        <etm-address
          v-model="childForm.areaCode"
          :area-id="childForm.areaCode"
        />
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input
          v-model="childForm.address"
          placeholder="请输入详细地址"
        />
      </el-form-item>

      <etm-title>联系信息</etm-title>
      <el-form-item
        label="联系人"
        required
      >
        <div
          v-for="(contact, index) of childForm.relationshipList"
          :key="index"
          class="contact"
          :class="{edit : childId}"
        >
          <el-form-item
            :prop="`relationshipList.${index}.relationshipId`"
            required
            :rules="{
              required: true, message: '称谓不能为空', trigger: ['change','blur']
            }"
          >
            <el-select
              v-model="contact.relationshipId"
              clearable
            >
              <el-option
                v-for="title in relationList"
                :key="title.value"
                :label="title.label"
                :value="title.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :prop="`relationshipList.${index}.parentName`"
            :rules="{required: true, message: '联系人不能为空', trigger: ['blur']}"
          >
            <el-input
              v-model="contact.parentName"
              :disabled="contact.lock"
              placeholder="联系人姓名"
            />
          </el-form-item>

          <el-form-item
            :prop="`relationshipList.${index}.telephone`"
            :rules="{trigger: ['blur'], validator:validatorPhone}"
          >
            <el-input
              v-model="contact.telephone"
              type="text"
              placeholder="联系人电话"
              maxlength="11"
              @input="checkPhone(index)"
            />
          </el-form-item>

          <etm-font-icon
            v-if="index === 0"
            name="plus"
            @click.native="addContact"
          />
          <etm-font-icon
            v-else
            name="minus"
            @click.native="removeContact(index)"
          />
        </div>
      </el-form-item>

      <div class="layout-row">
        <div class="layout-col">
          <el-form-item label="QQ">
            <el-input
              v-model="childForm.qqNumber"
              placeholder="请输入QQ号"
            />
          </el-form-item>
        </div>
        <div class="layout-col">
          <el-form-item label="微信">
            <el-input
              v-model="childForm.wechatNumber"
              placeholder="请输入微信号"
            />
          </el-form-item>
        </div>
      </div>

      <etm-title>其他信息</etm-title>
      <div class="layout-row">
        <div class="layout-col">
          <el-form-item label="学员状态">
            <el-select
              v-model="childForm.statusId"
              clearable
              @change="forceUpdate"
            >
              <el-option
                v-for="(status) of statusList"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="layout-col">
          <el-form-item label="重要程度">
            <el-select
              v-model="childForm.importanceAttrId"
              clearable
              @change="forceUpdate"
            >
              <el-option
                v-for="(importance) of importanceList"
                :key="importance.value"
                :label="importance.label"
                :value="importance.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="layout-row">
        <div class="layout-col">
          <el-form-item label="学员来源">
            <el-cascader
              v-model="childForm.source"
              :options="sourceList"
            />
          </el-form-item>
        </div>
        <div class="layout-col">
          <el-form-item label="标签">
            <el-select
              v-model="childForm.tagIdList"
              clearable
              multiple
              @change="forceUpdate"
            >
              <el-option
                v-for="(tag) of tagIdList"
                :key="tag.value"
                :label="tag.label"
                :value="tag.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="会员卡">
        <div
          v-for="(contact, index) of childForm.membershipCards"
          :key="index"
          class="contact"
          :class="{edit : childId}"
        >
          <el-form-item>
            <el-select
              v-model="contact.cardTypeId"
              clearable
              placeholder="请选择会员卡类型"
            >
              <el-option
                v-for="title in userCardType"
                :key="title.membershipCardTypeId"
                :label="title.membershipCardTypeName"
                :value="title.membershipCardTypeId"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            :prop="`membershipCards.${index}.cardNumber`"
            :rules="{trigger: ['blur'], validator:validatorCard, id : contact['cardId'] || ''}"
          >
            <el-input
              v-model="contact.cardNumber"
              placeholder="请输入会员卡号"
            />
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="contact.id"
              clearable
              placeholder="请选择关联联系人"
            >
              <template v-for="item in childForm.relationshipList">
                <el-option
                  v-if="item.relationshipId && item.parentName && item.telephone"
                  :key="item.cid"
                  :label="`${item.parentName}(${relationMap[item.relationshipId].relationshipName}) ${item.telephone}`"
                  :value="item.cid"
                />
              </template>
            </el-select>
          </el-form-item>

          <etm-font-icon
            v-if="index === 0"
            name="plus"
            @click.native="addContact2"
          />
          <etm-font-icon
            v-else
            name="minus"
            @click.native="removeContact2(index)"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <div
          slot="label"
          class="diyLabel"
        >
          人脸照片
          <el-tooltip
            popper-class="stepTips"
            placement="right"
          >
            <i class="iconfont iconquestion-circle" />
            <div
              slot="content"
            >
              图片尺寸为640*480左右 <br>
              图片中只有一个人像<br>
              图片中人像端正<br>
              图片中人像占图片30%以上，面部区域像素不低于128x128<br>
              图片大小不超过400K<br>
              确保同一人员注册照均为本人
            </div>
          </el-tooltip>
        </div>
        <etm-upload-img
          :resource-name="'newDaycare/childManage/face'"
          :preview-src-list="previewSrcLists"
          :preview-src-key="previewSrcKey"
          :limit-size="0.4"
          :limit-number="3"
          @getImgList="getImgList"
        />
      </el-form-item>
      <div class="layout-row">
        <div class="layout-col">
          <el-form-item label="跟进人员">
            <el-select
              v-model="childForm.followerId"
              clearable
              :disabled="edit"
              @change="forceUpdate"
            >
              <el-option
                v-for="(employee) of employeeList"
                :key="employee.value"
                :label="employee.label"
                :value="employee.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="layout-col">
          <el-form-item label="市场人员">
            <el-select
              v-model="childForm.marketerId"
              clearable
              @change="forceUpdate"
            >
              <el-option
                v-for="(employee) of employeeList"
                :key="employee.value"
                :label="employee.label"
                :value="employee.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="备注">
        <el-input
          v-model="childForm.remark"
          maxlength="200"
          show-word-limit
          type="textarea"
          :rows="4"
          placeholder="请输入备注内容"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
import { getEmployee } from '@/views/newDaycare/contract/common'
import { uploadFile } from '@/api/base'
import { validPhoneNumber } from '@/utils/validate'
import EtmAddress from '@/views/base/org/EtmAddress'
import {
  queryChildAttribute,
  queryChildRelationship,
  queryChildSource,
  queryChildStatus,
  queryChildTagSelect,
  queryCheckCardNumber
} from '@/api/newDaycare/childManageSetting'
import { queryEmployeeSelectByTabCode } from '@/api/base/employee'
import baseMixin from '@/layout/mixin/baseMixin'
import {
  queryChildInfoForEdit,
  // queryContactsList,
  queryUserCardType,
  queryParentInfo
} from '@/api/newDaycare/childManage'
import etmUploadImg from '@/components/EtmUploadImg/index'
import { parseTime } from '@/utils'
// getImgUrlRelativePath

/**
 * addChildForm create by haijinsha
 * createTime 2020/8/27 20:46
 */
export default {
  name: 'AddChildForm',
  components: { EtmAddress, etmUploadImg },
  filters: {},
  mixins: [baseMixin],
  props: {
    childId: {
      type: [String, Number],
      default: ''
    },
    childType: {
      type: String,
      default: ''
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
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

    const validatorCard = function (rule, value, cb) {
      if (value === '') {
        return cb()
      }

      if (value) {
        if (!/^\d+$/.test(value)) {
          return cb(new Error('请填写数字'))
        } else {
          queryCheckCardNumber({ cardNumber: value }).then(res => {
            if (res.data) {
              if (rule.id === res.data.membershipCardId && value === res.data.cardNumber) {
                cb()
              } else {
                cb(new Error('卡号已存在'))
              }
            } else {
              cb()
            }
          })
        }
      }
    }

    return {
      userCardType: [],
      previewSrcLists: [],
      previewSrcKey: [],
      currContactsId: 1,
      relationMap: {},
      uploadFile: uploadFile,
      validatorPhone: validatorPhone,
      validatorCard: validatorCard,
      // 称呼
      relationList: [],
      // 学员标签
      tagIdList: [],
      // 状态
      statusList: [],
      // 来源
      sourceList: [],
      // 跟进/市场人员
      employeeList: [],
      // 重要程度
      importanceList: [],
      childForm: {
        avatar: '',
        childName: '',
        remark: '',
        membershipCards: [
          {
            cardId: null,
            cardNumber: '',
            childId: null,
            kinshipId: null,
            personPhone: '',
            cardTypeId: null,
            id: null
          }
        ],
        relationshipList: [
          {
            lock: false,
            cid: 1,
            cachePhone: '',
            relationshipId: null,
            parentName: '',
            telephone: ''
          }
        ],
        gender: null,
        birthday: '',
        areaCode: '',
        address: '',
        qqNumber: '',
        wechatNumber: '',
        status: '',
        important: '',
        source: [],
        sourceId: '',
        followerId: '',
        marketerId: '',
        importanceAttrId: '',
        tagIdList: []
      },
      childRules: {
        childName: [
          { required: true, message: '请输入学员姓名', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.first.focus()
    })
    this.init()
  },
  methods: {
    getImgList (val, key) {
      this.previewSrcLists = val
      this.previewSrcKey = key
    },
    checkPhone (index) {
      const tel = this.childForm.relationshipList[index].telephone
      const cacheTel = this.childForm.relationshipList[index].cachePhone
      if (/^1\d{10}$/.test(tel)) {
        let total = 0
        this.childForm.relationshipList.forEach(cur => {
          if (cur.telephone === tel) {
            ++total
          }
        })

        if (total > 1) {
          this.$message.warning('已存在重复电话号码')
          this.$nextTick(() => {
            this.childForm.relationshipList[index].telephone = ''
            this.childForm.relationshipList[index].cachePhone = ''
          })
          return
        }

        this.childForm.relationshipList[index].cachePhone = tel
        if (cacheTel !== tel) {
          queryParentInfo(tel).then(res => {
            if (res.data) {
              this.$etmTip.init({
                type: 'warn',
                title: '提示',
                content: `该手机号码已绑定${(res.data.childNameList).join('、')}，是否确认为同家庭？`,
                confirmBtn: '确认',
                cancelBtn: '取消',
                cancel: () => {
                  if (this.childForm.relationshipList[index].lock) {
                    this.childForm.relationshipList[index].parentName = ''
                  }
                  this.childForm.relationshipList[index].lock = false
                  this.childForm.relationshipList[index].telephone = ''
                  this.childForm.relationshipList[index].cachePhone = ''
                  this.$etmTip.close()
                },
                confirm: () => {
                  this.childForm.relationshipList[index].parentName = res.data.parentName
                  this.childForm.relationshipList[index].lock = true
                  this.$etmTip.close()
                }
              })
              this.$etmTip.open()
            } else {
              this.childForm.relationshipList[index].lock = false
            }
          })
        }
      } else {
        this.childForm.relationshipList[index].lock = false
      }
    },
    init () {
      if (this.childId) {
        queryChildInfoForEdit({ childId: this.childId }).then(result => {
          const item = result.data
          for (const itemKey in item) {
            if (item[itemKey] && itemKey.includes('Time')) {
              item[itemKey] = parseTime(item[itemKey], '{y}-{m}-{d}')
            }
          }

          if (!item.membershipCards || !item.membershipCards.length) {
            item.membershipCards = [{
              cardId: null,
              cardNumber: '',
              childId: null,
              kinshipId: null,
              personPhone: '',
              cardTypeId: null,
              id: null
            }]
          }

          item.relationshipList.forEach((cur, index) => {
            cur.cid = index + 1
            cur.cachePhone = cur.telephone
            cur.lock = false

            item.membershipCards.forEach(c => {
              if (c.personRelationId === cur.kinshipId) {
                c.id = index + 1
              }
            })
          })

          this.childForm = item

          item.faceList = item.faceList ? item.faceList : []

          item.faceList.forEach(cur => {
            this.previewSrcLists.push(cur.url)
            this.previewSrcKey.push(cur.url)
          })

          this.childForm.source = this.childForm.sourceId ? [this.childForm.sourceParentId, this.childForm.sourceId] : []
          this.childForm.birthday = this.childForm.birthday && parseTime(this.childForm.birthday, '{y}-{m}-{d}')
          this.childForm.tagIdList = this.childForm.tagList

          // this.form.previewSrcLists.push(item.url)
          // this.form.previewSrcKey.push(getImgUrlRelativePath(item.url))

          this.currContactsId = this.childForm.relationshipList.length

          queryChildStatus({ childCategory: result.data.category }).then(res => {
            this.statusList = [...this.statusList, ...this.convertDataToOptions(res.data, 'childStatusName', 'childStatusId')]
            if (!this.edit) {
              this.childForm.statusId = (this.statusList.find(item => item.label === '新客户') || { value: '' }).value
            }
            // 已成交学员和历史学员可以相互转状态, 要拼接这两种状态的下拉选项
            switch (result.data.category) {
              case 'DEAL':
                queryChildStatus({ childCategory: 'HISTORY' }).then(res => {
                  this.statusList = [...this.statusList, ...this.convertDataToOptions(res.data, 'childStatusName', 'childStatusId')]
                })
                break
              case 'HISTORY':
                queryChildStatus({ childCategory: 'DEAL' }).then(res => {
                  this.statusList = [...this.statusList, ...this.convertDataToOptions(res.data, 'childStatusName', 'childStatusId')]
                })
                break
            }
          })
        })
      } else {
        queryChildStatus({ childCategory: 'UNSOLD' }).then(res => {
          this.statusList = this.convertDataToOptions(res.data, 'childStatusName', 'childStatusId')
          if (!this.edit) {
            this.childForm.statusId = (this.statusList.find(item => item.label === '新客户') || { value: '' }).value
          }
        })

        // const userInfo = JSON.parse(localStorage.getItem('account'))
        this.childForm.marketerId = getEmployee().employeeId
      }

      queryUserCardType().then(res => {
        this.userCardType = res.data
      })

      queryChildRelationship().then(res => {
        const relationList = this.convertDataToOptions(res.data, 'relationshipName', 'relationshipId')
        this.relationList = relationList
        const relationMap = {}

        relationList.forEach((cur) => {
          relationMap[cur.relationshipId] = cur
        })

        this.relationMap = relationMap
        // console.log(relationList)
      })
      queryChildTagSelect().then(res => {
        this.tagIdList = this.convertDataToOptions(res.data, 'tagName', 'tagId')
      })
      queryChildSource().then(res => {
        this.sourceList = res.data.map(cur => {
          const result = {
            value: cur.childSourceId,
            label: cur.childSourceName,
            children: []
          }

          result.children = (cur.childSourceChildList || []).map(c => {
            return {
              value: c.childSourceId,
              label: c.childSourceName
            }
          })

          return result
        })
      })
      queryChildAttribute({ name: 'IMPORTANCE' }).then(res => {
        this.importanceList = this.convertDataToOptions(res.data, 'option', 'childAttributeId')
      })
      queryEmployeeSelectByTabCode({ tagCode: '' }).then(res => {
        this.employeeList = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    relationChange (event, index) {
      console.log(event, index)
    },
    uploadSuccess (hash, url) {
      this.childForm.avatar = url
    },
    // 添加学员
    addContact () {
      this.childForm.relationshipList.push({
        cid: this.currContactsId + 1,
        telephone: '',
        cachePhone: '',
        lock: false
      })

      this.currContactsId += 1
    },

    addContact2 () {
      this.childForm.membershipCards.push({
        cardId: null,
        cardNumber: '',
        childId: null,
        kinshipId: null,
        personPhone: '',
        id: null,
        cardTypeId: null
      })
    },
    removeContact2 (index) {
      this.childForm.membershipCards.splice(index, 1)
    },
    removeContact (index) {
      const delId = this.childForm.relationshipList[index].cid

      this.childForm.membershipCards.forEach(cur => {
        if (cur.id === delId) {
          cur.id = null
        }
      })
      this.childForm.relationshipList.splice(index, 1)
    },
    submit () {
      // console.log(this.childForm)
      return new Promise((resolve, reject) => {
        this.$refs.etmForm.$children[0].validate((valid) => {
          if (valid) {
            this.childForm.membershipCards.forEach(cur => {
              for (let i = 0; i < this.childForm.relationshipList.length; i++) {
                if (cur.id === this.childForm.relationshipList[i].cid) {
                  cur.personPhone = this.childForm.relationshipList[i].telephone
                }
              }
            })
            this.childForm.faceList = this.previewSrcKey.map(cur => {
              return {
                name: 'face',
                url: cur
              }
            })
            this.childForm.sourceId = this.childForm.source[1] || null
            resolve(this.childForm)
          } else {
            reject(new Error())
          }
        })
        // reject(new Error())
        // return result
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.addChildForm-wrap {
  ::v-deep {
    .el-form-item {
      > .el-form-item__label {
        width: 90px !important;
      }

      > .el-form-item__content {
        margin-left: 90px !important;
      }
    }

    .contact {
      .el-form-item {
        > .el-form-item__content {
          margin-left: 0 !important;
        }
      }
    }
  }

  .diyLabel {
    align-items: center;
    display: flex;

    .iconquestion-circle {
      //position: relative;
      display: inline-block;
      height: 32px;
      overflow: hidden;
      width: 20px;

      &::before {
        //position: absolute;
        //top: 0;
        //left: 0;
        //transform: translate(-50%, -50%);
      }
    }
  }

  &.layout {
    .layout-row {
      display: flex;

      .layout-col {
        flex: 1;
        margin-left: 40px;

        &:first-child {
          margin-left: 0;
          margin-right: 40px;
        }
      }
    }
  }

  .contact {
    display: flex;
    flex-wrap: wrap;

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    &.edit {
      ::v-deep {
        > div:not(:nth-of-type(3)) {
          margin-bottom: 16px;
          margin-right: 0;
          width: 100%;
        }
      }
    }

    ::v-deep {
      > .el-form-item {
        flex: auto;
        width: 100px;

      }

      > *:not(i) {
        margin-right: 8px;
      }

      .EtmFontIcon-wrap {
        align-items: center;
        display: flex;
        margin-left: 8px;
      }
    }
  }
}
</style>
