<template>
  <div class="itemDetail">
    <el-carousel
      v-if="imgArr.length"
      height="200px"
    >
      <el-carousel-item
        v-for="(img, index) in imgArr"
        :key="index"
      >
        <el-image
          :src="img"
          fit="contain"
        >
          <div
            slot="placeholder"
            class="image-slot"
          >
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </el-carousel-item>
    </el-carousel>
    <etm-title
      :show-line="false"
      border
    >
      <etm-text type="primary">
        {{ name }}
      </etm-text>
      <div slot="tool">
        <etm-text type="primary">
          单价 ￥{{ price }}
        </etm-text>
      </div>
    </etm-title>
    <div class="text">
      {{ description }}
    </div>
    <etm-title
      :show-line="false"
      border
    >
      物品信息
    </etm-title>
    <etm-form type="dialog">
      <el-form-item label="物品类型">
        教材
      </el-form-item>
    </etm-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      imgArr: ['https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'],
      name: '英语启蒙教材',
      price: 280,
      description: '长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长'
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.itemDetail {
  ::v-deep .el-carousel {
    margin-bottom: 16px;
  }

  ::v-deep .el-image {
    height: 200px;
  }

  .text {
    margin-bottom: 16px;
  }
}
</style>
