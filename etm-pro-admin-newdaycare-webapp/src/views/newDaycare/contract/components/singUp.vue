<template>
  <div class="chargeDetailEdit-wrap">
    <etm-pop
      title="签约"
      class="etmPop"
      :visible="isShow"
      cancel-btn="取消"
      pop="big"
      @cancel="cancel"
      @close="cancel"
      @confirm="createSignUp"
    >
      <div v-if="isShow">
        <etm-form
          ref="form1"
          type="dialog"
          :model="form"
        >
          <el-form-item
            label="合同单号"
            prop="contractNo"
            :rules="formValidate.nullValueRule(true,'请输入合同单号')"
          >
            <el-input v-model="form.contractNo" />
          </el-form-item>
          <el-form-item
            label="学员姓名"
            prop="type"
          >
            {{ form.childName }}
          </el-form-item>
          <el-form-item
            v-if="prop.signUpType === 'EARNEST'"
            label="业务类型"
            prop="type"
          >
            托育
          </el-form-item>

          <el-form-item
            label="合同类型"
            prop="contractType"
            :rules="formValidate.nullValueRule(true,'请选择合同类型')"
          >
            <el-radio
              v-model="form.contractType"
              label="NEW_SIGNING"
            >
              新签约
            </el-radio>
            <el-radio
              v-model="form.contractType"
              label="RENEWAL"
            >
              续约
            </el-radio>
          </el-form-item>
          <!--          TODO: 隐藏收款功能-->
          <!--          <el-form-item-->
          <!--            v-if="prop.new === 'n'"-->
          <!--            prop="push"-->
          <!--            :rules="formValidate.nullValueRule(true,'')"-->
          <!--          >-->
          <!--            <div-->
          <!--              slot="label"-->
          <!--              class="diyLabel"-->
          <!--              style="display: inline-flex;"-->
          <!--            >-->
          <!--              <el-tooltip-->
          <!--                effect="light"-->
          <!--                popper-class="stepTips"-->
          <!--                :visible-arrow="false"-->
          <!--                placement="bottom-start"-->
          <!--              >-->
          <!--                <span style="vertical-align: middle;">-->
          <!--                  推送给家长-->
          <!--                  <i-->
          <!--                    class="iconfont iconquestion-circle"-->
          <!--                    style="transform: translate(0, -1px);"-->
          <!--                  />-->
          <!--                </span>-->
          <!--                <div slot="content">-->
          <!--                  <img src="../../../../assets/images/guardcare/bg.png">-->
          <!--                </div>-->
          <!--              </el-tooltip>-->
          <!--              &lt;!&ndash;              <el-tooltip&ndash;&gt;-->
          <!--              &lt;!&ndash;                popper-class="stepTips"&ndash;&gt;-->
          <!--              &lt;!&ndash;                placement="right"&ndash;&gt;-->
          <!--              &lt;!&ndash;              >&ndash;&gt;-->
          <!--              &lt;!&ndash;                <i class="iconfont iconquestion-circle" />&ndash;&gt;-->
          <!--              &lt;!&ndash;                <div&ndash;&gt;-->
          <!--              &lt;!&ndash;                  slot="content"&ndash;&gt;-->
          <!--              &lt;!&ndash;                >&ndash;&gt;-->
          <!--              &lt;!&ndash;                  入托当日即开始计算考勤，<br>&ndash;&gt;-->
          <!--              &lt;!&ndash;                  请如实填写，有了考勤记录<br>&ndash;&gt;-->
          <!--              &lt;!&ndash;                  后不能修改。&ndash;&gt;-->
          <!--              &lt;!&ndash;                </div>&ndash;&gt;-->
          <!--              &lt;!&ndash;              </el-tooltip>&ndash;&gt;-->
          <!--            </div>-->
          <!--            <el-radio-->
          <!--              v-model="form.push"-->
          <!--              :label="true"-->
          <!--            >-->
          <!--              是-->
          <!--            </el-radio>-->
          <!--            <el-radio-->
          <!--              v-model="form.push"-->
          <!--              :label="false"-->
          <!--            >-->
          <!--              否-->
          <!--            </el-radio>-->
          <!--          </el-form-item>-->
        </etm-form>

        <div class="itemTable">
          <etm-title>收费项目</etm-title>
          <div class="buttonBox">
            <el-button
              type="dashed"
              @click="selectEvent(form.type === 'EARNEST' ? 'nurseSetMeal' : 'earlySetMeal', '套餐')"
            >
              选择套餐
            </el-button>
            <el-button
              v-if="prop.signUpType !== 'EARNEST'"
              type="dashed"
              @click="selectEvent(form.type === 'EARNEST' ? 'nurseType' : 'earlyType', '课程类型')"
            >
              选择课程类型
            </el-button>
            <el-button
              v-if="prop.signUpType !== 'EARNEST'"
              type="dashed"
              @click="selectEvent(form.type === 'EARNEST' ? 'nurseCourse' : 'earlyCourse', '课程')"
            >
              选择课程
            </el-button>

            <el-button
              type="dashed"
              @click="selectEvent(prop.signUpType !== 'EARNEST' ? 'fee' : 'feeCare', '费用')"
            >
              选择费用
            </el-button>
            <el-button
              type="dashed"
              @click="selectEvent('item', '物品')"
            >
              选择物品
            </el-button>
          </div>

          <!--    嵌套模板组件-->

          <nesting-table
            v-model="templateData"
            :show-img="true"
            @del="deleteTel"
          />
        </div>

        <div>
          <etm-title>支付信息</etm-title>
          <el-row>
            <el-col :span="24">
              <etm-form
                ref="form2"
                type="dialog"
                :model="form"
              >
                <el-form-item label="使用订金">
                  <el-select
                    v-model="form.earnestMoneyId"
                    @change="userDJ"
                  >
                    <el-option
                      v-for="(item, index) in moneyLists"
                      :key="index"
                      :label="item"
                      :value="index"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="应收总计">
                  {{ form.receivable }}
                </el-form-item>
                <el-form-item label="实收总计">
                  {{ form.paid }}
                </el-form-item>
                <el-form-item
                  prop="paymentId"
                  label="支付方式"
                  :rules="formValidate.nullValueRule(true,'请选择支付方式')"
                >
                  <el-select v-model="form.paymentId">
                    <el-option
                      v-for="(item, index) in payType"
                      :key="index"
                      :label="item.financePayTypeName"
                      :value="item.financePayTypeId"
                    />
                  </el-select>
                </el-form-item>
              </etm-form>
            </el-col>
          </el-row>
        </div>

        <div>
          <etm-title>其他信息</etm-title>
          <el-row>
            <el-col :span="24">
              <etm-form
                ref="form3"
                type="dialog"
                :model="form"
              >
                <el-form-item label="签约日期">
                  <el-date-picker
                    v-model="form.date"
                    type="date"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item
                  v-if="prop.signUpType === 'EARNEST'"
                  label="入托日期"
                  prop="timeRange"
                  :rules="{
                    required: true, message: '请选择入托日期', trigger: ['change','blur']
                  }"
                >
                  <el-date-picker
                    v-model="form.timeRange[0]"
                    type="date"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item
                  v-if="prop.signUpType === 'EARNEST'"
                  required
                  label="合同时长"
                >
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        prop="duration_month"
                        required
                        :rules="{
                          required: true, message: '请填写时长', trigger: ['change','blur']
                        }"
                      >
                        <el-input
                          v-model="form.duration_month"
                          maxlength="3"
                          @input="calcInt($event, 'duration_month')"
                        >
                          <template slot="append">
                            个月
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col
                      :span="8"
                      :offset="1"
                    >
                      <el-form-item
                        prop="duration_day"
                        required
                        :rules="{
                          required: true, message: '请填写时长', trigger: ['change','blur']
                        }"
                      >
                        <el-input
                          v-model="form.duration_day"
                          maxlength="3"
                          @input="calcInt($event, 'duration_day')"
                        >
                          <template slot="append">
                            天
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item v-if="prop.signUpType === 'EARNEST'">
                  <div
                    slot="label"
                    class="diyLabel"
                  >
                    合同顺延时长
                    <el-tooltip
                      popper-class="stepTips"
                      placement="right"
                    >
                      <div slot="content">
                        由请假等因素延长合同的有效期
                      </div>
                      <i class="iconfont iconquestion-circle" />
                    </el-tooltip>
                  </div>
                  <el-row>
                    <el-col :span="17">
                      <el-input
                        v-model="form.extensionDay"
                        maxlength="3"
                        @input="calcInt($event, 'extensionDay')"
                      >
                        <template slot="append">
                          天
                        </template>
                      </el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item v-if="prop.signUpType === 'EARNEST'">
                  <div
                    slot="label"
                    class="diyLabel"
                  >
                    有效期
                    <el-tooltip
                      popper-class="stepTips"
                      placement="right"
                    >
                      <div slot="content">
                        有效期开始日期与入托日期同步<br>结束日期=开始日期+合同时长+合同顺延时长
                      </div>
                      <i class="iconfont iconquestion-circle" />
                    </el-tooltip>
                  </div>
                  {{ effective }}
                </el-form-item>
                <el-form-item
                  v-if="prop.signUpType === 'CARE'"
                  label="有效期"
                  prop="timeRange"
                  :rules="formValidate.nullValueRule(true, '请选择有效期')"
                >
                  <el-date-picker
                    v-model="form.timeRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="年/月"
                    end-placeholder="年/月"
                  />
                </el-form-item>

                <el-form-item
                  label="业绩人及占比"
                  prop="mainPerformanceId"
                  :rules="formValidate.nullValueRule(true,'请选择业绩人及占比')"
                >
                  <el-row class="proportion">
                    <el-col :span="16">
                      <el-select
                        v-model="form.mainPerformanceId"
                        style="width: 100%;"
                      >
                        <el-option
                          v-for="(item, index) in allUser"
                          :key="index"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-col>
                    <el-col
                      :span="7"
                    >
                      <el-input
                        v-model="form.mainPercentage"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        @blur="calcPercentage($event, 'mainPercentage')"
                      />
                    </el-col>
                    <el-col :span="1">
                      &emsp;%
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="次业绩人及占比"
                  prop="secondaryPerformanceId"
                >
                  <el-row class="proportion">
                    <el-col :span="16">
                      <el-select
                        v-model="form.secondaryPerformanceId"
                        style="width: 100%;"
                      >
                        <el-option
                          v-for="(item, index) in allUser"
                          :key="index"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-col>
                    <el-col
                      :span="7"
                    >
                      <el-input
                        v-model="form.secondaryPercentage"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        @blur="calcPercentage($event, 'secondaryPercentage')"
                      />
                    </el-col>
                    <el-col :span="1">
                      &emsp;%
                    </el-col>
                  </el-row>
                </el-form-item>

                <el-form-item label="资料文件">
                  <el-upload
                    class="upload-demo"
                    drag
                    :file-list="form.extraAddressArray"
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
                  <p class="file-tip">
                    只能上传JPG/PNG/PDF/DOC/DOCX/XLS/XLSX文件
                  </p>
                </el-form-item>

                <el-form-item label="备注">
                  <el-input
                    v-model="form.remake"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入备注内容"
                  />
                </el-form-item>
              </etm-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </etm-pop>

    <etm-pop
      :visible="showPop"
      :title="_popName"
      cancle-btn="取消"
      pop="complex"
      @cancel="popCancel"
      @close="popCancel"
      @confirm="popConfirm"
    >
      <component
        :is="popType[popCurType]"
        v-if="popCurType"
        ref="pop"
      />
    </etm-pop>

    <collection
      ref="collection"
      :props="collectionParams"
    />
    <!--    TODO: 隐藏收款功能，开发上一迭代-->
    <etm-pop
      :visible="printPop"
      title=" "
      :show-confirm-btn="false"
      :show-cancel-btn="false"
      @close="printClose"
    >
      <div class="printPop">
        <p>签约成功</p>
        <el-button
          type="primary"
          @click="printMyContract"
        >
          打印合同
        </el-button>
      </div>
    </etm-pop>
  </div>
</template>

<script>
/**
 * chargeDetailEdit create by Administrator
 * createTime 2020/9/9 20:10
 */
import { getEmployee } from '@/views/newDaycare/contract/common'
import NestingTable from './nestingTable3'
import Collection from '../components/collection'
import {
  createEarlyContract,
  createNurseContract,
  queryMoneyLists,
  checkCareRepeatTime,
  queryPayType
} from '@/api/newDaycare/contract'
// import Moment from 'moment'
import Dayjs from 'dayjs'

import formValidate from '@/utils/rules'
import { createBatchNumber } from '@/utils/base'
import { queryEmployeeSelectAll } from '@/api/employee'
import { parseTime } from '@/utils'
import { uploadFile } from '@/api/base'
import { choiceClassMixin } from '@/views/newDaycare/contract/mixins/choiceClassMixin'
import { deepCopy } from '@/utils/common'
import { Loading } from 'element-ui-etm'
import { print } from '@/components/print/print'
// import { removeSubOrganization } from '@/api/base/org'
let uploadLoading = ''
export default {
  name: 'ChargeDetailEdit',
  components: {
    NestingTable,
    Collection
  },
  filters: {},
  mixins: [choiceClassMixin],
  props: {
    prop: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      collectionParams: {},
      printPop: false,
      formValidate,
      typeOnce: false,
      isShow: false,
      moneyLists: {},
      form: {
        contractNo: '',
        extraAddressArray: [],
        push: false,
        type: '',
        childName: '',
        timeRange: [],
        childId: '',
        extensionDay: 0,
        contractType: '',
        receivable: 0,
        paid: 0,
        paymentId: '',
        date: new Date(),
        validBeginTime: '',
        validEndTime: '',
        mainPerformanceId: '',
        mainPercentage: 100,
        secondaryPerformanceId: '',
        secondaryPercentage: 0,
        remake: '',
        earnestMoneyId: null,
        duration_day: 0,
        duration_month: 0
      },
      tableData: [],
      payType: [],
      allUser: [],
      showPop: false,
      templateData: [],
      careEnumType: {
        TEACH: '早教',
        CARE: '托育'
      },
      contractType: {
        NEW_SIGNING: '新签约',
        TRANSFER_COURSE: '转课',
        RENEWAL: '续约'
      }
    }
  },
  computed: {
    _popName () {
      const _type = this.form.type === 'CARE' ? '早教' : '托育'
      let _result = '添加'

      if (this.typeName !== '费用' && this.typeName !== '物品') {
        _result += _type
      }
      _result += this.typeName
      return _result
    },
    effective () {
      const startTime = parseTime(this.form.timeRange[0], '{y}-{m}-{d}')
      let endTime = ''

      if (this.form.duration_month || this.form.duration_day) {
        endTime = Dayjs(startTime).add(this.form.duration_month || 0, 'M')
          .add((this.form.duration_day || 0) - 1, 'd')
          .format('YYYY-MM-DD')
      }

      if (this.form.extensionDay) {
        if (!endTime) {
          endTime = startTime
        }
        endTime = Dayjs(endTime).add(this.form.extensionDay, 'd').format('YYYY-MM-DD')
      }

      return `${startTime} - ${endTime}`
    }
  },
  watch: {
    prop: {
      immediate: true,
      deep: true,
      handler (n) {
        console.log(n)
        if (Object.keys(n).length) {
          this.init(n)
        }
      }
    },
    templateData: {
      deep: true,
      handler (n) {
        let netReceiptsNotes = 0 // 应收
        let receivableNotes = 0 // 实收

        n.forEach(cur => {
          netReceiptsNotes += parseFloat(cur.netReceiptsNotes) || 0
          receivableNotes += parseFloat(cur.receivableNotes) || 0
        })

        this.form.paid = (netReceiptsNotes - (this.moneyLists[this.form.earnestMoneyId] || 0)).toFixed(2)
        this.form.receivable = receivableNotes.toFixed(2)
      }
    }
  },
  created () {
    queryPayType().then(res => {
      this.payType = res.data
    })

    queryEmployeeSelectAll().then(res => {
      this.allUser = res.data
    })
  },

  mounted () {
  },
  methods: {
    fileChange (file) {
      const total = 1024 * 1024 * 10
      const files = deepCopy(this.form.extraAddressArray)
      if (file.size > total) {
        this.form.file = null
        setTimeout(() => {
          this.form.extraAddressArray = files
        }, 0)
        return this.$message.error('文件大小不能超过10M')
      }

      if (!this.checkFile(file)) {
        this.form.file = null

        setTimeout(() => {
          this.form.extraAddressArray = files
        }, 0)
        return this.$message.error('请上传JPG/PNG/PDF/DOC/DOCX/XLS/XLSX文件')
      }
      this.form.extraAddressArray.push(file)
    },
    checkFile (file) {
      const typeList = ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'xls', 'xlsx']
      return typeList.includes(file.name.split('.')[1])
    },
    fileRemove (file, fileList) {
      this.form.extraAddressArray.forEach((item, index) => {
        if (item.name === file.name) {
          this.form.extraAddressArray.splice(index, 1)
        }
      })
    },
    handleFile (e) {
      if (e.target.className === 'el-upload-list__item-name' && e.target.tagName === 'A') {
        const file = this.form.extraAddressArray.find(item => item.name === e.target.innerText)
        let getUrl = ''
        if (window.createObjectURL !== undefined) { // basic
          getUrl = window.createObjectURL(file.raw)
        } else if (window.URL !== undefined) { // mozilla(firefox)
          getUrl = window.URL.createObjectURL(file.raw)
        } else if (window.webkitURL !== undefined) { // webkit or chrome
          getUrl = window.webkitURL.createObjectURL(file.raw)
        }
        open(getUrl)
      }
    },
    calcInt (event, key) {
      if (/^0/.test(event)) {
        this.form[key] = 0
      } else {
        this.form[key] = event.replace(/[^\d]/g, '')
      }
    },
    userDJ () {
      if (this.templateData.length) {
        this.form.paid = (this.form.paid - (this.moneyLists[this.form.earnestMoneyId] || 0)).toFixed(2)
      }
    },
    calcPercentage (event, name) {
      const _name = name === 'secondaryPercentage' ? 'mainPercentage' : 'secondaryPercentage'

      if (event.target.value > 100) {
        this.form[name] = 100
      } else if (!event.target.value) {
        this.form[name] = 0
      }

      this.form[_name] = 100 - this.form[name]
    },
    selectDiy () {
      if (!this.form.type) {
        this.$message({
          message: '请选择业务类型',
          type: 'warning'
        })
        return true
      }
    },
    popCancel () {
      this.showPop = false
    },
    popConfirmHandle (data) {
      this.templateData = this.templateData.concat(data)
    },
    init (prop) {
      this.form.childId = prop.id
      this.form.childName = prop.name
      this.form.contractType = prop.type === 'UNSOLD' ? 'NEW_SIGNING' : 'RENEWAL'
      this.form.contractNo = createBatchNumber()
      this.form.type = prop.signUpType

      if (prop.signUpType === 'EARNEST') {
        this.form.timeRange = [new Date()]
      }

      this.form.mainPerformanceId = getEmployee().employeeId
      queryMoneyLists({
        childId: this.prop.id,
        teachOrCareEnum: this.prop.signUpType === 'CARE' ? 'TEACH' : 'CARE'
      }).then(res => {
        const _result = {}
        res.data.forEach(cur => {
          _result[cur.id] = cur.money
        })
        this.moneyLists = _result
      })
    },
    printClose () {
      this.successContractId = null
      this.printPop = false
    },
    printMyContract () {
      this.printPop = false
      this.printContract(this.successContractId)
    },
    printContract (id) {
      const link = this.$router.resolve({
        path: '/print',
        query: {
          type: this.prop.signUpType === 'EARNEST' ? 'care' : 'teach',
          props: { prop: { id } }
        }
      })
      print(link)
    },
    createSignUp () {
      const today = new Date()
      today.setHours(0, 0, 0)

      if ((this.form.secondaryPerformanceId === this.form.mainPerformanceId) && (this.form.secondaryPerformanceId && this.form.secondaryPerformanceId)) {
        this.$message({ message: '业绩人和次业绩人不能重复', type: 'warning' })
        return
      }

      if (this.form.duration_month === 0 && this.form.duration_day === 0 && this.prop.signUpType === 'EARNEST') {
        this.$message.warning('有效期不能为0天')
        return
      }

      if (!this.templateData.length) {
        this.$message.warning('请选择收费项目')
        return
      }

      Promise.all([
        this.$refs.form1.$children[0].validate(),
        this.$refs.form2.$children[0].validate(),
        this.$refs.form3.$children[0].validate()
      ]).then(async res => {
        let endTime
        if (this.prop.signUpType === 'EARNEST') {
          const startTime = parseTime(this.form.timeRange[0], '{y}-{m}-{d}')
          endTime = Dayjs(startTime)
            .add(this.form.duration_month || 0, 'M')
            .add((this.form.duration_day || 0) - 1, 'd')
            .add((this.form.extensionDay || 0), 'd')
            .valueOf()
        } else {
          endTime = this.form.timeRange[1].getTime()
        }

        if (endTime < (today.getTime() - 1000)) {
          this.$etmTip.init({
            type: 'warn',
            title: '提示',
            content: '当前合同有效期已过，该合同将视为过期合同，是否确认保存合同？',
            confirmBtn: '确定',
            cancelBtn: '取消',
            confirm: () => {
              this.singup()
              this.$etmTip.close()
            },
            cancel: () => {
              this.$etmTip.close()
            }
          })
          this.$etmTip.open()
        } else {
          this.checkRepeat().then(res => {
            this.singup()
          }).catch(() => {})
        }
      })
    },
    checkRepeat () {
      return new Promise((resolve, reject) => {
        if (this.form.type !== 'EARNEST') {
          resolve()
          return
        }
        // const api = this.form.type === 'EARNEST' ? checkCareRepeatTime : checkTcRepeatTime
        const startDate = parseTime(this.form.timeRange[0], '{y}-{m}-{d}')
        const endDate = Dayjs(startDate)
          .add(this.form.duration_month || 0, 'M')
          .add((this.form.duration_day || 0) - 1, 'd')
          .add((this.form.extensionDay || 0), 'd')
          .format('YYYY-MM-DD')

        checkCareRepeatTime({
          childId: this.form.childId,
          startDate,
          endDate
        }).then(res => {
          if (res.data) {
            this.$etmTip.init({
              type: 'warn',
              title: '提示',
              content: '存在与该合同时间段重叠的合同，是否确认保存合同？',
              confirmBtn: '确定',
              cancelBtn: '取消',
              confirm: () => {
                resolve()
                this.$etmTip.close()
              },
              cancel: () => {
                reject(new Error('取消合同保存'))
                this.$etmTip.close()
              }
            })
            this.$etmTip.open()
          } else {
            resolve()
          }
        })
      })
    },
    async singup () {
      let _result = ''

      uploadLoading = Loading.service({
        fullscreen: true,
        lock: true,
        customClass: 'etm-loading',
        // text: '数据加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,.1)'
      })

      if (this.prop.signUpType === 'EARNEST') {
        const startTime = parseTime(this.form.timeRange[0], '{y}-{m}-{d}')
        const endTime = Dayjs(startTime)
          .add(this.form.duration_month || 0, 'M')
          .add((this.form.duration_day || 0) - 1, 'd')
          .add((this.form.extensionDay || 0), 'd')
          .format('YYYY-MM-DD')

        this.form.validBeginTime = startTime
        this.form.dateOfAdmission = startTime
        this.form.validEndTime = endTime
      } else {
        this.form.validBeginTime = parseTime(this.form.timeRange[0], '{y}-{m}-{d}')
        this.form.validEndTime = parseTime(this.form.timeRange[1], '{y}-{m}-{d}')
      }

      this.form.date = parseTime(this.form.date, '{y}-{m}-{d}')
      this.form.listPurchaseItemsDTO = this.templateData

      const annex = []
      const fileUpload = this.form.extraAddressArray.map(cur => {
        // console.log(cur)
        return new Promise(resolve => {
          uploadFile(cur, '/newdaycare/listChild/childManage', 'file', 'QINIU_NOT_CALLBACK', {}, { noLoadding: true }).then(res => {
            resolve({ ...res.data, name: cur.name })
          })
        })
      })

      await Promise.all(fileUpload).then(files => {
        files.forEach(cur => {
          annex.push({
            name: cur.name,
            url: cur.key
          })
        })
      })
      this.form.annex = annex

      switch (this.form.type) {
        case 'EARNEST':
          _result = createNurseContract(this.form)
          break
        case 'CARE':
          _result = createEarlyContract(this.form)
          break
      }

      _result.then(res => {
        this.$emit('update', {})
        this.isShow = false
        this.form = {
          contractNo: '',
          type: '',
          childName: '',
          timeRange: [],
          childId: '',
          contractType: '',
          push: false,
          extensionDay: 0,
          receivable: 0,
          paid: 0,
          paymentId: '',
          date: new Date(),
          validBeginTime: '',
          validEndTime: '',
          mainPerformanceId: '',
          mainPercentage: 100,
          secondaryPerformanceId: '',
          secondaryPercentage: 0,
          remake: '',
          earnestMoneyId: null,
          duration_day: 0,
          annex: [],
          extraAddressArray: [],
          duration_month: 0
        }

        // TODO: 隐藏收款功能
        this.$message('合同创建成功')
        this.successContractId = res.data.cacContractId || res.data.id
        this.printPop = true
        // this.collectionParams = {
        //   type: this.prop.signUpType === 'EARNEST' ? 'CARE_ORDER' : 'TEACH_ORDER',
        //   id: res.data.cacContractId || res.data.id,
        //   money: res.data.paid || 0
        // }
        // this.$refs.collection.show()

        uploadLoading.close()
        this.reset()
      }).catch(res => {
        uploadLoading.close()
      })
    },
    cancel () {
      this.reset()
      this.isShow = false
    },
    typeChange (event) {
      if (!this.typeOnce) {
        this.typeOnce = true
        return
      }

      if (this.templateData.length) {
        this.$etmTip.init({
          type: 'warn',
          title: '确定切换业务类型？',
          content: '会清空当前添加的项目',
          confirmBtn: '确定',
          cancelBtn: '取消',
          cancel: () => {
            this.form.type = event === 'EARNEST' ? 'CARE' : 'EARNEST'
            this.form.receivableNotes = 0
            this.form.netReceiptsNotes = 0
            this.$etmTip.close()
          },
          confirm: () => {
            this.templateData = []
            this.cacheTemplate = {
              SET_MEAL: [],
              COURSE_TYPE: [],
              RURRICULUM: [],
              GOODS: [],
              COST: []
            }
            this.$etmTip.close()
          }
        })
        this.$etmTip.open()
      }
    },
    show () {
      this.isShow = true
    },
    deleteTel (cur) {
      let _index = 0
      const cacSetMealEnum = cur.cacSetMealEnum === 'CAE_COURSE' ? 'RURRICULUM' : cur.cacSetMealEnum
      switch (cacSetMealEnum) {
        case 'COST' :
        case 'GOODS' :
        case 'RURRICULUM' :
        case 'COURSE_TYPE' :

          _index = this.cacheTemplate[cacSetMealEnum].indexOf(cur.id)
          this.cacheTemplate[cacSetMealEnum].splice(_index, 1)

          break
        case 'SET_MEAL' :

          _index = this.cacheTemplate.SET_MEAL.indexOf(cur.id)
          _index = this.cacheTemplate.SET_MEAL.indexOf(cur.id)
          this.cacheTemplate[cacSetMealEnum].splice(_index, 1)

          cur.childList.forEach(c => {
            const _t = c.cacSetMealEnum === 'CAE_COURSE' ? 'RURRICULUM' : (c.cacSetMealEnum === 'PRICE' ? 'COST' : c.cacSetMealEnum)
            const _i = this.cacheTemplate[_t].indexOf(c.id)
            this.cacheTemplate[_t].splice(_i, 1)
          })

          break
      }
    },
    reset () {
      this.$refs.form1.$children[0].resetFields()
      this.$refs.form2.$children[0].resetFields()
      this.$refs.form3.$children[0].resetFields()

      this.typeOnce = false
      this.templateData = []
      this.cacheTemplate = {
        SET_MEAL: [],
        COURSE_TYPE: [],
        RURRICULUM: [],
        GOODS: [],
        COST: []
      }

      this.form = {
        contractNo: '',
        type: '',
        childName: '',
        timeRange: [],
        childId: '',
        contractType: '',
        receivable: 0,
        push: false,
        paid: 0,
        paymentId: '',
        date: new Date(),
        extensionDay: 0,
        validBeginTime: '',
        validEndTime: '',
        mainPerformanceId: '',
        mainPercentage: 100,
        secondaryPerformanceId: '',
        secondaryPercentage: 0,
        remake: '',
        earnestMoneyId: null,
        annex: [],
        extraAddressArray: [],
        duration_day: 0,
        duration_month: 0
      }
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

  .printPop {
    text-align: center;

    p {
      margin-bottom: 16px;
    }
  }

  .proportion {
    .el-col-16 {
      margin-right: 8px;
      width: calc(66.66667% - 8px);
    }

    .el-col-7 {
      margin-right: 8px;
      width: calc(29.16667% - 8px);
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

.buttonBox {
  margin-bottom: 16px;

  .el-button + .el-button {
    margin-left: 8px;
  }
}

</style>
