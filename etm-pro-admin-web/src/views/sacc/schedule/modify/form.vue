<template>
  <etm-form :model="form" type="dialog">
    <el-form-item :label="$t('schedule.formLabelScheduleType') + ':'">
      <el-select v-model="form.type" :placeholder="$t('schedule.scheduleTypePlaceHolderText')">
        <el-option v-for="(option, index) in typeList" :key="index" :label="option.scheduleTypeName" :value="option.scheduleTypeId" />
      </el-select>
    </el-form-item>

    <!-- 课程 -->
    <el-form-item v-show="form.type === 1" :label="$t('schedule.formLabelCourseType') + ':'">
      <el-select v-model="form.courseTypeId" :placeholder="$t('schedule.selectTypePlaceHolderText')" @change="courseTypeChange">
        <el-option v-for="(option, index) in courseTypeList" :key="index" :label="option.courseCategoryName" :value="option.courseCategoryId" />
      </el-select>
    </el-form-item>
    <el-form-item v-show="form.type === 1" :label="$t('schedule.formLabelCourseName') + ':'">
      <el-select v-model="form.courseInfo" :placeholder="$t('schedule.selectCoursePlaceHolderText')">
        <el-option v-for="(option, index) in courseList" :key="index" :label="`${option.courseName}-${$t('schedule.monthAgeText')}${option.monthAgeStart}-${option.monthAgeEnd}`" :value="option.courseName" />
      </el-select>
    </el-form-item>

    <!-- 餐食 -->
    <el-form-item v-show="form.type === 2" :label="$t('schedule.formLabelFoodType') + ':'">
      <el-select v-model="form.foodInfo" :placeholder="$t('schedule.selectTypePlaceHolderText')">
        <el-option v-for="(option, index) in foodContentList" :key="index" :label="option.scheduleContentName" :value="option.scheduleContentName" />
      </el-select>
    </el-form-item>

    <!-- 检查 -->
    <el-form-item v-show="form.type === 3" :label="$t('schedule.formLabelInspectType') + ':'">
      <el-select v-model="form.inspectInfo" :placeholder="$t('schedule.selectTypePlaceHolderText')">
        <el-option v-for="(option, index) in inspectContentList" :key="index" :label="option.scheduleContentName" :value="option.scheduleContentName" />
      </el-select>
    </el-form-item>

    <!-- 自定义 -->
    <el-form-item v-show="form.type === 4" :label="$t('schedule.formLabelCustom') + ':'">
      <el-input v-model="form.custom" :placeholder="$t('schedule.inputScheduleContentPlaceHolderText')" />
    </el-form-item>
  </etm-form>
</template>
<script>
import { getScheduleTypeList, getScheduleContentList, getCourseTypeList, getCourseList } from '@/api/schedule'
export default {
  data() {
    return {
      form: {
        type: '',
        courseTypeId: '',
        courseInfo: '',
        foodInfo: '',
        inspectInfo: '',
        custom: ''
      },
      typeList: [],
      foodContentList: [],
      inspectContentList: [],
      courseTypeList: [],
      courseList: []
    }
  },
  computed: {
  },
  created() {
    getScheduleTypeList().then(res => {
      const { data } = res
      this.typeList = data
    // eslint-disable-next-line handle-callback-err
    }).catch(err => {
      this.$message.error(this.$t('schedule.getScheduleTypeListFailTip'))
    })

    getScheduleContentList({ scheduleTypeId: 2 }).then(res => {
      const { data } = res
      this.foodContentList = data
    // eslint-disable-next-line handle-callback-err
    }).catch(err => {
      this.$message.error(this.$t('schedule.getFoodListContentFailTip'))
    })
    getScheduleContentList({ scheduleTypeId: 3 }).then(res => {
      const { data } = res
      this.inspectContentList = data
    // eslint-disable-next-line handle-callback-err
    }).catch(err => {
      this.$message.error(this.$t('schedule.getScheduleContentListFailTip'))
    })

    getCourseTypeList().then(res => {
      const { data } = res
      this.courseTypeList = data
    // eslint-disable-next-line handle-callback-err
    }).catch(err => {
      this.$message.error(this.$t('schedule.getCourseTypeListFailTip'))
    })
  },
  methods: {
    clearForm() {
      this.form = {
        type: '',
        courseTypeId: '',
        courseInfo: '',
        foodInfo: '',
        inspectInfo: '',
        custom: ''
      }
    },
    courseTypeChange(id) {
      getCourseList({ categoryId: this.form.courseTypeId }).then(res => {
        const { data } = res
        this.courseList = data
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.$message.error(this.$t('schedule.getCourseListFailTip'))
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
