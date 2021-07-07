<template>
  <div class="detail">
    <ul>
      <li>
        <etm-field-label label="学员姓名" type="left">
          {{ item.childName }}
        </etm-field-label>
        <etm-field-label label="联系人姓名" type="left">
          {{ item.personName }}
        </etm-field-label>
        <etm-field-label label="关系" type="left">
          {{ item.relationshipName }}
        </etm-field-label>
        <etm-field-label label="联系人电话" type="left">
          {{ item.parentPhone }}
        </etm-field-label>
        <etm-field-label label="到期日期" type="left">
          {{ item.expireDate | filter }}
        </etm-field-label>
      </li>
    </ul>
  </div>
</template>

<script>

import { queryCamertOrder } from '@/api/newDaycare/monitorEquipment'
import { parseTime } from '@/utils'

export default {
  name: 'CloudCameraServiceDetail',
  filters: {
    filter(v) {
      if (v) {
        return parseTime(v).substr(0, 10)
      } else return ''
    }
  },
  props: {
    childId: {
      type: Number,
      default: null
    },
    parentPhone: {
      type: String,
      default: null
    },
    parentId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      item: {
        childName: '',
        personName: '',
        relationshipName: '',
        parentPhone: '',
        expireDate: ''
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      const childId = this.childId
      const parentId = this.parentId
      queryCamertOrder({ childId, parentId }).then((res) => {
        const { data } = res
        this.item = {
          childName: data.childName,
          personName: data.personName,
          relationshipName: data.relationshipName,
          parentPhone: data.parentPhone,
          expireDate: data.expireDate
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
