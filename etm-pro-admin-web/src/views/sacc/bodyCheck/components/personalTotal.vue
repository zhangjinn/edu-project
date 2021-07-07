<template>
  <div class="personalTotal-wrap">
    <etm-table-page
      ref="etmTable"
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    >
      <el-table-column slot="right" label="晨午检状态">
        <template v-slot="{row}">
          <etm-status v-if="!row.abnormal" type="active">正常</etm-status>
          <etm-status v-else type="danger">异常</etm-status>
          <!--<etm-text v-if="!row.abnormal">正常</etm-text>-->
          <!--<etm-text v-else type="danger">异常</etm-text>-->
        </template>
      </el-table-column>
      <el-table-column slot="right" label="建议离园">
        <template v-slot="{row}">
          <etm-text v-if="row.adviseLeave" type="danger">是</etm-text>
          <etm-text v-else>否</etm-text>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="操作">
        <template v-slot="{row}">
          <etm-text type="primary" @click="detail(row)">详情</etm-text>
        </template>
      </el-table-column>

    </etm-table-page>

    <etm-side :visible.sync="visible" :title="propDetail.customerName + '检查记录'" class="side" @close="close">
      <status-item :data="propDetail" :prop="propData" />
      <div v-for="(item,index) of propDetail.images" :key="index" class="img-box">
        <div class="title"> {{ item.customerCheckDetailName }}</div>
        <div class="content">
          <div class="status">
            <etm-text v-if="!item.abnormal">正常</etm-text>
            <etm-text v-else type="danger">异常</etm-text>
            <div v-if="item.detail" class="desc">
              {{ item.detail }}
            </div>
          </div>
          <el-image
            v-if="item.image"
            style="width: 80px;min-height: 100px;max-height: 90vh;"
            :src="item.image"
            fit="cover"
            :preview-src-list="propDetail.images.map(item => item.image)"
          />
        </div>
      </div>
    </etm-side>

  </div>
</template>

<script>/**
 *  2020/4/21 9:31
 *  haijinsha
 */

import baseMixin from '@/layout/mixin/baseMixin'
import { queryBodyCheckPersonalListPage, queryPersonalDetailByCustomerId } from '@/api/bodyCheck'
import EtmSide from '@/layout/main/EtmSide/src/EtmSide'
import StatusItem from '@/views/sacc/attendance/components/statusItem'
import { getEnumValueByKey } from '@/enums'
import { parseTime } from '@/utils'

export default {
  name: 'PersonalTotal',
  components: { StatusItem, EtmSide },
  filters: {},
  mixins: [baseMixin],
  props: {
    showTool: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      showImage: false,
      propDetail: '',
      propData: [
        {
          title: '检测类型',
          prop: 'checkType'
        },
        {
          title: '检测日期',
          prop: 'date'
        },
        {
          title: '所在班级',
          prop: 'clazzName'
        }
      ],
      // 个人检测记录
      formData: [
        {
          label: '会员姓名',
          type: 'input',
          prop: 'customerName',
          value: '',
          props: {
            placeholder: '请输入会员姓名'
          }
        },
        {
          label: '班级',
          type: 'select',
          prop: 'clazzId',
          value: '',
          props: {
            placeholder: '请选择班级'
          },
          options: [
            {
              label: '苹果班',
              value: '1'
            },
            {
              label: '樱桃班',
              value: '2'
            }
          ]
        },
        {
          label: '检测日期',
          type: 'date',
          prop: 'date',
          value: '',
          props: {
            type: 'daterange',
            rangeSeparator: '-',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            clearable: false
          }
        }
      ],
      tableData: {},
      columns: [
        {
          label: '会员姓名',
          prop: 'customerName'
        }, {
          label: '班级名称',
          prop: 'clazzName'
        },
        {
          label: '检测类型',
          prop: 'checkType'
        },
        {
          label: '检测日期',
          prop: 'date'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getObjectByProp('date').value = [parseTime(Date.now(), '{y}-{m}-{d}'), parseTime(Date.now(), '{y}-{m}-{d}')]
    this.init()
  },
  methods: {
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    init() {
      queryBodyCheckPersonalListPage({
        customerName: this.getValueByProp('customerName'),
        clazzId: this.getValueByProp('clazzId'),
        startDate: this.getValueByProp('date')[0],
        endDate: this.getValueByProp('date')[1],
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.tableData = res.data
        this.tableData.content.forEach(item => {
          item.checkType = getEnumValueByKey(item.checkType)
          item.date = parseTime(item.date, '{y}-{m}-{d}')
        })
      })
    },
    // 晨午检
    bodyCheckHandleSearch(e) {
      this.init()
    },
    bodyCheckReset() {
      this.formData[0].value = ''
      this.formData[1].value = ''
    },
    detail(row) {
      console.log(row)
      this.propDetail = row
      queryPersonalDetailByCustomerId({ customerCheckId: row.customerCheckId }).then(res => {
        console.log(res)
        this.visible = true
        this.propDetail.images = res.data
      })
    },
    close() {
      this.visible = false
    },
    handleImage() {
      this.showImage = true
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
  .personalTotal-wrap {

  }
</style>

<style lang="scss">
  .el-drawer__wrapper {
    .img-box {
      padding: 10px 24px 0 24px;
      display: flex;
      align-items: flex-start;
      min-height: 40px;
      /*margin-bottom: 24px;*/

      .title {
        min-width: 58px;
        white-space: nowrap;
        text-align-last: justify;
        margin-right: 12px;
        font-size: 14px;
        color: $secondary-color;
      }

      .content {
        color: $title-color;
        overflow: auto;
        flex: 1;

        .status {
          margin-bottom: 10px;
        }

        .desc {
          color: #555;
          background-color: #f4f4f4;
          margin: 12px 0;
          font-size: 14px;
          padding: 8px;
        }

        img {
          /*width: 100%;*/
        }
      }
    }
  }
</style>
