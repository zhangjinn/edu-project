<template>
  <div class="edit">
    <div class="edit-tip">
      <el-tag>人脸识别机序列号SN码在机身背面位置</el-tag>
    </div>
    <etm-form
      ref="form"
      :model="editForm"
      type="dialog"
      class="edit-form"
    >
      <el-form-item
        label="品牌"
        prop="brand"
      >
        <el-select v-model="editForm.brand">
          <el-option
            v-for="(item) in brandList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="型号"
        prop="model"
        :rules="editRules.model"
      >
        <el-input
          v-model="editForm.model"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="体温检测功能"
        prop="temperatureDetection"
      >
        <el-select
          v-model="editForm.temperatureDetection"
          disabled
        >
          <el-option
            v-for="(item) in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="名称"
        prop="deviceName"
        :rules="editRules.deviceName"
      >
        <el-input v-model="editForm.deviceName" />
      </el-form-item>
      <el-form-item
        label="序列号（SN）"
        prop="deviceKey"
        :rules="editRules.deviceKey"
      >
        <el-input
          v-model="editForm.deviceKey"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="设备位置"
        prop="position"
      >
        <el-input v-model="editForm.position" />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * edit create by Administrator
 * createTime 2021/3/9 15:04
 */
export default {
  name: 'Edit',
  components: {},
  filters: {},
  mixins: [],
  props: {
    editForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      brandText: undefined,
      brandList: [
        { value: 'UNI_UBI', label: '宇泛' }
      ],
      statusList: [
        { value: 0, label: '有' },
        { value: 1, label: '无' }
      ],
      editRules: {
        // brand: [
        //   { required: true, message: '请选择设备品牌', trigger: 'blur' }
        // ],
        model: [
          { required: true, message: '请选择设备类型', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        deviceKey: [
          { required: true, message: '请选择序列号', trigger: 'blur' }
        ]
      }
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
      this.brandText = this.brandList[this.editForm.brand]
    }
  }
}
</script>
<style lang="scss" scoped>
  .edit-form {
    margin-top: 20px;
  }
</style>
