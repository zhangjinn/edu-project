<template>
  <div class="crash-data-wrap">
    <div class="portrayal-data">
      <div class="ai-crash" />
      <div
        v-for="(value, key, index) in portrayalList"
        :key="index"
        class="data"
      >
        <template v-if="key=== 'remainNum'">
          <div
            class="surplus-portrayal"
            @click.stop="showPayPop = true"
          >
            <div class="top">
              <!--              <div class="tip">-->
              <!--                <div class="hover">-->
              <!--                  只有高度画像才扣可画像数-->
              <!--                </div>-->
              <!--              </div>-->
              <div class="text">
                {{ setText(key) }}
              </div>
              <!--              先隐藏，等做充值弹窗-->
              <span class="pay">+</span>
            </div>
            <div class="digit">
              {{ value }}
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="portrayal"
            @click="toPath(key)"
          >
            <div class="text">
              {{ setText(key) }}
            </div>
            <div class="digit">
              {{ value }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="operate">
      <div
        class="portrayal"
        @click.stop="$router.push({path: 'customer_historyPortrayal'})"
      >
        查看客户群画像
      </div>
      <div
        class="portrayal"
        @click.stop="$router.push({name: 'customer_waitPortrayal'})"
      >
        待画像客户
      </div>
      <div
        class="portrayal"
        @click.stop="exportPortrayal"
      >
        导入待画像客户
      </div>
    </div>
    <!--    导入弹窗-->
    <etm-pop
      pop="complex"
      title="批量导入"
      :visible="showPop"
      :cancel="importCancel"
      @close="importCancel"
      @confirm="importConfirm"
    >
      <template v-if="showPop">
        <etm-form
          ref="etmForm"
          type="dialog"
          :rules="rules"
          :model="formData"
        >
          <el-form-item label="模板">
            <el-button
              type="dashed"
              @click.stop="downloadTemplate"
            >
              下载模板
            </el-button>
          </el-form-item>
          <el-form-item
            label="上传文件"
            prop="file"
          >
            <el-upload
              class="upload-demo"
              drag
              action="#"
              :auto-upload="false"
              :on-change="fileChange"
              :on-remove="fileRemove"
              :limit="1"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
        </etm-form>
      </template>
    </etm-pop>

    <!--    支付弹窗提示-->
    <pay-tip-pop
      :show-pay-pop.sync="showPayPop"
      :point="portrayalList.remainNum"
      @success="$emit('success')"
    />
  </div>
</template>

<script>

/**
   * index create by 油麦菜
   * createTime 2021/1/29 16:15
   */
import { exportTemplate, downloadTemplate } from '@/api/aiCrash'
import baseMixin from '@/layout/mixin/baseMixin'
import { downloadFileForUrl } from '@/utils/file'
import { Loading } from 'element-ui'
import payTipPop from '@/views/aiCrash/crashPortrayal/components/payTipPop'

export default {
  name: 'Index',
  components: {
    payTipPop
  },
  filters: {},
  mixins: [baseMixin],
  props: {
    disable: {
      type: Boolean,
      default: false
    },
    portrayalList: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showPayPop: false,
      showPop: false,
      checkList: [],
      flag: false,
      formData: {
        file: null
      },
      rules: {
      }
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    setText (key) {
      switch (key) {
        case 'remainNum':
          return '可用碰客点数'
        case 'unPortrayedTotal':
          return '待画像客户数'
        case 'portrayedTotal':
          return '已画像客户数'
        case 'highItemTotal':
          return '高度画像'
        case 'middleItemTotal':
          return '中度画像'
        case 'lowItemTotal':
          return '低度画像'
      }
    },
    exportPortrayal () {
      if (!this.disable) {
        this.showPop = true
      }
    },
    importCancel () {
      this.showPop = false
      this.formData.file = null
    },
    importConfirm () {
      if (!this.formData.file) {
        return this.$message.info('请上传文件模板')
      }
      const loading = Loading.service({
        fullscreen: true,
        lock: true,
        customClass: 'etm-loading',
        // text: '数据加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,.1)'
      })
      if (this.flag) {
        return this.$message.info('请等待上传完成')
      }
      this.flag = true
      if (!this.formData.file) {
        return false
      }
      exportTemplate({ file: this.formData.file.raw }).then(res => {
        this.importCancel()
        loading.close()
        this.$etmTip.init({
          type: 'success',
          title: '导入客户画像完成',
          content: `成功导入${res.data.successItemTotal}条数据`,
          confirmBtn: '确定',
          cancel: () => {
            this.$etmTip.close()
          },
          confirm: () => {
            this.$etmTip.close()
            this.$emit('exportSuccess')
          }
        })
        this.$message.success('导入成功')
        this.$etmTip.open()
        this.flag = false
      }).catch(res => {
        loading.close()
        this.flag = false
      })
    },
    fileChange (file) {
      if (!this.checkFile(file)) {
        this.formData.file = null
        return this.$message.error('请上传xlsx,xls,csv文件')
      }
      this.formData.file = file
    },
    checkFile (file) {
      const typeList = ['xlsx', 'xlsm', 'xls', 'csv']
      return typeList.includes(file.name.split('.')[1])
    },
    fileRemove () {
      this.formData.file = null
    },
    downloadTemplate () {
      downloadTemplate({ template: 'UN_PORTRAYED_CUSTOMER' }).then(res => {
        downloadFileForUrl(res)
      })
    },
    toPath (key) {
      console.log(key)
      if (key === 'unPortrayedTotal') {
        this.$router.push({ name: 'customer_waitPortrayal' })
      } else if (key === 'portrayedTotal') {
        this.$router.push({ path: 'customer_historyPortrayal' })
      }
    },
    payPop () {
      this.$etmTip.init({
        type: 'warn',
        title: '提示',
        content: '请前往中台进行充值',
        confirmBtn: '确定',
        cancelBtn: '',
        confirm: () => {
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>
<style lang="scss" scoped>
  .crash-data-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 85px;
    /*transform: translateY(20px);*/
    .portrayal-data {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex: .6;
      transform: translateY(20px);
      .ai-crash {
        width: 110px;
        height: 34px;
        background: url('../../../../assets/images/AICrash.png') no-repeat;
        background-size: 100% 100%;
      }
      .data {
        margin-left: 8px;
        color: #ffffff;
        flex: .27;
        /*flex: .2;*/
        cursor: pointer;
        [class$=portrayal] {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .text {
            font-size: 16px;
            font-weight: 400;
            color: #FFFFFF;
          }
          .digit {
            font-size: 24px;
            font-weight: 700;
            color: #FFBE31;
          }
        }
        .surplus-portrayal {
          position: relative;
          /*width: 242px;*/
          height: 92px;
          background: url("../../../../assets/images/can-portrayal.png") no-repeat;
          background-size: 100% 100%;
          .top {
            display: flex;
            justify-content: center;
            align-items: center;
            .tip {
              position: relative;
              padding: 0;
              width: 14px;
              height: 14px;
              border: none!important;
              background: url("../../../../assets/images/tip.png") no-repeat;
              background-size: 100% 100%;
              &:hover {
                .hover {
                  display: block;
                }
              }
              .hover {
                display: none;
                position: absolute;
                top: -38px;
                left: -33px;
                width: 200px;
                color: #ffd67e;
                text-align: center;
                padding: 5px 0;
                border-radius: 5px;
                background: rgba(0,0,0,0.6);
                &:after {
                  display: block;
                  position: absolute;
                  bottom: -12px;
                  left: 35px;
                  content: '';
                  width: 0;
                  height: 0;
                  border: 6px solid;
                  border-color: rgba(0,0,0,0.6) transparent transparent;
                }
              }
            }
            .text {
              padding: 0 5px;
            }
            .pay {
              display: none;
              width: 22px;
              height: 14px;
              line-height: 9px;
              color: #7e693c;
              font-size: 20px;
              font-weight: 700;
              text-align: center;
              background: #FFC548;
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
        .portrayal {
          /*width: 155px;*/
          height: 89px;
          background: url("../../../../assets/images/can-portrayal.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .data:first-child {
        /*flex: .2;*/
      }
    }
    .operate {
      display: flex;
      flex: 0.383;
      justify-content: space-between;
      .portrayal {
        flex: .32;
        /*width: 165px;*/
        height: 48px;
        text-align: center;
        line-height: 48px;
        font-size: 16px;
        font-weight: 700;
        color: #FFFFFF;
        background: url("../../../../assets/images/crash-operate.png") no-repeat;
        background-size: 100% 100%;
        &:hover {
          cursor: pointer;
          background: url("../../../../assets/images/hover-crash-operate.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }

</style>
