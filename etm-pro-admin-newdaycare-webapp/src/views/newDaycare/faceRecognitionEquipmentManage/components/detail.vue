<template>
  <div class="detail-wrap">
    <div class="detail-tip">
      <el-tag>人脸识别机序列号SN码在机身背面位置</el-tag>
    </div>
    <div class="detail-conent">
      <etm-field-label
        type="left"
        label="品牌"
      >
        {{ brandList[detailDeviceInfo.brand] }}
      </etm-field-label>
      <etm-field-label
        type="left"
        label="型号"
      >
        <img
          v-if="detailDeviceInfo.model === 'M355C1'"
          src="@/assets/images/system1.png"
        >
        <img
          v-if="detailDeviceInfo.model === 'M35DM1'"
          src="@/assets/images/system2.png"
        >
      </etm-field-label>
      <etm-field-label
        type="left"
        label="体温检测功能"
      >
        {{ detailDeviceInfo.temperatureDetection === 0 ? '有' : '无' }}
      </etm-field-label>
      <etm-field-label
        type="left"
        label="名称"
      >
        {{ detailDeviceInfo.deviceName }}
      </etm-field-label>
      <etm-field-label
        type="left"
        label="序列号"
      >
        {{ detailDeviceInfo.deviceKey }}
      </etm-field-label>
      <etm-field-label
        type="left"
        label="设备位置"
      >
        {{ detailDeviceInfo.position }}
      </etm-field-label>
    </div>
  </div>
</template>

<script>
/**
 * detail create by Administrator
 * createTime 2021/3/9 13:49
 */
export default {
  name: 'Detail',
  components: {},
  filters: {},
  mixins: [],
  props: {
    detailDeviceInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      brandList: {
        UNI_UBI: '宇泛'
      }
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
    init () {
    }
  }
}
</script>
<style lang="scss" scoped>
  .detail-conent {
    margin-top: 30px;
  }
</style>
