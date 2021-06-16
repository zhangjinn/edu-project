<template>
  <div class="etm-address">
    <el-select
      v-model="province"
      disabled
      popper-class="ai-popper"
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
      popper-class="ai-popper"
      placeholder="请选择城市"
      @change="cityChange"
    >
      <el-option
        v-for="(item, index) of citys"
        :key="index"
        v-bind="{...item}"
      />
    </el-select>
    <!--    <el-select v-model="area" :disabled="disabled" placeholder="请选择地区" @change="areaChange">-->
    <!--      <el-option v-for="(item, index) of areas" :key="index" v-bind="{...item}" />-->
    <!--    </el-select>-->
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
      provinceName: '',
      provinces: [],
      city: '',
      cityName: '',
      citys: [],
      area: '',
      areas: []
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
  },
  methods: {
    init () {
      queryAreaListByCode({}).then(res => {
        this.provinces = this.convertDataToOptions(res.data, 'name', 'code')
        this.provinces.unshift({
          value: 'ALL',
          label: '全部'
        })
        this.province = this.provinces[0].value
        this.provinceName = this.provinces[0].label

        // 城市默认
        this.citys = [{
          value: 'ALL',
          label: '全部'
        }]
        this.city = this.citys[0].value
        this.cityName = this.citys[0].label
      })
      this.provinces = []
    },
    /**
     * 通过地区ID反查省市区
     * @param areaId
     */
    async reverseInit (areaId) {
      await queryAreaListByCode({}).then(res => {
        this.provinces = this.convertDataToOptions(res.data, 'name', 'code')
        this.provinces.unshift({
          value: 'ALL',
          label: '全部'
        })
      })
      await queryAreaInfoByAreaId({ areaId }).then(res => {
        const { provinceCode, cityCode, countyCode, provinceName, cityName, countyName } = res.data

        this.province = provinceCode
        this.city = cityCode
        this.area = countyCode
        this.provinceName = provinceName
        this.cityName = cityName
        this.countyName = countyName
        // this.$emit('getareaname', {
        //   provinceName: this.provinceName,
        //   cityName: this.cityName,
        //   countyName: this.countyName
        // })
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
      this.cityName = ''
      this.area = ''
      this.areaName = ''
      this.provinceName = this.provinces.find(item => this.province === item.value).label

      const provinceObj = {
        province: this.province,
        provinceName: this.provinceName
      }
      this.$emit('provinceChange', provinceObj, this.provinces)

      if (this.province === 'ALL') {
        this.citys = [{
          value: 'ALL',
          label: '全部'
        }]
        this.city = this.citys[0].value
        this.cityName = this.citys[0].label
        return
      }
      queryAreaListByCode({ code: this.province }).then(res => {
        this.citys = this.convertDataToOptions(res.data, 'name', 'code')
        this.citys.unshift({
          value: 'ALL',
          label: '全部'
        })
        this.city = this.citys[0].value
        this.cityName = this.citys[0].label
      })
    },
    cityChange () {
      this.area = ''
      this.areaName = ''
      this.cityName = this.citys.find(item => this.city === item.value).label

      const cityObj = {
        city: this.city,
        cityName: this.cityName
      }
      this.$emit('cityChange', cityObj, this.citys)
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
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ::v-deep {
    & > * {
      flex: 1;
    }

    .el-select {
      margin: 0 5px;
    }

    .el-select:first-child {
      margin-left: 0;
      .el-input__suffix{
        display: none;
      }
    }

    .el-select:last-child {
      margin-right: 0;
    }
  }
}
</style>
