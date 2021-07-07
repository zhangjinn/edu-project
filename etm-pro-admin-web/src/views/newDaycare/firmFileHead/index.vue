<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div v-if="!showEdit">
          <etm-field-label label="园所名称">{{ form.organizationName }}</etm-field-label>
          <etm-field-label label="园所面积">{{ form.gardenArea||0 }}平方米</etm-field-label>
          <etm-field-label label="场地年租金">{{ form.annualRent||0 }}</etm-field-label>
          <etm-field-label label="设为幼儿园">{{ form.kindergarten?'是':'否' }}</etm-field-label>
          <etm-field-label v-if="form.kindergarten" label="幼儿园满园人数">{{ form.gfullGarden }}</etm-field-label>
          <etm-field-label label="设为托育园">{{ form.nurserySchool?'是':'否' }}</etm-field-label>
          <etm-field-label v-if="form.nurserySchool" label="托育园满园人数">{{ form.careFullGarden }}</etm-field-label>
          <el-button style="margin-bottom: 16px" @click="showEdit=true">编辑</el-button>
        </div>
        <div v-else>
          <etm-form ref="form" :model="form" type="dialog">
            <el-form-item
              label="园所名称"
              prop="organizationName"
            >
              <span>{{ form.organizationName }}</span>
            </el-form-item>
            <el-form-item
              label="园所面积"
              prop="gardenArea"
            >
              <el-row type="flex" class="row-bg">
                <el-col :span="4">
                  <el-input
                    v-model="form.gardenArea"
                    placeholder="请输入园所面积"
                    onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                  />
                </el-col>
                <el-col :span="2">
                  <div style="margin-left: 16px">
                    平方米
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              label="场地年租金"
              prop="annualRent"
            >
              <el-row type="flex" class="row-bg">
                <el-col :span="4">
                  <el-input
                    v-model="form.annualRent"
                    placeholder="请输入场地年租金"
                    onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                  />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              label="设为幼儿园"
              prop="materialName"
            >
              <el-row type="flex" class="row-bg">
                <el-col :span="3">
                  <el-radio-group v-model="form.kindergarten">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-col>
                <el-col :span="2">
                  <div class="colDiv">
                    满园人数
                  </div>
                </el-col>
                <el-col :span="3">
                  <el-input
                    v-model="form.gfullGarden"
                    style="margin-left: -16px;"
                    :disabled="!form.kindergarten"
                    placeholder="请输入幼儿园满园人数"
                    onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                  />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              label="设为托育园"
              prop="materialName"
            >
              <el-row type="flex" class="row-bg">
                <el-col :span="3">
                  <el-radio-group v-model="form.nurserySchool">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-col>
                <el-col :span="2">
                  <div class="colDiv">
                    满园人数
                  </div>
                </el-col>
                <el-col :span="3">
                  <el-input
                    v-model="form.careFullGarden"
                    style="margin-left: -16px;"
                    :disabled="!form.nurserySchool"
                    placeholder="请输入托育园满园人数"
                    onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                  />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              label=""
            >
              <div>
                <el-button type="primary" @click="popConfirmEdit">保存</el-button>
                <el-button plain @click="showEdit = false">取消</el-button>
              </div>
            </el-form-item>
          </etm-form>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/1/29/029 17:40
 */
import { queryOrganization, updateOrganization } from '@/api/newDaycare/firmFileHead'
export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      showEdit: false,
      form: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    popConfirmEdit() {
      updateOrganization(this.form).then(() => {
        this.$message.success('操作成功')
        this.showEdit = false
        this.init()
      })
    },
    init() {
      queryOrganization().then(res => {
        // console.log(res.data)
        this.form = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
.colDiv{
  //margin-left: 16px;
}
}
</style>
