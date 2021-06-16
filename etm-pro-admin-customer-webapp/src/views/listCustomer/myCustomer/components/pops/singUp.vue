<template>
  <div class="chargeDetailEdit-wrap">
    <etm-pop
      title="签单"
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
            label="单号"
            prop="orderNo"
            :rules="formValidate.nullValueRule(true,'请输入单号')"
          >
            <el-input v-model="form.orderNo" />
          </el-form-item>
          <el-form-item
            label="客户姓名"
            prop="type"
          >
            {{ prop.name }}
          </el-form-item>
          <el-form-item
            label="签单时间"
            prop="type"
          >
            {{ new Date() | parseTime }}
          </el-form-item>
          <el-form-item
            label="签单金额"
            prop="type"
          >
            {{ form.amount }}
          </el-form-item>
        </etm-form>
        <div class="itemTable">
          <etm-title>签单产品</etm-title>
          <div class="buttonBox">
            <el-button
              type="dashed"
              @click="selectEvent()"
            >
              选择产品
            </el-button>
          </div>
          <!--    嵌套模板组件-->
          <nesting-table
            v-model="templateData"
            :show-img="true"
            @del="deleteTel"
          />

          <etm-form
            ref="form2"
            type="dialog"
            :model="form"
          >
            <el-form-item
              label="备注"
              prop="remarks"
            >
              <el-input
                v-model="form.remarks"
                type="textarea"
                :rows="4"
              />
            </el-form-item>

            <el-form-item
              label="附件"
              prop="type"
            >
              <el-upload
                class="upload-demo"
                drag
                :file-list="form.annex"
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
          </etm-form>
        </div>
      </div>
    </etm-pop>

    <etm-pop
      :visible="showPop"
      title="选择产品"
      cancle-btn="取消"
      pop="complex"
      @cancel="popCancel"
      @close="popCancel"
      @confirm="popConfirm"
    >
      <product ref="pop" />
    </etm-pop>
  </div>
</template>

<script>
/**
 * chargeDetailEdit create by Administrator
 * createTime 2020/9/9 20:10
 */
import { createBatchNumber } from '@/utils/base'
import NestingTable from './nestingTable3'
import Product from './product'
import {
  uploadFile
} from '@/api/base'

import formValidate from '@/utils/rules'
import { queryEmployeeSelectAll } from '@/api/employee'
import { parseTime } from '@/utils'
import { choiceClassMixin } from '@/views/listCustomer/myCustomer/components/mixins/choiceClassMixin'
import {
  createCustomerOrder
} from '@/api/customer'
export default {
  name: 'ChargeDetailEdit',
  components: {
    NestingTable,
    Product
  },
  filters: {
    parseTime (n) {
      return parseTime(n, '{y}-{m}-{d}')
    }
  },
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
      currentUpload: null,
      formValidate,
      typeOnce: false,
      isShow: false,
      moneyLists: {},
      form: {
        orderNo: '',
        customerId: '',
        customerName: '',
        amount: 0,
        orderItemList: [],
        remarks: '',
        annex: []
      },
      tableData: [],
      payType: [],
      allUser: [],
      showPop: false,
      templateData: []
    }
  },
  computed: {

  },
  watch: {
    isShow: {
      handler (n) {
        if (!n) {
          this.$refs.form1.$children[0].resetFields()
          this.$refs.form2.$children[0].resetFields()
          this.templateData = []
          this.cacheTemplate = {
            PRODUCT: []
          }
          this.form = {
            orderNo: createBatchNumber(),
            customerId: '',
            customerName: '',
            amount: 0,
            orderItemList: [],
            remarks: '',
            annex: []
          }
        }
      }
    },
    prop: {
      immediate: true,
      deep: true,
      handler (n) {
        if (Object.keys(n).length) {
          this.init(n)
        }
      }
    },
    templateData: {
      deep: true,
      handler (n) {
        let netReceiptsNotes = 0 // 应收
        // let receivableNotes = 0 // 实收

        n.forEach(cur => {
          netReceiptsNotes += parseFloat(cur.netReceiptsNotes)
        })

        this.form.amount = (netReceiptsNotes - (this.moneyLists[this.form.earnestMoneyId] || 0)).toFixed(2)
      }
    }
  },
  created () {
    queryEmployeeSelectAll().then(res => {
      this.allUser = res.data
    })
  },

  mounted () {
  },
  methods: {
    fileChange (file) {
      if (!this.checkFile(file)) {
        this.currentUpload = null
        return this.$message.error('请上传pdf、doc、docx、xls、xlsx、pptx、png、jpg文件')
      }
      this.form.annex.push(file)
    },
    checkFile (file) {
      const typeList = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'pptx', 'png', 'jpeg', 'jpg']
      return typeList.includes(file.name.split('.')[1])
    },
    fileRemove (file, fileList) {
      this.form.annex.forEach((item, index) => {
        if (item.name === file.name) {
          this.form.annex.splice(index, 1)
        }
      })
    },
    handleFile (e) {
      if (e.target.className === 'el-upload-list__item-name' && e.target.tagName === 'A') {
        const file = this.form.annex.find(item => item.name === e.target.innerText)
        open(file.url)
      }
    },

    calcInt (event, key) {
      if (/^0/.test(event)) {
        this.form[key] = 0
      } else {
        this.form[key] = event.replace(/[^\d]/g, '')
      }
    },

    popCancel () {
      this.showPop = false
    },
    popConfirmHandle (data) {
      this.templateData = this.templateData.concat(data)
    },

    init (prop) {
      this.form.customerId = prop.id
      this.form.customerName = prop.name

      this.form.orderNo = createBatchNumber()
      // this.form.mainPerformanceId = getEmployee().employeeId
    },
    createSignUp () {
      if (!this.templateData.length) {
        this.$message.warning('未选择签单的产品')
        return
      }
      Promise.all([
        this.$refs.form1.$children[0].validate(),
        this.$refs.form2.$children[0].validate()
      ]).then(res => {
        const upload = this.form.annex.map(cur => {
          return new Promise(resolve => {
            uploadFile(
              cur,
              'customer/listCustomer/myCustomer',
              'file'
            ).then(res => {
              resolve({ ...res.data, name: cur.name })
            })
          })
        })

        Promise.all(upload).then(res => {
          const imgs = res.map(cur => {
            return {
              name: cur.name,
              url: cur.key
            }
          })
          const result = Object.assign({}, this.form)
          // console.log(this.templateData, 'dfdfdfdfdfddddddd')
          result.orderItemList = this.templateData.map(cur => {
            return {
              productId: cur.id,
              productName: cur.name,
              productCover: cur.img,
              paid: cur.netReceipts,
              receivable: cur.receivable,
              quantity: cur.purchase,
              paidSubtotal: cur.netReceiptsNotes,
              receivableSubtotal: cur.receivableNotes
            }
          })
          result.annex = imgs

          createCustomerOrder(result).then(res => {
            this.$message.success('签单成功')
            this.$emit('success', {})
            this.cancel()
          })
        })
      })
    },
    cancel () {
      this.isShow = false
    },

    show () {
      this.isShow = true
    },

    deleteTel (cur) {
      const index = this.cacheTemplate.PRODUCT.indexOf(cur.id)

      this.cacheTemplate.PRODUCT.splice(index, 1)
    },
    reset () {
      this.$refs.form1.$children[0].resetFields()
      this.$refs.form2.$children[0].resetFields()

      this.typeOnce = false
      this.templateData = []
      this.cacheTemplate = {
        PRODUCT: []
      }

      this.form = {
        orderNo: '',
        customerId: '',
        customerName: '',
        amount: 0,
        orderItemList: [],
        remarks: '',
        annex: []
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.buttonBox {
  margin-bottom: 16px;

  .el-button + .el-button {
    margin-left: 8px;
  }
}

</style>
