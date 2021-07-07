<template>
  <div class="detail">
    <el-carousel v-if=" baseInfo.imageList && baseInfo.imageList.length>0" class="banner" trigger="click" height="200px">
      <el-carousel-item v-for="(item, index) in baseInfo.imageList" :key="index">
        <img :src="item.url" alt="">
      </el-carousel-item>
    </el-carousel>
    <div class="firstMsg">
      <etm-title :show-line="false" border>
        <div class="title">
          <span>{{ baseInfo.name }}</span>
        </div>
      </etm-title>
      <div v-if="baseInfo.desc" class="desc">
        {{ baseInfo.desc }}
      </div>
    </div>
    <div class="secondMsg">
      <etm-title :show-line="false" border>
        <div class="title">
          <span>课程信息</span>
        </div>
      </etm-title>
      <ul>
        <li><etm-field-label type="left" label="学期">{{ baseInfo.semester }}</etm-field-label></li>
        <li><etm-field-label type="left" label="年级">{{ baseInfo.grade }}</etm-field-label></li>
        <li><etm-field-label type="left" label="周次">{{ baseInfo.week }}</etm-field-label></li>
        <li><etm-field-label type="left" label="课程科目">{{ baseInfo.subject }}</etm-field-label></li>
      </ul>
    </div>
  </div>
</template>

<script>

import {
  getCourseClazzItem
} from '@/api/guardcare/edu/courseManage'
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
        imageList: [],
        name: null,
        desc: null,
        semester: null,
        grade: null,
        week: null,
        subject: null

      }

    }
  },
  created() {
    this.getCourseSpecialItemData()
  },
  methods: {
    getCourseSpecialItemData() {
      const id = this.itemId
      getCourseClazzItem(id).then((res) => {
        const { data } = res

        this.baseInfo.imageList = data.attachment
        this.baseInfo.name = data.name
        this.baseInfo.desc = data.introduction
        this.baseInfo.semester = data.courseTermName
        this.baseInfo.grade = data.gradeName
        this.baseInfo.week = data.courseTermWeekName
        this.baseInfo.subject = data.courseSubjectName
      })
    }

  }
}
</script>

<style scoped lang="scss">
  .detail{
    .banner {
      margin-bottom: 16px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .firstMsg{
      padding-bottom: 16px;
    }
    .title{
      display: flex;
      justify-content: space-between;
      span:nth-child(1) {
        @include c_title_color();
      }
      span:nth-child(2){
        @include etm-color();
      }
    }
    .desc{
      padding-bottom: 16px;
    }
    .childInfoTitle{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  }
</style>
