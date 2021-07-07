<template>
  <div class="oneDayProcess">
    <el-carousel v-if="imgArr.length" height="200px">
      <el-carousel-item v-for="(img, index) in imgArr" :key="index">
        <el-image :src="img" fit="contain">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </el-carousel-item>
    </el-carousel>
    <etm-title :show-line="false" border>
      <etm-text type="primary">{{ name }}</etm-text>
      <!-- <div slot="tool">课时 {{ courseTime }}</div> -->
    </etm-title>
    <div class="text">
      {{ description }}
    </div>
    <!-- <etm-title :show-line="false" border>日程内容信息</etm-title>
    <etm-form type="dialog">
      <el-form-item label="业务类型">
        托育
      </el-form-item>
    </etm-form> -->
  </div>
</template>
<script>
import { queryOneDayProcessDetail } from '@/api/newDaycare/courseManage'
export default {
  data() {
    return {
      name: '积木游戏',
      description: '',
      imgArr: []
    }
  },
  methods: {
    getData(id) {
      queryOneDayProcessDetail(id).then(res => {
        const { data } = res
        this.name = data.caeScheduleName
        this.description = data.introduction || '无'
        this.imgArr = []
        Array.isArray(data.image) && data.image.forEach(v => {
          this.imgArr.push(v.url)
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.oneDayProcess {
  & >>> .el-carousel {
    margin-bottom: 16px;
  }
  & >>> .el-image {
    height: 200px;
  }
  .text {
    margin-bottom: 16px;
  }
}
</style>
