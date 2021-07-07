<template>
  <div class="shenMsg-wrap">
    <etm-form ref="form" label-width="100px" :model="form" type="dialog">
      <el-form-item
        label="收信人号码"
        prop="stuPhone"
        :rules="formValidate.nullValueRule(true,'请输入收信人号码')"
      >
        <!--        <el-row :gutter="20">-->
        <!--          <el-col :span="16" class="stuPhone">-->
        <!--            <el-input-->
        <!--              v-model="form.stuPhone"-->
        <!--              type="textarea"-->
        <!--              :rows="3"-->
        <!--              placeholder="请输入收信人号码，多个号码用逗号或回车分隔"-->
        <!--            />-->
        <!--          </el-col>-->
        <!--          <el-col :span="4">-->
        <!--            <el-button round @click="memStuStu = true">选择学员</el-button>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-input
          v-model="form.stuPhone"
          type="textarea"
          :rows="3"
          placeholder="请输入收信人号码，多个号码用逗号或回车分隔"
        />
      </el-form-item>
      <el-form-item
        label="选择模板"
        prop="msgType"
      >
        <el-select v-model="form.msgType" placeholder="请选择短信选择模板" @change="msgType">
          <el-option
            v-for="item in form.smsOptions"
            :key="item.id"
            :label="item.name"
            :value="item.content"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="短信内容"
        prop="details"
        :rules="formValidate.nullValueRule(true,'请输入请输入短信内容')"
      >
        <el-input v-model="form.details" type="textarea" :rows="3" placeholder="请输入请输入短信内容" />
      </el-form-item>
    </etm-form>
    <!--    选择会员  -->

    <!--    <etm-pop-->
    <!--      :visible="memStuStu"-->
    <!--      title="选择学员"-->
    <!--      :pop="popType"-->
    <!--      confirm-btn="选好了"-->
    <!--      cancel-btn="取消"-->
    <!--      @close="memClose"-->
    <!--      @cancel="memClose"-->
    <!--      @confirm="memConfirm"-->
    <!--    >-->

    <!--      <div id="search">-->
    <!--        <el-input placeholder="请输入学员姓名搜索" suffix-icon="el-icon-search" />-->
    <!--      </div>-->

    <!--      <etm-table-page selection :columns="columns2" :data="tableData2">-->
    <!--        <etm-table-tool-bar slot="tool">-->
    <!--          <el-input slot="left" placeholder="请输入学员姓名搜索" suffix-icon="el-icon-search" />-->
    <!--        </etm-table-tool-bar>-->
    <!--      </etm-table-page>-->

    <!--    </etm-pop>-->
  </div>

</template>

<script>
/**
 * shenMsg create by Administrator
 * createTime 2020/09/04 10:53
 */
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import { querySmsTemplate } from '@/api/newDaycare/yunSms'

export default {
  name: 'ShenMsg',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      formValidate,
      memStuStu: false,
      popType: 'complex',
      columns2: [
        {
          label: '学员姓名',
          prop: 'carePackageName'
        },
        {
          label: '联系人姓名',
          prop: 'duration'
        },
        {
          label: '联系人电话',
          prop: 'careType'
        }
      ],
      tableData2: {
        content: []
      },
      form: {
        stuPhone: '',
        msgType: '',
        details: '',
        smsOptions: []
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    memClose() {
      this.memStuStu = false
    },
    memConfirm() {
      this.memStuStu = false
    },
    init() {
      querySmsTemplate({ keyword: null }).then(res => {
        this.form.smsOptions = res.data
        // console.log(this.smsOptions)
      })
    },
    msgType(e) {
      this.form.details = e
    }
  }
}
</script>
<style lang="scss" scoped>
.shenMsg-wrap {
  .stuPhone {
    padding-left: 0 !important;
  }
}
</style>
