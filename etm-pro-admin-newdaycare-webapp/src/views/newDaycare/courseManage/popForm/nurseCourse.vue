<template>
  <div class="nurseCourse">
    <etm-form
      ref="form"
      type="dialog"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="业务类型">
        托育课
      </el-form-item>
      <el-form-item
        label="托育名称"
        prop="name"
      >
        <el-input
          v-model="formData.name"
          placeholder="请输入托育名称"
        />
      </el-form-item>
      <el-form-item
        label="托育类型"
        prop="nurseType"
      >
        <el-select
          v-model="formData.nurseType"
          placeholder="请选择托育类型"
        >
          <el-option
            v-for="option in typeList"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="托育年龄段"
        prop="nurseType"
      >
        <el-select
          v-model="formData.generationId"
          placeholder="请选择托育年龄段"
        >
          <el-option
            v-for="option in period"
            :key="option.generationId"
            :label="option.generationName"
            :value="option.generationId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="消课天数"
        prop="courseTime"
      >
        <el-input
          v-model="formData.courseTime"
          placeholder="请输入消课天数"
          @input="inputInt"
        />
      </el-form-item>
      <el-form-item
        label="托育时长"
        prop="nurseType"
      >
        <el-select v-model="formData.duration">
          <el-option
            label="半天"
            value="HALF_DAY"
          />
          <el-option
            label="全天"
            value="ONE_DAY"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="单价"
        prop="unitPrice"
      >
        <el-input
          v-model="formData.unitPrice"
          placeholder="请输入单价"
          onkeyup="this.value = this.value.replace(/[^\d.]/g,'')"
        />
      </el-form-item>
      <el-form-item
        label="课程容量"
        prop="totalCapacity"
        class="capactiy"
      >
        <div class="capacity-row">
          <div class="capcity-label">
            总&ensp;学&ensp;位
          </div>
          <div>
            <el-input
              v-model="formData.totalCapacity"
              oninput="this.value = this.value.replace(/[^\d.]/g,'')"
              @blur="calcCapcity"
            />
          </div>
        </div>
        <div class="capacity-row">
          <div class="capcity-label">
            正式学位
          </div>
          <div>
            <el-input
              v-model="formData.formalCapacity"
              oninput="this.value = this.value.replace(/[^\d.]/g,'')"
              @blur="calcCapcity"
            />
          </div>
        </div>
        <div class="capacity-row">
          <div class="capcity-label">
            试听学位
          </div>
          <div>{{ formData.experienceCapacity }}</div>
        </div>
      </el-form-item>
      <el-form-item label="托育简介">
        <el-input
          v-model="formData.description"
          type="textarea"
          placeholder="请输入托育简介"
        />
      </el-form-item>
      <el-form-item label="上传展示图片">
        <etm-upload-img
          :resource-name="'daycare/courseManage/nurseCourse'"
          :preview-src-list="formData.previewSrcLists"
          :preview-src-key="formData.previewSrcKey"
          @getImgList="getImgList"
        />
      </el-form-item>
      <el-form-item
        v-show="showLast"
        label="是否开启"
      >
        <el-switch v-model="formData.isOpen" />
      </el-form-item>
    </etm-form>
  </div>
</template>
<script>
import etmUploadImg from '@/components/EtmUploadImg/index'
import { queryNurseCourseDetail } from '@/api/newDaycare/courseManage'
import { getImgUrlRelativePath } from '@/utils'
import { queryDaycareGenerationList } from '@/api/newDaycare/recipesManage'

export default {
  components: {
    etmUploadImg
  },
  props: {
    timestamp: {
      type: Number,
      default: new Date().getTime()
    },
    showLast: {
      type: Boolean,
      default: true
    },
    typeList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      period: [],
      formData: {
        capacity: '',
        name: '',
        duration: 'HALF_DAY',
        nurseType: '',
        courseTime: 0,
        unitPrice: 0,
        description: '',
        generationId: null,
        previewSrcLists: [],
        previewSrcKey: [], // 提交
        isOpen: false,
        totalCapacity: 20,
        formalCapacity: 20,
        experienceCapacity: 0
      },
      rules: {
        name: [{
          required: true,
          message: '请输入托育名称'
        }],
        nurseType: [{
          required: true,
          message: '请选择托育类型'
        }],
        courseTime: [{
          required: true,
          message: '请输入消课课时'
        }],
        unitPrice: [{
          required: true,
          message: '请输入单价'
        }],
        capacity: [{
          required: true,
          message: '请输入课程容量'
        }]
      }
    }
  },
  watch: {
    timestamp: {
      immediate: true,
      handler () {
        queryDaycareGenerationList().then(res => {
          this.period = res.data
        })
      }
    }
  },
  created () {

  },
  methods: {
    inputInt (e) {
      if (e.indexOf(0) === 0) {
        this.formData.courseTime = 0
      } else if (e !== '') {
        this.formData.courseTime = e.replace(/[^\d]/g, '')
      }
    },
    calcCapcity (event) {
      const _data = this.formData

      if (!_data.totalCapacity) {
        _data.totalCapacity = 20

        if (_data.formalCapacity > 20) {
          _data.formalCapacity = 20
        }
      } else if (!_data.formalCapacity || (parseInt(_data.formalCapacity) > parseInt(_data.totalCapacity))) {
        _data.formalCapacity = _data.totalCapacity
      }

      _data.experienceCapacity = _data.totalCapacity - _data.formalCapacity
    },
    getImgList (val, key) {
      this.formData.previewSrcLists = val
      this.formData.previewSrcKey = key
    },
    resetForm () {
      this.$refs.form.$children[0].resetFields()
      this.formData.description = ''
      this.generationId = null
      this.formData.previewSrcLists = []
      this.formData.duration = 'HALF_DAY'
      this.formData.previewSrcKey = []
      this.formData.totalCapacity = 20
      this.formData.formalCapacity = 20
      this.formData.experienceCapacity = 0
    },
    getData (id) {
      queryNurseCourseDetail(id).then(res => {
        const { data } = res
        const formData = {
          // capacity: data.capacity,
          // name: data.caeCourseName,
          // nurseType: data.courseTypeId,
          // courseTime: data.lesson,
          // unitPrice: data.price,
          // description: data.introduction,
          // isOpen: data.enable
          duration: data.duration,
          generationId: data.generationId,
          formalCapacity: data.formalCapacity,
          experienceCapacity: data.experienceCapacity,
          totalCapacity: data.totalCapacity,
          name: data.caeCourseName,
          nurseType: data.courseTypeId,
          courseTime: data.lesson,
          unitPrice: data.price,
          description: data.introduction,
          isOpen: data.enable
        }
        formData.previewSrcKey = []
        formData.previewSrcLists = []
        data.image.forEach(v => {
          formData.previewSrcLists.push(v.url)
          formData.previewSrcKey.push(getImgUrlRelativePath(v.url))
        })
        this.formData = formData
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.nurseCourse {
  .capactiy {
    .capacity-row {
      align-items: center;

      display: flex;

      &:not(:last-child) {
        margin-bottom: 8px;
      }

      .capcity-label {
        margin-right: 8px;
        width: 80px;
      }
    }
  }

}
</style>
