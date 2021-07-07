<template>
  <div class="index-wrap">
    <etm-tabs v-model="activeName" @toggle="toggle">
      <el-tab-pane :label="$t('memberManage.tabsTitleArrive')" name="IN">
        <etm-tool-bar v-show="show" v-model="informData" @search="onSubmit" @reset="reset" />
      </el-tab-pane>
      <el-tab-pane :label="$t('memberManage.tabsTitleLeave')" name="OUT">
        <etm-tool-bar v-show="show" v-model="outformData" @search="onSubmit" @reset="reset" />
      </el-tab-pane>
    </etm-tabs>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
export default {
  mixins: [baseMixin],
  data() {
    const _this = this
    return {
      activeName: this.$store.state.memberManageV2.gardenState,
      show: true,
      informData: [
        {
          label: _this.$t('memberManage.queryLabelCustomerName'),
          type: 'input',
          prop: 'customerName',
          value: '',
          props: {
            placeholder: _this.$t('memberManage.queryCustomerNamePlaceHolderText')
          }
        },
        {
          label: _this.$t('memberManage.queryLabelContactName'),
          type: 'input',
          prop: 'contactName',
          value: '',
          props: {
            placeholder: _this.$t('memberManage.queryContactNamePlaceHolderText')
          }
        },
        {
          label: _this.$t('memberManage.queryLabelContactPhone'),
          type: 'input',
          prop: 'contactPhone',
          value: '',
          props: {
            placeholder: _this.$t('memberManage.queryContactPhonePlaceHolderText')
          }
        },
        {
          label: _this.$t('memberManage.queryLabelDate'),
          type: 'date',
          prop: 'date',
          value: null,
          props: {
            'type': 'daterange',
            'clearable': false,
            'range-separator': '-',
            'value-format': 'yyyy-MM-dd',
            'start-placeholder': _this.$t('memberManage.dateStartPlaceHolderText'),
            'end-placeholder': _this.$t('memberManage.dateEndPlaceHolderText')
          }
        }
      ],
      outformData: [
        {
          label: _this.$t('memberManage.queryLabelCustomerName'),
          type: 'input',
          prop: 'customerName',
          value: '',
          props: {
            placeholder: _this.$t('memberManage.queryCustomerNamePlaceHolderText')
          }
        },
        {
          label: _this.$t('memberManage.queryLabelLeave'),
          type: 'date',
          prop: 'date',
          value: null,
          props: {
            'type': 'daterange',
            'clearable': false,
            'range-separator': '-',
            'value-format': 'yyyy-MM-dd',
            'start-placeholder': _this.$t('memberManage.dateStartPlaceHolderText'),
            'end-placeholder': _this.$t('memberManage.dateEndPlaceHolderText')
          }
        }
      ]
    }
  },
  watch: {
    activeName(val) {
      this.$store.commit('memberManageV2/SET_GARDENSTATE', val)
    }
  },
  methods: {
    toggle(val) {
      this.show = val
    },
    onSubmit() {
      const filter = {}
      let formData
      if (this.activeName === 'IN') {
        formData = this.informData
      }
      if (this.activeName === 'OUT') {
        formData = this.outformData
      }
      this.getValueByProp('customerName', formData).trim() ? filter.customerName = this.getValueByProp('customerName', formData) : ''
      this.getValueByProp('contactName', formData).trim() ? filter.contactName = this.getValueByProp('contactName', formData) : ''
      this.getValueByProp('contactPhone', formData).trim() ? filter.contactPhone = this.getValueByProp('contactPhone', formData) : ''
      if (this.getValueByProp('date', formData)) {
        filter.beginDate = this.getValueByProp('date', formData)[0]
        filter.endDate = this.getValueByProp('date', formData)[1]
      }
      this.$emit('query')
      this.$store.commit('memberManageV2/SET_FILTER', filter)
    },
    reset() {
      let formData
      if (this.activeName === 'IN') {
        formData = this.informData
      }
      if (this.activeName === 'OUT') {
        formData = this.outformData
      }
      this.resetValue(formData)
      this.$emit('query')
      this.$store.commit('memberManageV2/SET_FILTER', null)
    }
  }
}
</script>

<style scoped lang="scss">
.index-wrap {
  & /deep/ .EtmTablePage-wrap {
    padding-bottom: 0;
  }
  & >>> .el-range-editor {
    input:last-of-type {
      margin-left: 16px;
    }
  }
}
</style>
