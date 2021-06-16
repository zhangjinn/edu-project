<template>
  <div class="EtmAreaGardenCascader-wrap">
    <!--    非顶级企业使用级联选择时不显示级联选择器，而是显示园所选择器-->
    <el-select
      v-model="organizationValue[0]"
      placeholder="请选择区域"
      @change="select($event, 'area')"
    >
      <el-option
        v-for="(area, index) in areaList"
        :key="index"
        :label="area.label"
        :value="area.value"
      />
    </el-select>
    <el-select
      v-model="organizationValue[1]"
      placeholder="请选择园所"
      @change="select($event, 'organization')"
    >
      <el-option
        v-for="(organization, index) in organizationList"
        :key="index"
        :label="organization.label"
        :value="organization.value"
      />
    </el-select>
  </div>
</template>

<script>/**
 * EtmAreaGardenCascader create by Administrator
 * createTime 2021/1/28 10:52
 */

import { queryAreaOrganizationList } from '@/api/newDaycare/statisticsHead'

export default {
  name: 'EtmAreaGardenCascader',
  components: {},
  filters: {},
  mixins: [],
  props: {
    clear: { // 清空选择或恢复默认值
      type: Boolean,
      default () {
        return false
      }
    },
    hasDefault: { // 是否有默认值，默认值为一个具体的园所，默认为false
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      organizationValue: [],
      areaData: [],
      areaList: [],
      organizationList: []
    }
  },
  computed: {},
  watch: {
    clear () { // 数据重置
      this.organizationValue = []
      if (this.hasDefault) {
        this.organizationList = this.areaList[0].children
        this.organizationValue.push(this.areaList[0].value)
        this.organizationValue.push(this.organizationList[0].value)
        const emitData = {
          value: this.organizationValue,
          type: 'load'
        }
        this.$emit('change', emitData)
      } else {
        this.organizationList = []
        const selectValue = [0]
        const arr = []
        this.areaList.forEach(list => {
          list.children.forEach(child => {
            this.organizationList.push(child)
            if (child.value) {
              arr.push(child.value)
            }
          })
        })
        if (this.areaList.length === 1) {
          this.organizationValue.push(this.areaList[0].value)
        } else {
          this.organizationValue.push(0)
        }
        if (this.organizationList.length > 1) {
          this.organizationList.unshift({ value: 0, label: '全部园所' })
        }
        this.organizationValue.push(this.organizationList[0].value)
        selectValue.push(arr.join(','))
        const emitData = {
          value: selectValue,
          type: 'load'
        }
        this.$emit('change', emitData)
      }
    }
  },
  created () {
    this.getData()
  },
  mounted () {

  },
  methods: {
    select (value, type) {
      if (type === 'area') { // 选择区域
        if (this.hasDefault) {
          this.organizationList = []
          this.areaList.forEach(list => {
            if (value === list.value) {
              this.organizationValue[1] = list.children[0].value
              list.children.forEach(child => {
                this.organizationList.push(child)
              })
            }
          })
          const emitData = {
            value: this.organizationValue,
            type: null
          }
          this.$emit('change', emitData)
        } else {
          this.organizationList = [] // 清空园所数据列表
          const selectValue = [value]
          const arr = []
          if (value === 0) { // 选择全部区域
            this.areaList.forEach(list => {
              list.children.forEach(child => {
                this.organizationList.push(child)
                arr.push(child.value) // 全部园所id
              })
            })
          } else {
            this.areaList.forEach(list => {
              if (list.value === value) {
                list.children.forEach(child => {
                  this.organizationList.push(child) // 重新填充园所数据列表
                  arr.push(child.value) // 选中的区域的子园所的id
                })
              }
            })
          }
          if (this.organizationList.length > 1) {
            this.organizationList.unshift({ value: 0, label: '全部园所' })
          }
          this.organizationValue[1] = this.organizationList[0].value
          selectValue.push(arr.join(','))
          const emitData = {
            value: selectValue,
            type: null
          }
          this.$emit('change', emitData)
        }
      } else if (type === 'organization') {
        const selectValue = [this.organizationValue[0]]
        const arr = []
        if (value === 0) {
          this.organizationList.forEach(list => {
            if (list.value !== 0) {
              arr.push(list.value)
            }
          })
        } else {
          arr.push(value)
        }
        selectValue.push(arr.join(','))
        const emitData = {
          value: selectValue,
          type: null
        }
        this.$emit('change', emitData)
      }
    },
    getData () {
      queryAreaOrganizationList().then(res => {
        this.areaData = res.data
        this.areaList = []
        this.organizationList = []
        this.areaData.forEach(item => {
          const itemData = {
            value: item.areaName,
            label: item.areaName,
            children: []
          }
          item.sonOrganizationVOList.forEach(list => {
            const data = {
              value: list.sonOrganizationId,
              label: list.organizationName
            }
            itemData.children.push(data)
          })
          this.areaList.push(itemData)
        })
        // 园所的列表直接赋值
        this.areaList.forEach(list => {
          list.children.forEach(child => {
            this.organizationList.push(child)
          })
        })
        if (this.hasDefault) { // 将默认值传出去
          this.organizationValue = []
          this.organizationList = this.areaList[0].children
          this.organizationValue.push(this.areaList[0].value)
          this.organizationValue.push(this.organizationList[0].value)
          const emitData = {
            value: this.organizationValue,
            type: 'load'
          }
          this.$emit('change', emitData)
        } else { // 不设置默认值，有选择全部区域的功能，先将全部园所的id传出去
          this.organizationValue = []
          if (this.areaList.length > 1) {
            this.areaList.unshift({ value: 0, label: '全部区域', children: [] })
          }
          this.organizationValue.push(this.areaList[0].value)
          if (this.organizationList.length > 1) {
            this.organizationList.unshift({ value: 0, label: '全部园所' })
          }
          this.organizationValue.push(this.organizationList[0].value)
          const selectValue = [0]
          const arr = []
          this.areaList.forEach(list => {
            list.children.forEach(child => {
              if (child.value) {
                arr.push(child.value)
              }
            })
          })
          selectValue.push(arr.join(','))
          const emitData = {
            value: selectValue,
            type: 'load'
          }
          this.$emit('change', emitData)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
