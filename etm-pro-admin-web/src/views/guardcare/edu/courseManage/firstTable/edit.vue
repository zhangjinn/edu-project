<template>
  <etm-form ref="form" :model="form" type="dialog">

    <el-form-item
      label="课程名称"
      prop="name"
      :rules="formValidate.nullValueRule(true,'请输入课程名称')"
    >
      <el-input
        v-model="form.name"
        maxlength="10"
        placeholder="请输入课程名称"
      />
    </el-form-item>

    <el-form-item
      label="课表颜色"
      prop="color"
      :rules="formValidate.nullValueRule(true,'请选择课表颜色')"
    >
      <etm-color v-model="form.color" />

    </el-form-item>

    <el-form-item
      label="课程价格（元）"
      prop="price"
      :rules="formValidate.nullValueRule(true,'请输入课程价格')"
    >
      <el-input
        v-model="form.price"
        placeholder="请输入课程价格"
      />
    </el-form-item>

    <el-form-item
      label="上课时长（分钟）"
      prop="long"
    >
      <el-input
        v-model="form.long"
        placeholder="请输入上课时长"
      />
    </el-form-item>

    <el-form-item
      label="适用年龄（岁）"
      prop="age"
    >
      <el-input
        v-model="form.age"
        placeholder="请输入适用年龄"
      />
    </el-form-item>

    <el-form-item
      label="满班人数"
      prop="childNum"
    >
      <el-input
        v-model="form.childNum"
        onkeyup="value=value.replace(/[^\d]/g,'')"
        placeholder="请输入满班人数"
      />
    </el-form-item>

    <el-form-item
      label="课程图片"
      prop="previewSrcLists"
    >
      <etm-upload-img
        :resource-name="'guardcare/courseManage'"
        :preview-src-list="form.previewSrcLists"
        :preview-src-key="form.previewSrcKey"
        :limit="9"
        @getImgList="getImgList"
      />
    </el-form-item>

    <el-form-item
      label="课程简介"
      prop="desc"
    >
      <el-input
        v-model="form.desc"
        type="textarea"
        :rows="3"
        placeholder="请输入课程简介"
      />
    </el-form-item>

    <el-form-item label="是否启用">
      <el-radio-group v-model="form.enable">
        <el-radio label="1">是</el-radio>
        <el-radio label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
  </etm-form>
</template>

<script>
import { getImgUrlRelativePath } from '@/utils'
import formValidate from '@/utils/rules'
import etmUploadImg from '@/components/EtmUploadImg/index'
import etmColor from '@/views/newDaycare/courseTimeManageTeach/components/etmColor.vue'
import {
  getCourseSpecialItem
} from '@/api/guardcare/edu/courseManage'

export default {
  name: 'EditClass',
  components: {
    etmUploadImg,
    etmColor
  },
  props: {
    type: {
      type: String,
      default: 'add',
      validator(val) {
        return ['add', 'edit'].includes(val)
      }
    },
    itemId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      formValidate,
      form: {
        name: null,
        color: '',
        price: null,
        long: null,
        age: null,
        childNum: null,
        previewSrcLists: [],
        previewSrcKey: [],
        desc: null,
        enable: '1'
      }

    }
  },
  created() {
    if (this.type === 'edit') {
      this.init()
    }
  },
  methods: {
    getImgList(val, key) {
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    },

    init() {
      const id = this.itemId
      getCourseSpecialItem(id).then((res) => {
        const { data } = res

        this.form = {
          name: data.name,
          color: data.scheduleColor,
          price: data.price,
          long: data.courseHour,
          age: data.age,
          childNum: data.num,
          previewSrcLists: [],
          previewSrcKey: [],
          desc: data.introduction,
          enable: data.enable ? '1' : '2'
        }
        if (data.attachment) {
          data.attachment.forEach(item => {
            this.form.previewSrcLists.push(item.url)
            this.form.previewSrcKey.push(getImgUrlRelativePath(item.url))
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
