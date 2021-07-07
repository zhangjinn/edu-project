<template>
  <div class="detail">
    <ul>
      <li>
        <etm-field-label label="品牌" type="left">
          {{ item.brand | filter }}
        </etm-field-label>
        <etm-field-label label="名称" type="left">
          {{ item.cameraName }}
        </etm-field-label>
        <etm-field-label label="序列号" type="left">
          {{ item.deviceSerial }}
        </etm-field-label>
        <etm-field-label label="验证码" type="left">
          {{ item.validateCode }}
        </etm-field-label>
        <etm-field-label label="位置" type="left">
          {{ item.address }}
        </etm-field-label>
      </li>
    </ul>
  </div>
</template>

<script>

import { queryCamera } from '@/api/newDaycare/monitorEquipment'

export default {
  name: 'CameraManagementDetail',
  filters: {
    filter(v) {
      // todo 暂时写死
      if (v) {
        const item = [{ value: 'EZVIZ', label: '萤石' }].find(j => j.value === v) || {}
        return item.label
      } else return ''
    }
  },
  props: {
    cameraId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      item: {
        cameraName: '',
        cameraId: '',
        deviceSerial: '',
        brand: '',
        validateCode: '',
        address: ''
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      const id = this.cameraId
      queryCamera(id).then((res) => {
        const { data } = res
        this.item = {
          cameraName: data.cameraName,
          cameraId: data.cameraId,
          deviceSerial: data.deviceSerial,
          brand: data.brand,
          validateCode: data.validateCode,
          address: data.address
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.detail {
  ul {
    li {
      margin-bottom: 20px;

      .foodName {
        @include etm-color();
        font-size: 18px;
      }

      .el-divider--horizontal {
        margin: 0 0 14px;
      }

      // todo 改为image
      .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 100px;
        margin: 0;
      }

      .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
      }

      .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
      }

      // todo
    }
  }

}
</style>
