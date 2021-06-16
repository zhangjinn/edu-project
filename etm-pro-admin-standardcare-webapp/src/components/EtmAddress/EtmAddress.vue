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
  </div>
</template>
<script>
import { queryAreaInfoByAreaId, queryAreaListByCode } from '@/api/base/area'
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
      type: Array,
      default () {
        return []
      }
    },
    provinceId: {
      type: Array,
      default () {
        return []
      }
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
    areaId: {
      handler (areaId) {
        this.province = ''
        this.city = ''
        this.area = ''
        areaId && this.reverseInit(areaId)
      },
      immediate: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      queryAreaListByCode({}).then(res => {
        console.log(res)
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
        const { provinceCode, cityCode, countyCode, provinceName, cityName, countyName } = res.data

        this.province = provinceCode
        this.city = cityCode
        this.area = countyCode
        this.provinceName = provinceName
        this.cityName = cityName
        this.countyName = countyName
        this.$emit('getareaname', {
          provinceName: this.provinceName,
          cityName: this.cityName,
          countyName: this.countyName
        })
        queryAreaListByCode({ code: res.data.provinceCode }).then(res => {
          this.citys = this.convertDataToOptions(res.data, 'name', 'code')
        })
        queryAreaListByCode({ code: res.data.cityCode }).then(res => {
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
    * {
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
