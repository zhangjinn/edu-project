<template>
  <div class="childFollowPanel-wrap">
    <div class="btn-box">
      <el-button
        type="primary"
        @click="commentFollow('FOLLOW_UP')"
      >
        写跟进
      </el-button>
      <el-button
        plain
        @click="commentFollow('PHONE', $event)"
      >
        打电话
      </el-button>
      <el-button
        plain
        @click="commentFollow('SEND_MESSAGE', $event)"
      >
        发短信
      </el-button>

      <etm-pop
        pop="simple"
        :visible.sync="showCall"
        title="选择联系人"
        @close="showCall = false"
        @cancel="showCall = false"
        @confirm="showCall = false"
      >
        <ul>
          <li
            v-for="(item, index) of phoneLits"
            :key="index"
            class="callLi"
          >
            <div>{{ item.contactName }} ({{ item.contactRelationship }}) <span>{{ item.contactTelephone }}</span></div>
            <etm-text
              type="primary"
              @click="callPhone(item.contactTelephone, `${item.contactRelationship} ( ${item.contactName} )`)"
            >
              <i
                class="iconfont iconphone"
              />拨打
            </etm-text>
          </li>
        </ul>
      </etm-pop>
    </div>
    <div
      v-if="isCommentFollow"
      class="follow-box"
    >
      <el-collapse-transition>
        <el-form
          label-width="100px"
          label-position="left"
          :model="followData"
        >
          <el-row
            :span="24"
            :gutter="24"
          >
            <el-col :span="12">
              <el-form-item label="跟进方式">
                <el-select
                  v-model="followData.followWay"
                  clearable
                >
                  <el-option
                    v-for="(item) of settingType['FOLLOW_WAY']"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户销售阶段">
                <el-select
                  v-model="followData.customerSalesStage"
                  clearable
                >
                  <el-option
                    v-for="(item) of settingType['SALES_STAGE']"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            :span="24"
            :gutter="24"
          >
            <el-col :span="12">
              <el-form-item label="客户重要程度">
                <el-select
                  v-model="followData.customerImportantLevel"
                  clearable
                >
                  <el-option
                    v-for="(item) of settingType['IMPORTANT_LEVEL']"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预约体验时间">
                <el-date-picker
                  v-model="followData.bookExperienceTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            :span="24"
            :gutter="24"
          >
            <el-col :span="12">
              <el-form-item label="标签">
                <el-select
                  v-model="followData.customerMark"
                  clearable
                >
                  <el-option
                    v-for="(item) of settingType['MARK']"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下次跟进时间">
                <el-date-picker
                  v-model="followData.nextFollowTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="followRule"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="选择模板"
                placeholder="请选择模板"
              >
                <el-select
                  v-model="followData.templateId"
                  clearable
                  @change="handleTemplateChange"
                >
                  <el-option
                    v-for="(item) of childTemplateList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col
              v-for="(item) in followData.customFields"
              :key="item.id"
              :span="12"
            >
              <el-form-item :label="item.name">
                <el-input
                  v-if="item.controlType === 'INPUT_BOX'"
                  v-model="item.value"
                />

                <el-date-picker
                  v-else-if="item.controlType === 'DATE'"
                  v-model="item.value"
                  value-format="yyyy-MM-dd"
                />

                <el-select
                  v-else
                  v-model="item.value"
                >
                  <el-option
                    v-for="(i, k) in item.options"
                    :key="k"
                    :label="i.label"
                    :value="i.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="padding-bottom: 24px;">
            <el-col>
              <el-input
                v-model="followData.followContent"
                type="textarea"
                resize="none"
                :rows="4"
                placeholder="请填写跟进内容"
              />
            </el-col>
          </el-row>
          <el-row style="padding-bottom: 24px;">
            <el-col>
              <upload-img
                resource-name="childManage/more"
                :preview-src-list="followData.previewSrcLists"
                :preview-src-key="followData.previewSrcKey"
                :text="''"
                @getImgList="getImgList"
              />
            </el-col>
          </el-row>
          <el-row style="padding-bottom: 8px;">
            <el-col>
              <div class="btn-box">
                <el-button
                  plain
                  @click="cancel"
                >
                  取消
                </el-button>
                <el-button
                  v-throttle
                  type="primary"
                  @click="save"
                >
                  保存
                </el-button>
                <el-button
                  v-throttle
                  type="primary"
                  @click="next"
                >
                  保存并下一个
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-transition>
    </div>
    <etm-tabs
      v-model="currentTab"
      :show-toggle="false"
    >
      <el-tab-pane
        label="跟进记录"
        name="follow"
      />
      <el-tab-pane
        label="通话记录"
        name="call"
      />
      <el-tab-pane
        label="短信记录"
        name="message"
      />
      <el-tab-pane
        label="成交记录"
        name="deal"
      />
      <div class="timeline">
        <el-timeline>
          <template v-if="currentTab === 'call'">
            <el-timeline-item
              v-for="(item, index) of childDetail.callList"
              :key="index"
              :icon="computeIcon({type : '打电话'})"
            >
              <div class="title-box">
                <span class="title">打电话</span>
                <span class="time">{{ item.startTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </div>
              <etm-field-label
                type="left"
                label="播放"
              >
                <!--                <etm-text v-if="!item.phoneRecordingUrl" type="normal">未接通</etm-text>-->
                <etm-text
                  type="primary"
                  @click="playAudio(item.downSrcRecordUrl, $event)"
                >
                  播放
                </etm-text>
              </etm-field-label>
              <etm-field-label
                type="left"
                label="操作人"
              >
                {{ item.operator }}
              </etm-field-label>
            </el-timeline-item>
            <etm-empty v-if="childDetail.callList.length === 0" />
          </template>
          <template v-if="currentTab === 'deal'">
            <el-timeline-item
              v-for="(item, index) of childDetail.dealList"
              :key="index"
              :icon="computeIcon({type : '打电话'})"
            >
              <etm-field-label
                type="left"
                label="单号"
              >
                {{ item.orderId }}
              </etm-field-label>
              <!--              <etm-field-label type="left" label="业务类型">{{ item.operator }}</etm-field-label>-->
              <etm-field-label
                type="left"
                label="客户名称"
              >
                {{ item.customerName }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="签单时间"
              >
                {{ item.createLocalDate | parseTime('{y}-{m}-{d}') }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="签单金额"
              >
                {{ item.amount }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="备注"
              >
                {{ item.remarks }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="附件"
              >
                <div>
                  <etm-text
                    v-for="(i, key) of item.annex"
                    :key="key"
                    @click="download(i.url)"
                  >
                    {{ i.name }}
                  </etm-text>
                </div>
              </etm-field-label>
            </el-timeline-item>
            <etm-empty v-if="childDetail.dealList.length === 0" />
          </template>
          <template v-else-if="currentTab === 'message'">
            <el-timeline-item
              v-for="(item, index) of childDetail.messageList"
              :key="index"
              :icon="computeIcon({type : '发短信'})"
            >
              <div class="title-box">
                <span class="title">发短信</span>
                <span class="time">{{ item.sendTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </div>
              <etm-field-label
                type="left"
                label="短信内容"
              >
                {{ item.followContent }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="操作人"
              >
                {{ item.sender }}
              </etm-field-label>
            </el-timeline-item>
            <etm-empty v-if="childDetail.messageList.length === 0" />
          </template>
          <template v-else-if="currentTab === 'follow'">
            <el-timeline-item
              v-for="(item, index) of childDetail.followList"
              :key="index"
              icon="iconfont iconxiegenjin"
            >
              <div class="title-box">
                <span class="title">写跟进</span>
                <span class="time">{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </div>
              <etm-field-label
                type="left"
                label="跟进内容"
              >
                {{ item.followContent }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="跟进方式"
              >
                {{ item.followWay }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="跟进时间"
              >
                {{
                  item.followTime | parseTime('{y}-{m}-{d} {h}:{i}')
                }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="下次跟进时间"
              >
                {{
                  item.nextFollowTime | parseTime('{y}-{m}-{d} {h}:{i}')
                }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="操作人"
              >
                {{ item.operator }}
              </etm-field-label>
              <div class="imgs-box">
                <!--<img v-for="(img) of item.imageList" :key="img.url + '_'" :src="img.url" :alt="img.url">-->

                <el-image
                  v-for="(img) of item.followImg"
                  :key="img.url"
                  style="width: 100px;"
                  :src="img.url"
                  :preview-src-list="[img.url]"
                />
              </div>
            </el-timeline-item>
            <etm-empty v-if="childDetail.followList.length === 0" />
          </template>
        </el-timeline>
      </div>
    </etm-tabs>

    <send-message
      ref="sendMessage"
      :send-message="sendMessage"
    />
    <!--    <resolve-visit ref="resolveVisit" :follow-id="followId" @update="updateVisit" />-->
  </div>
</template>

<script>

// import resolveVisit from '@/views/newDaycare/childManage/myChild/components/resolveVisit'
import baseMixin from '@/layout/mixin/baseMixin'
import UploadImg from '@/components/EtmUploadImg/index'
import SendMessage from '@/views/listCustomer/myCustomer/components/sendMessage'
import {
  queryCallLog,
  queryMessageLog,
  queryFollowLog,
  queryDealLog,
  createFollowSave,
  queryFollowTemplate,
  querySettingType,
  queryCustomerDetail,
  createCall,
  queryFollowCustomFields,
  queryFollowRule,
  queryChildLogsByPanelType,
  queryVisit
} from '@/api/customer'
import { deepClone } from '../../common'

export default {
  name: 'ChildFollowPanel',
  components: { SendMessage, UploadImg },
  filters: {},
  mixins: [baseMixin],
  props: {
    childId: {
      type: [String, Number],
      default: '',
      required: true
    },
    isFollow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showCall: false,
      followRuleDay: false,
      followId: 0,
      followCustomFields: [],
      detailMap: {},
      currentTab: 'follow',
      isCommentFollow: false,
      handleType: '',
      visitType: {
        VISIT: '到访',
        AUDITION: '试听'
      },
      visitStuts: {
        TO_BE_VISITED: '待到访',
        VISIT: '已到访',
        NOT_VISIT: '待到访',
        CANCEL_VISIT: '取消'
      },
      settingType: {
        FOLLOW_WAY: [], // 标签
        SALES_STAGE: [], // 联系人称呼
        IMPORTANT_LEVEL: [], // 重要程度
        MARK: [] // 客户状态
      },
      // allUser: [],
      childDetail: {
        all: [],
        followList: [],
        taskList: [],
        visit: [],
        callList: [],
        messageList: [],
        dealList: []
      },
      followData: {
        customFields: [],
        customerId: null,
        nextFollowTime: null,
        followContent: '',
        followImg: [],
        customerImportantLevel: null,
        customerMark: null,
        bookExperienceTime: null,
        customerSalesStage: null,
        followWay: null,
        previewSrcLists: [],
        previewSrcKey: []

      },
      followTypeList: [],
      childStatusList: [],
      childImportanceList: [],
      childTemplateList: [],
      originTemplateList: [],
      childInfo: {},
      childInfoDetail: {},
      showPop: false,
      showPop2: false,
      target: null,
      target2: null,
      sendMessage: {
        phone: '',
        childId: this.childId
      }
    }
  },
  computed: {
    phoneLits () {
      const result = deepClone(this.childInfoDetail.contacts || [])
      if (this.childInfoDetail.telephone) {
        result.push({
          contactName: this.childInfoDetail.name,
          contactRelationship: '本人',
          contactTelephone: this.childInfoDetail.telephone
        })
      }

      return result
    }
  },
  watch: {
    childId: {
      handler (n) {
        if (n) {
          this.$nextTick(() => {
            this.init()
          })
        }
      },
      immediate: true
    },
    isFollow: {
      handler (n) {
        this.isCommentFollow = n
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    computeIcon (item) {
      const arr = ['iconfont',
        item.type === '打电话' ? 'icondadianhua' : '',
        item.type === '发短信' ? 'iconfaduanxin' : '',
        item.type === '任务' ? 'iconrenwu' : '',
        item.type === '跟进' ? 'iconxiegenjin' : '',
        item.type === '到访' ? 'iconyuyuedaofang' : '',
        item.type === '试听' ? 'iconyuyuedaofang' : ''
      ]
      return arr.join(' ')
    },
    followRule (e) {
      const choiceTime = new Date(e).getTime()
      const lastTime = new Date().getTime() + (this.followRuleDay || 0) * 24 * 3600 * 1000
      if (this.followRuleDay !== false && lastTime < choiceTime) {
        this.$message.warning(`下次跟进时间不能大于${this.followRuleDay}天`)
        this.followData.nextFollowTime = null
      }
    },
    init () {
      if (!this.childId) {
        return false
      }

      queryCustomerDetail(this.childId).then(res => {
        this.childInfoDetail = res.data
        if (res.data.lastFollowTime) {
          queryFollowRule().then(v => {
            this.followRuleDay = v.data[0].value
          })
        } else {
          this.followRuleDay = false
        }
      })

      queryFollowCustomFields().then(res => {
        const result = []
        const detailMap = {}
        res.data.forEach(cur => {
          if (cur.visible) {
            cur.dictTypeId = cur.id
            cur.value = null

            result.push(cur)
          }

          detailMap[cur.key] = cur
        })

        this.followData.customFields = result
        this.detailMap = detailMap
      })

      this.followData.customerId = this.childId
      this.getSettingType()
      /* 通话记录 */
      queryCallLog({ customerId: this.childId, pageSize: 999999 }).then(res => {
        this.childDetail.callList = res.data.content
      })

      /* 短信记录 */
      queryMessageLog({ customerId: this.childId, pageSize: 999999 }).then(res => {
        this.childDetail.messageList = res.data.content
      })

      /* 跟进记录 */
      queryFollowLog({
        customerId: this.childId,
        pageSize: 999999
      }).then(res => {
        this.childDetail.followList = res.data.content
      })

      /* 选择模板 */
      queryFollowTemplate({ pageSize: 99999 }).then(res => {
        this.childTemplateList = res.data.content
      })

      queryDealLog(this.childId).then(res => {
        this.childDetail.dealList = res.data
      })
    },
    getSettingType () {
      const allSetting = Object.keys(this.settingType).map(cur => {
        return new Promise(resolve => {
          querySettingType(cur).then(res => {
            resolve({ name: cur, list: res.data.options || [] })
          })
        })
      })

      Promise.all(allSetting).then(res => {
        res.forEach(cur => {
          this.settingType[cur.name] = cur.list
        })
      })
    },
    updateVisit () {
      queryVisit(this.childId).then(res => {
        this.childDetail.visit = res.data
      })
      queryChildLogsByPanelType({ childId: this.childId, type: null }).then(res => {
        this.childDetail.all = res.data
      })
      this.$emit('update', {})
    },
    visitTrigger (id) {
      this.followId = id
      this.$refs.resolveVisit.show()
    },
    handleTemplateChange () {
      if (this.followData.templateId) {
        const find = this.childTemplateList.find(item => item.id === this.followData.templateId)
        this.followData.followContent = find.content
      }
    },
    commentFollow (type, event) {
      const phone = []
      const parentName = []
      let result = []
      switch (type) {
        case 'FOLLOW_UP':
          this.isCommentFollow = !this.isCommentFollow
          break
        case 'PHONE': {
          result = deepClone(this.childInfoDetail.contacts || [])
          if (this.childInfoDetail.telephone) {
            result.push({
              contactName: this.childInfoDetail.name,
              contactRelationship: '本人',
              contactTelephone: this.childInfoDetail.telephone
            })
          }
          if (result.length > 1) {
            // this.target = event
            this.showCall = true
          } else {
            this.callPhone(result[0].contactTelephone, `${result[0].contactName}(${result[0].contactRelationship})`)
          }
          break
        }
        case 'SEND_MESSAGE':
          // console.log(this.childInfoDetail)
          // if (this.childInfoDetail.relationshipList.length > 1) {
          //   this.target2 = event
          // } else {
          //   this.target2 = event
          //   this.showPop2 = true
          // }
          result = deepClone(this.childInfoDetail.contacts || [])
          if (this.childInfoDetail.telephone) {
            result.push({
              contactName: this.childInfoDetail.name,
              contactRelationship: '本人',
              contactTelephone: this.childInfoDetail.telephone
            })
          }

          result.forEach(cur => {
            phone.push(cur.contactTelephone)
            parentName.push(`${cur.contactName} (${cur.contactRelationship})`)
          })

          this.sendMessage.phone = phone
          this.sendMessage.parentName = parentName
          this.sendMessage.childId = this.childId
          this.$refs.sendMessage.handleVisible(true)
          break
      }
    },
    handleSendMessage (phone) {
      this.sendMessage.phone = phone
      this.target2 = null
      this.$refs.sendMessage.handleVisible(true)
    },
    callPhone (telephone, name) {
      this.$etmTip.init({
        type: 'warn',
        title: `确定要拨打给 <span class="mainColor" style="font-size: 16px;">${name} ${telephone}</span> 吗？`,
        content: '系统将在您确认拨打电话后自动为您拨号，请留意接听您的手机。',
        confirmBtn: '拨打',
        cancelBtn: '取消',
        confirm: () => {
          createCall({ customerId: this.childId, phone: telephone }).then(res => {
            this.$message.success('操作成功')
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    // 获取图片
    getImgList (val, key) {
      this.followData.previewSrcLists = val
      this.followData.previewSrcKey = key
    },
    download (url) {
      const link = document.createElement('a')
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    cancel () {
      this.isCommentFollow = false
      this.followData.followContent = ''
      this.followData.nextFollowTime = ''
      this.followData.meansId = ''
      this.followData.templateId = null
      this.followData.previewSrcKey = []
      this.followData.previewSrcLists = []
      this.$emit('cancel')
    },
    save () {
      return new Promise((resolve, reject) => {
        if (!this.followData.followContent) {
          reject(new Error('请填写跟进内容'))
          return this.$message.warning('请填写跟进内容')
        }
        //  const { meansId, courseManagementMap, visitTime, childImportance, childStatus, content, nextFollowTime, followTime, previewSrcKey } = this.followData
        //   const imageList = previewSrcKey.map(item => {
        //     return {
        //       name: 'image',
        //       url: item
        //     }
        //   })

        // let _courseManagementMap = courseManagementMap
        // console.log('courseManagementMap', courseManagementMap)

        // if (!courseManagementMap['TEACH'].length && !courseManagementMap['CARE'].length) {
        //   _courseManagementMap = null
        // }

        const imageList = this.followData.previewSrcKey.map(item => {
          return {
            name: 'image',
            url: item
          }
        })

        this.followData.followImg = imageList

        const custom = this.followData.customFields.map(cur => {
          return {
            key: cur.key,
            dictTypeId: cur.dictTypeId,
            value: cur.value
          }
        })

        const params = Object.assign({}, this.followData, { customFields: custom })

        createFollowSave(params).then(res => {
          this.$message.success({ message: '操作成功', duration: 1000, showClose: true })
          this.cancel()
          this.init()
          this.$emit('update', {})
          resolve()
        })
      })
    },
    next () {
      this.save().then(res => {
        this.$emit('next', this.childId)
        this.$emit('update', {})
      })
    },
    playAudio (url, event) {
      const audio = new Audio(url)
      audio.play()
      let targetText = ''
      audio.onplay = function (e) {
        targetText = event.target.innerText
        event.target.innerText = '播放中...'
      }
      audio.onpause = function (e) {
        event.target.innerText = targetText
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.childFollowPanel-wrap {
  ::v-deep {
    .el-date-editor, .el-select {
      width: 100%;
    }
  }

  .button-group {
    .el-button + .el-button {
      margin-left: 8px;
    }
  }

  .btn-box {
    padding-bottom: 16px;

    .el-button {
      margin-right: 8px;
      margin-left: 0;
    }
  }
  .follow-box{
    padding-top: 16px;
    border-top: 1px solid $color-divide;
    .btn-box{
      text-align: right;
      .el-button{
        margin: 0 0 0 8px;
      }
    }
  }

  .timeline {
    ::v-deep {
      .el-timeline-item {
        min-height: 120px;
        padding-bottom: 1px;

        .iconxiegenjin, .iconxueyuanguanli, .icondadianhua, .iconfaduanxin, .iconrenwu, .iconyuyuedaofang {
          font-size: 26px;
        }

        .iconxiegenjin {
          color: #ffaf5f;
        }

        .iconyuyuedaofang {
          color: #ffaf5f;
        }

        .iconxueyuanguanli {
          color: #fba047;
        }

        .icondadianhua {
          color: #629fff;
        }

        .iconfaduanxin {
          color: #69d88e;
        }

        .iconrenwu {
          color: #ff7e7e;
        }

        .el-timeline-item__node--normal {
          left: 0;
          width: 30px;
          height: 30px;
        }

        .el-timeline-item__tail {
          position: absolute;
          left: 14px;
          height: 100%;
          border-left: 1px solid #e4e7ed;

        }

        .el-timeline-item__node {
          /*background-color: #E2EEFF;*/
          background-color: $white;

        }

        .el-timeline-item__wrapper {
          padding-top: 8px;

          .el-timeline-item__content {
            padding-left: 16px;
          }
        }
      }

      .EtmFieldLabel-wrap {
        &:not(:last-child) {
          margin-bottom: 0;
        }
      }
    }

    .title-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 16px;

      .title {
        font-size: 16px;
        color: $color-title;

        span {
          display: inline-block;
          padding: 0 6px;
          font-size: 12px;
          margin-left: 8px;
          border-radius: 4px;

          &.NOT_VISIT {
            border: 1px solid #F52E2E;
            color: #F52E2E;
          }

          &.VISIT {
            border: 1px solid #FFAC4E;
            color: #FFAC4E;
          }

          &.TO_BE_VISITED {
            border: 1px solid #1990FF;
            color: #1990FF;
          }

          &.CANCEL_VISIT{
            border: 1px solid #ccc;
            color: #ccc;
          }
        }
      }

      //div.time{
      //  text-align: right;
      //}

      .time {
        color: $color-info;
        text-align: right;

        span {
          display: block;
        }
      }
    }

    .imgs-box {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 16px;

      img {
        width: 48px;
        margin-right: 8px;
      }
    }
  }

}

.callLi {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  i {
    font-size: 12px;
  }

  div {
    span {
      color: #999;
    }
  }
}

</style>
