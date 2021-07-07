<template>
  <div class="labelWrap">
    <item-template
      :data.sync="dragData"
      :slot-arr="['title', 'default']"
      @blur="handleChange"
      @focus="handleFocus"
      @change="handleChange"
      @timeChange="handleChange"
      @timeEnable="handleChange"
    />
  </div>
</template>
<script>
import itemTemplate from '../components/itemTemplate'
import { queryCameraSettingList, updateCameraSetting } from '@/api/newDaycare/monitorEquipment'

export default {
  components: {
    itemTemplate
  },
  data() {
    return {
      dragData: [],
      oldText: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      queryCameraSettingList({ type: 'EMPLOYEE' }).then(res => {
        const { data } = res
        this.dragData = []
        for (const k in data) {
          this.dragData.push(data[k])
        }
        // console.log('设置', this.dragData)
      })
    },
    handleChange(i, j) {
      const target = this.dragData[i][j]
      // console.log('target', target)
      const params = {
        startTime: target.startTime,
        endTime: target.endTime,
        enable: target.enable,
        cameraSettingId: target.cameraSettingId
      }
      if (!target.startTime || !target.endTime) {
        return
      }
      updateCameraSetting(params).then(() => {
        this.$message.success('修改成功')
      })
    },
    handleFocus(index) {
      // this.oldText = this.dragData[index].text
    }
  }
}
</script>

<style lang="scss" scoped>
.labelWrap {

}
</style>
