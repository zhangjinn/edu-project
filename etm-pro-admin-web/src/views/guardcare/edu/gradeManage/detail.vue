<template>
  <div class="detail">
    <ul>
      <li><etm-field-label label="年级名称">{{ baseInfo.name }}</etm-field-label></li>
    </ul>
  </div>
</template>

<script>
import {
  getGradeItem
} from '@/api/guardcare/edu/gradeManage'
export default {
  name: 'Detail',
  props: {
    itemId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      baseInfo: {
        name: null

      }
    }
  },
  created() {
    this.getMaterialItemData()
  },
  methods: {
    getMaterialItemData() {
      console.log('1111')
      const id = this.itemId
      getGradeItem(id).then((res) => {
        const { data } = res
        this.baseInfo.name = data.name
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .detail{

  }
</style>
