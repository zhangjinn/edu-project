<template>
  <div class="chargeDetailEdit-wrap">
    <div v-if="!enable">
      <etm-field-label
        label="合同单号"
        type="left"
      >
        {{ form.contractNo }}
      </etm-field-label>
      <etm-field-label
        label="学员姓名"
        type="left"
      >
        {{ form.childName }}
      </etm-field-label>
      <etm-field-label
        label="业务类型"
        type="left"
      >
        早教
      </etm-field-label>
      <etm-field-label
        label="合同类型"
        type="left"
      >
        {{ form.contractType === 'NEW_SIGNING' ? '新签约' : (form.contractType === 'TRANSFER_COURSE' ? '转课' : '续约') }}
      </etm-field-label>
    </div>
    <etm-form
      v-else
      ref="form1"
      type="dialog"
      :model="form"
    >
      <el-form-item
        label="合同单号"
        prop="contractNo"
        :required="true"
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
        label="业务类型"
        prop="type"
      >
        早教
      </el-form-item>

      <el-form-item
        label="合同类型"
        prop="contractType"
        :required="true"
      >
        <template>
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
        </template>
      </el-form-item>
    </etm-form>

    <div class="itemTable">
      <etm-title>收费项目</etm-title>
      <div
        v-if="enable"
        class="buttonBox"
      >
        <el-button
          type="dashed"
          @click="selectEvent('earlySetMeal')"
        >
          <i class="iconfont iconplus" />选择套餐
        </el-button>
        <el-button
          type="dashed"
          @click="selectEvent('earlyType')"
        >
          <i class="iconfont iconplus" />选择课程类型
        </el-button>
        <el-button
          type="dashed"
          @click="selectEvent('earlyCourse')"
        >
          <i class="iconfont iconplus" />选择课程
        </el-button>
        <el-button
          type="dashed"
          @click="selectEvent('item')"
        >
          <i class="iconfont iconplus" />选择物品
        </el-button>
        <el-button
          type="dashed"
          @click="selectEvent('fee')"
        >
          <i class="iconfont iconplus" />选择费用
        </el-button>
      </div>

      <!--    嵌套模板组件-->

      <nesting-table
        v-model="templateData"
        :show-img="true"
        :columns="columns"
        :disable="enable"
        :is-delete="enable"
        @del="nestingDelete"
      />
    </div>

    <div>
      <etm-title>支付信息</etm-title>
      <el-row>
        <el-col :span="24">
          <etm-form
            ref="form2"
            type="dialog"
          >
            <el-form-item label="使用订金">
              <el-select
                v-if="prop.deposit"
                v-model="form.earnestMoneyId"
                @change="changeCharge"
              >
                <el-option
                  v-for="(item, index) in moneyLists"
                  :key="index"
                  :label="item"
                  :value="parseInt(index)"
                />
              </el-select>
              <span v-else>{{ form.earnestMoney || '无' }}</span>
            </el-form-item>

            <el-form-item label="应收总计">
              {{ form.receivable }}
            </el-form-item>
            <el-form-item label="实收总计">
              {{ form.paid }}
            </el-form-item>
            <el-form-item
              label="支付方式"
              :required="true"
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
          >
            <el-form-item label="签约日期">
              <el-date-picker
                v-model="form.date"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="有效期">
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
              :required="true"
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
                  %
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

            <el-form-item
              label="资料文件"
              prop="secondaryPerformanceId"
            >
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
                :maxlength="1000"
                type="textarea"
                :rows="5"
                placeholder="请输入备注内容"
              />
            </el-form-item>
          </etm-form>
        </el-col>
      </el-row>
    </div>

    <etm-pop
      :visible="showPop"
      title="添加托育课程"
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
  </div>
</template>

<script>
/**
 * chargeDetailEdit create by Administrator
 * createTime 2020/9/9 20:10
 */

import NestingTable from '../../components/nestingTable3'

import { deepClone, toFixed } from '@/views/newDaycare/contract/common'

import {
  queryTeachContractDetail,
  queryPayType,
  // queryIsRenewal,
  updateTeachContract, queryMoneyLists
} from '@/api/newDaycare/contract'
import { queryEmployeeSelectAll } from '@/api/employee'

import { choiceClassMixin } from '@/views/newDaycare/contract/mixins/choiceClassMixin'
import { parseTime } from '@/utils'
import { uploadFile } from '@/api/base'
import { deepCopy } from '@/utils/common'
import { Loading } from 'element-ui-etm'
// import Dayjs from 'dayjs'
let uploadLoading

export default {
  name: 'ChargeDetailEdit',
  components: {
    NestingTable
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
      moneyLists: [],
      columns: [
        {
          label: '项目名称',
          width: '26%'
        }, {
          label: '单价',
          width: '20%'
        }, {
          label: '数量',
          width: '24%'
        }, {
          label: '小计',
          width: '21%'
        }
      ],

      form: {
        timeRange: [new Date()],
        annex: [],
        extraAddressArray: []
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
    enable () {
      return !(this.form.contractType === 'TRANSFER_COURSE' ||
        this.form.contractStatusEnum === 'NORMAL' ||
        this.form.contractStatusEnum === 'BE_OVERDUE'
      )
    }
  },
  watch: {
    prop: {
      immediate: true,
      deep: true,
      handler (n) {
        this.init(n)
      }
    },
    templateData: {
      deep: true,
      handler (n) {
        let receivable = 0
        let paid = 0

        n.forEach(cur => {
          receivable += toFixed(cur.receivableNotes)
          paid += toFixed(cur.netReceiptsNotes)
        })

        this.form.receivable = receivable.toFixed(2)
        console.log((paid - (this.form.earnestMoney || 0)).toFixed(2))
        this.form.paid = (paid - (this.form.earnestMoney || 0)).toFixed(2)
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
    // checkRepeat () {
    //   return new Promise((resolve, reject) => {
    //     const api = checkTcRepeatTime
    //     const startDate = parseTime(this.form.timeRange[0], '{y}-{m}-{d}')
    //     const endDate = Dayjs(startDate)
    //       .add(this.form.duration_month || 0, 'M')
    //       .add((this.form.duration_day || 0) - 1, 'd')
    //       .add((this.form.extensionDay || 0), 'd')
    //       .format('YYYY-MM-DD')
    //
    //     api({
    //       childId: this.prop.pid,
    //       startDate,
    //       endDate
    //     }).then(res => {
    //       if (res.data) {
    //         this.$etmTip.init({
    //           type: 'warn',
    //           title: '提示',
    //           content: '存在与该合同时间段重叠的合同，是否确认保存合同？',
    //           confirmBtn: '确定',
    //           cancelBtn: '取消',
    //           confirm: () => {
    //             resolve()
    //             this.$etmTip.close()
    //           },
    //           cancel: () => {
    //             reject(new Error('取消合同保存'))
    //             this.$etmTip.close()
    //           }
    //         })
    //         this.$etmTip.open()
    //       } else {
    //         resolve()
    //       }
    //     })
    //   })
    // },
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
    changeCharge (e) {
      let money = 0
      Object.keys(this.moneyLists).forEach(cur => {
        if (parseInt(cur) === parseInt(e)) {
          money = this.moneyLists[cur]
        }
      })
      this.form.paid = toFixed(this.form.receivable - money).toFixed(2)
    },
    nestingDelete (cur) {
      console.log(cur)
      this.cacheTemplate[cur.cacSetMealEnum].splice(
        this.cacheTemplate[cur.cacSetMealEnum].indexOf(cur.id),
        1
      )

      if (cur.childList && cur.childList.length) {
        cur.childList.forEach(item => {
          this.cacheTemplate[item.cacSetMealEnum].splice(
            this.cacheTemplate[item.cacSetMealEnum].indexOf(item.id),
            1
          )
        })
      }

      console.log(this.cacheTemplate, '---')
    },
    parseInt (str) {
      return parseTime(str)
    },
    calcPercentage (event, name) {
      const _name = name === 'secondaryPercentage' ? 'mainPercentage' : 'secondaryPercentage'

      if (event.target.value > 100) {
        this.form[name] = 100
      }

      this.form[_name] = 100 - this.form[name]
    },
    selectEvent (name) {
      this.popCurType = name
      this.showPop = true

      this.$nextTick(() => {
        this.$refs.pop.getData()
      })
    },
    popCancel () {
      this.showPop = false
    },
    popConfirmHandle (data) {
      this.templateData = this.templateData.concat(data)
    },
    init (prop) {
      queryTeachContractDetail(prop.id).then(res => {
        const { data } = res
        this.form = {
          receivable: data.receivable,
          paid: data.paid,
          paymentId: data.paymentId,
          contractNo: data.contractNo,
          childName: data.childName,
          earnestMoney: data.earnestMoney,
          contractType: data.contractType,
          teachOrCareEnum: data.teachOrCareEnum,
          contractStatusEnum: data.contractStatusEnum,
          date: data.date,
          annex: [],
          extraAddressArray: data.annex || [],
          timeRange: [data.validBeginTime, data.validEndTime],
          mainPerformanceId: data.mainPerformanceId,
          mainPercentage: data.mainPercentage,
          secondaryPerformanceId: data.secondaryPerformanceId,
          secondaryPercentage: data.secondaryPercentage,
          remake: data.remake,
          earnestMoneyId: data.earnestMoneyId,
          earnestMoneyIdCache: data.earnestMoneyId,
          earnestMoneyName: data.earnestMoney
        }

        this.templateData = deepClone(res.data.listPurchaseItemsVo.map(cur => {
          // 写入缓存
          this.cacheTemplate[cur.cacSetMealEnum].push(cur.id)

          // 字段兼容
          if (cur.img && cur.img.length) {
            cur.img = cur.img[0].url
          } else {
            cur.img = ''
          }

          if (cur.childList && cur.childList.length) {
            cur.childList.map(c => {
              this.cacheTemplate[c.cacSetMealEnum].push(c.id)

              if (c.img && c.img.length) {
                c.img = c.img[0].url
              } else {
                c.img = ''
              }
            })
          }
          return cur
        }))

        queryMoneyLists({
          childId: prop.pid,
          earnestMoneyId: data.earnestMoneyId,
          teachOrCareEnum: 'TEACH'
        }).then(res => {
          const _result = {}
          res.data.forEach(cur => {
            _result[cur.id] = cur.money
          })
          this.moneyLists = _result
        })

        // if (this.enable) {
        //   queryIsRenewal(prop.id).then(res => {
        //     // console.log(res)
        //     this.form.contractType = res.data
        //   })
        // }
      })
    },

    save () {
      if (this.form.secondaryPerformanceId === this.form.mainPerformanceId) {
        this.$message({ message: '业绩人和次业绩人不能重复', type: 'warning' })
        return
      }

      if (!this.templateData.length) {
        this.$message.warning('请选择收费项目')
        return new Promise((resolve, reject) => {
          reject(new Error())
        })
      }

      const form = [
        this.$refs.form2.$children[0].validate(),
        this.$refs.form3.$children[0].validate()
      ]

      if (this.$refs.form1) {
        form.push(this.$refs.form1.$children[0].validate())
      }

      this.form.validBeginTime = parseTime(this.form.timeRange[0], '{y}-{m}-{d}')
      this.form.validEndTime = parseTime(this.form.timeRange[1], '{y}-{m}-{d}')
      this.form.listPurchaseItemsDTO = this.templateData.map(cur => {
        cur.lastPurchase = cur.remainingBuyQuantity
        cur.lastGive = cur.remainingGiftQuantity

        if (cur.childList && cur.childList.length) {
          cur.childList = cur.childList.map(c => {
            c.lastPurchase = c.remainingBuyQuantity
            c.lastGive = c.remainingGiftQuantity

            return c
          })
        }

        return cur
      })
      this.form.tcContractId = this.prop.id

      if (!this.form.earnestMoneyId) {
        this.form.earnestMoneyId = null
      }

      return new Promise((resolve, reject) => {
        Promise.all(form).then(async res => {
          // this.checkRepeat().then(async () => {
          uploadLoading = Loading.service({
            fullscreen: true,
            lock: true,
            customClass: 'etm-loading',
            // text: '数据加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0,0,0,.1)'
          })

          const annex = []

          console.log(this.form.extraAddressArray)
          const fileUpload = this.form.extraAddressArray.map(cur => {
            // console.log(cur)
            return new Promise(resolve => {
              uploadFile(cur, '/newdaycare/contract/teachContract', 'file', 'QINIU_NOT_CALLBACK', {}, { noLoadding: true }).then(res => {
                resolve({
                  ...res.data,
                  name: cur.name
                })
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

          updateTeachContract(this.form).then(res => {
            uploadLoading.close()
            resolve()
            this.$message.success('合同更新成功')
          })
        }).catch(() => {
          uploadLoading.close()
          reject(new Error())
        })
        // })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.chargeDetailEdit-wrap {
  ::v-deep {
    .file-tip {
      color: #999;
      font-size: 12px;
      margin-top: 8px;
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

  .buttonBox {
    margin-bottom: 16px;

    .el-button--small + .el-button--small {
      margin-left: 8px;
    }

    .iconplus {
      font-size: 12px;
    }
  }

  .row {
    line-height: 36px;
    margin-bottom: 16px;
  }
}
</style>
