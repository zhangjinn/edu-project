<template>
  <div class="etm-address">
    <el-select
      v-model="province"
      :disabled="disabled"
      placeholder="请选择省份"
      @change="provinceChange"
    >
      <el-option
        v-for="(item, index) of provinces"
        :key="index"
        v-bind="{...item}"
      />
    </el-select>
    <template v-if="showCity">
      <el-select
        v-model="city"
        :disabled="disabled"
        placeholder="请选择城市"
        @change="cityChange"
      >
        <el-option
          v-for="(item, index) of citys"
          :key="index"
          v-bind="{...item}"
        />
      </el-select>
    </template>
    <template v-if="showArea">
      <el-select
        v-model="area"
        :disabled="disabled"
        placeholder="请选择地区"
        @change="areaChange"
      >
        <el-option
          v-for="(item, index) of areas"
          :key="index"
          v-bind="{...item}"
        />
      </el-select>
    </template>
  </div>
</template>
<script>
import { queryAreaInfoByAreaId, queryAreaListByCode } from '@/api/base/base'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'EtmAddress',
  mixins: [baseMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    areaId: {
      type: [String, Number],
      default () {
        return ''
      }
    },
    cityId: {
      type: [Number, String],
      default () {
        return ''
      }
    },
    provinceId: {
      type: [Number, String],
      default () {
        return ''
      }
    },
    showCity: {
      type: Boolean,
      default: true
    },
    showArea: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      province: '',
      provinces: '',
      city: '',
      citys: '',
      area: '',
      areas: ''
    }
  },

  watch: {
    areaId (val, oldVal) {
      if (!oldVal) {
        this.province = ''
        this.city = ''
        this.area = ''
        val && this.reverseInit(val)
      }
    },
    cityId (val, oldVal) {
      if (!oldVal) {
        this.province = ''
        this.city = ''
        this.area = ''
        val && this.reverseInit(val)
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      queryAreaListByCode({}).then(res => {
        this.provinces = this.convertDataToOptions(res.data, 'name', 'code')
      })
      this.provinces = []
    },
    /**
     * 通过地区ID反查省市区
     * @param areaId
     */
    reverseInit (areaId) {
      queryAreaInfoByAreaId({ areaId }).then(res => {
        const { provinceCode, cityCode, countyCode } = res.data
        this.province = provinceCode
        this.city = cityCode
        this.area = countyCode
        queryAreaListByCode({ code: provinceCode }).then(res => {
          this.citys = this.convertDataToOptions(res.data, 'name', 'code')
        })
        queryAreaListByCode({ code: cityCode }).then(res => {
          this.areas = this.convertDataToOptions(res.data, 'name', 'code')
        })
      })
    },
    provinceChange () {
      this.city = ''
      this.area = ''
      this.$emit('provinceChange', this.province)
      queryAreaListByCode({ code: this.province }).then(res => {
        this.citys = this.convertDataToOptions(res.data, 'name', 'code')
      })
    },
    cityChange () {
      this.area = ''
      this.$emit('cityChange', this.city)
      queryAreaListByCode({ code: this.city }).then(res => {
        this.areas = this.convertDataToOptions(res.data, 'name', 'code')
      })
    },
    areaChange () {
      this.$emit('areaChange', this.area)
      this.$emit('input', this.area)
      this.$emit('change', { province: this.province, city: this.city, area: this.area })
    },
    resetData () {
      this.province = ''
      this.city = ''
      this.area = ''
      this.citys = ''
      this.areas = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.etm-address {
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;

  ::v-deep {
    > * {
      flex: 1;
    }

    .el-select {
      margin: 0 5px;
    }

    .el-select:first-child {
      margin-left: 0;
    }

    .el-select:last-child {
      margin-right: 0;
    }
  }
}
</style>
