<template>
  <div class="add-wrap">
    <etm-form
      ref="form"
      :model="form"
      type="dialog"
    >
      <el-form-item
        label="食谱日期"
        prop="semester"
      >
        <el-select
          v-model="addForm.semester"
          placeholder="请选择食谱日期"
          @change="changeSemester"
        >
          <el-option
            v-for="item in semesterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="食谱名称"
        prop="semester"
      >
        <el-input
          v-model="addForm.recipeName"
          placeholder="请输入食谱名称"
        />
      </el-form-item>
      <el-form-item
        label="选择人群"
        prop="semester"
      >
        <el-select
          v-model="addForm.semester"
          placeholder="请选择人群"
          @change="changeSemester"
        >
          <el-option
            v-for="item in semesterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="引用食谱"
        prop="semester"
      >
        <el-select
          v-model="addForm.semester"
          placeholder="请选择食谱"
          @change="changeSemester"
        >
          <el-option
            v-for="item in semesterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="食谱封面"
        prop="semester"
      >
        <etm-upload-img
          :resource-name="'collectionManage'"
          :preview-src-list="addForm.cover"
          :preview-src-key="addForm.facadeSrcKey"
          :limit-number="1"
          :limit-size="5"
          limit-type="JPG"
          @getImgList="getCoverList"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * add create by Administrator
 * createTime 2021/3/11 16:28
 */
import EtmUploadImg from '@/components/EtmUploadImg'
export default {
  name: 'Add',
  components: { EtmUploadImg },
  filters: {},
  mixins: [],
  props: {
    addForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      semesterOptions: [
        { label: '2021/01/11至2021/02/11', value: 'first' }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
    },
    changeSemester () {

    },
    getCoverList () {}
  }
}
</script>
<style lang="scss" scoped>
</style>
