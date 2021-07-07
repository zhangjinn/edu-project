<template>
  <etm-layout-split>
    <div class="addCourse-wrap">
      <etm-title>{{ courseId ? '修改课程': '添加课程' }}</etm-title>
      <etm-form ref="form" :model="model" :rules="rules" style="flex: 1;overflow:auto;">
        <el-form-item label="课程名称: " prop="courseName">
          <el-input v-model="model.courseName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="适用月龄: " required>
          <el-row type="flex">
            <el-col :span="11">
              <el-form-item prop="monthAgeStart" style="margin-bottom: 0;">
                <el-select v-model="model.monthAgeStart">
                  <el-option v-for="item in maxMonth" :key="item" :label="item+ '月'" :value="item" />
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="2" style="text-align: center">至</el-col>
            <el-col :span="11">
              <el-form-item prop="monthAgeEnd" style="margin-bottom: 0;">
                <el-select v-model="model.monthAgeEnd">
                  <el-option v-for="item in maxMonth" :key="item" :label="item+ '月'" :disabled="item < model.monthAgeStart" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="课程分类: " prop="categoryId">
          <el-select v-model="model.categoryId" placeholder="请选择课程">
            <el-option v-for="(item,index) of courseList" :key="index" :label="item.courseCategoryName" :value="item.courseCategoryId" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用: " prop="enable">
          <el-radio-group v-model="model.enable">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程内容: " prop="content">
          <etm-editor v-model="model.content" />
        </el-form-item>
        <el-form-item label="课程附件: " prop="extraAddressArray">
          <el-upload
            class="upload-demo"
            drag
            :file-list="model.extraAddressArray"
            action="#"
            :auto-upload="false"
            multiple
            :on-change="fileChange"
            :on-remove="fileRemove"
            @click.native="handleFile"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item>
        <!--<el-form-item>-->
        <!--  <el-button type="primary" @click="handleSave">保存</el-button>-->
        <!--  <el-button style="margin-left: 14px;" @click="handleCancel">取消</el-button>-->
        <!--</el-form-item>-->
      </etm-form>
      <etm-form-foot @save="handleSave" @cancel="handleCancel" />
    </div>
  </etm-layout-split>

</template>

<script>
import EtmEditor from '@/components/EtmEditor/src/EtmEditor'
import { getUploadFilePrefix, uploadFile } from '@/api/base'
import { addCourse, queryCourseCategorySelect, queryCourseDetailById, updateCourse } from '@/api/course'
import { getEnumValueByKey } from '@/enums'

/**
   *  2020/4/16 9:51
   *  haijinsha
   */
export default {
  name: 'AddCourse',
  components: { EtmEditor },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      uploadDomain: '',
      maxMonth: getEnumValueByKey('MAX_MONTH'),
      courseList: [
        {
          name: '测试',
          id: '1'
        }
      ],
      rules: {
        courseName: { required: true, message: '请输入课程', trigger: 'blur' },
        monthAgeStart: { required: true, message: '请选择月龄', trigger: 'change' },
        monthAgeEnd: { required: true, message: '请选择月龄', trigger: 'change' },
        categoryId: { required: true, message: '请选择课程', trigger: 'change' },
        enable: { required: true, message: '请选择是否显示', trigger: 'change' }
        // content: {
        // required: false, message: '请输入课程内容', trigger: 'blur', validator(rule, value, callback) {
        //   return value && callback() || callback(new Error('请输入课程内容'))
        // }
        // }
      },
      model: {
        courseName: '',
        monthAgeStart: '',
        monthAgeEnd: '',
        categoryId: '',
        enable: true,
        content: '',
        extraAddressArray: []
      }
    }
  },
  computed: {
    courseId() {
      return this.$store.state.course.courseId
    }
  },
  watch: {},
  created() {
    this.init()
  },
  async mounted() {
    this.uploadDomain = await getUploadFilePrefix()
  },
  methods: {
    init() {
      queryCourseCategorySelect({ showAll: false }).then(res => {
        this.courseList = res.data
      })
      if (this.courseId) {
        queryCourseDetailById({ courseId: this.courseId }).then(res => {
          this.model = res.data
        })
      }
    },
    handleSave() {
      this.$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const { courseName, enable, monthAgeStart, monthAgeEnd, extraAddressArray, categoryId, content } = this.model
          if (this.courseId) {
            updateCourse({
              courseId: this.courseId,
              courseName,
              enable,
              monthAgeEnd,
              monthAgeStart,
              extraAddressArray,
              categoryId,
              content
            }).then(res => {
              this.$message.success('更新成功')
              this.handleCancel()
              // this.$router.go(-1)
            })
          } else {
            addCourse({ courseName, enable, monthAgeStart, monthAgeEnd, extraAddressArray, categoryId, content }).then(res => {
              this.$message.success('添加成功')
              this.handleCancel()
              // this.$router.go(-1)
            })
          }
        }
      })
    },
    handleCancel() {
      // this.$message.success('已取消')
      // this.$router.go(-1)
      this.$emit('jump', 'course')
    },
    fileChange(file) {
      uploadFile(file, 'course/addCourse/0', 'file').then(res => {
        console.log(res, this.uploadDomain)
        this.model.extraAddressArray.push({
          url: this.uploadDomain + res.data.key,
          name: file.raw.name
        })
      })
    },
    fileRemove(file, fileList) {
      this.model.extraAddressArray.forEach((item, index) => {
        if (item.name === file.name) {
          this.model.extraAddressArray.splice(index, 1)
        }
      })
    },
    handleFile(e) {
      if (e.target.className === 'el-upload-list__item-name' && e.target.tagName === 'A') {
        const file = this.model.extraAddressArray.find(item => item.name === e.target.innerText)
        open(file.url)
      }
    },
    resetFields() {
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .addCourse-wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /*height: calc(100% - 60px);*/
    /*height: 100%;*/
    /*background-color: #fff;*/

    & /deep/ .el-form-item__content {
      max-width: 500px;

      .el-input, .el-select {
        width: 100%;
      }
      /*.el-upload-dragger {*/
      /*  display: flex;*/
      /*  align-items: center;*/
      /*  justify-content: center;*/
      /*  > i {*/
      /*    margin: 0;*/
      /*  }*/
      /*}*/
    }

  }
</style>
