<template>
  <div class="nurseCourse">
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
    <div
      v-else
      class="defaultImg"
    >
      <img :src="defaultImg">
    </div>
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
      托育信息
    </etm-title>
    <!--    <etm-form type="dialog">-->
    <!--      <el-form-item label="托育类型">-->
    <!--        {{ nurseType }}-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="课程容量">-->
    <!--        {{ capacity }}-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="消课课时">-->
    <!--        {{ lesson }}-->
    <!--      </el-form-item>-->
    <!--    </etm-form>-->
    <div>
      <etm-field-label
        label="业务类型"
        type="left"
      >
        托育
      </etm-field-label>
      <etm-field-label
        label="托育类型"
        type="left"
      >
        {{ nurseType }}
      </etm-field-label>
      <etm-field-label
        label="托育年龄段"
        type="left"
      >
        {{ generationName }}
      </etm-field-label>
      <etm-field-label
        label="消课天数"
        type="left"
      >
        {{ lesson }}
      </etm-field-label>
      <etm-field-label
        label="课程容量"
        type="left"
      >
        {{ totalCapacity }}
      </etm-field-label>
      <etm-field-label
        label="正式学位"
        type="left"
      >
        {{ formalCapacity }}
      </etm-field-label>
      <etm-field-label
        label="试听学位"
        type="left"
      >
        {{ experienceCapacity }}
      </etm-field-label>
    </div>
  </div>
</template>
<script>
import { queryNurseCourseDetail } from '@/api/newDaycare/courseManage'

export default {
  data () {
    return {
      name: '',
      price: 280,
      description: '',
      nurseType: '',
      generationName: '',
      capacity: '',
      lesson: '',
      imgArr: [],
      totalCapacity: '',
      formalCapacity: '',
      experienceCapacity: '',
      defaultImg: require('@/assets/images/daycare/img-tykc.png')
    }
  },
  methods: {
    getData (id) {
      queryNurseCourseDetail(id).then(res => {
        const { data } = res
        this.name = data.caeCourseName
        this.price = data.price
        this.nurseType = data.courseTypeName
        this.generationName = data.generationName
        this.capacity = data.capacity
        this.lesson = data.lesson
        this.description = data.introduction || '无'
        this.imgArr = []

        this.totalCapacity = data.totalCapacity
        this.formalCapacity = data.formalCapacity
        this.experienceCapacity = data.experienceCapacity

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
.nurseCourse {
  ::v-deep .el-carousel {
    margin-bottom: 16px;
  }

  ::v-deep .el-image {
    height: 200px;
  }

  .text {
    margin-bottom: 16px;
  }

  .defaultImg {
    @include bgc_hover_color();
    height: 200px;
    margin-bottom: 16px;
    padding-top: 24px;
    text-align: center;
  }
}
</style>
