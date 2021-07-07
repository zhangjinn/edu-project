<template>
  <div class="basicForm">
    <etm-form ref="basicForm" :rules="rules" :model="formData">
      <el-form-item label="会员姓名（中文）:" prop="name">
        <el-input v-model="formData.name" placeholder="请输入中文名" />
      </el-form-item>
      <el-form-item label="会员名（英文）:">
        <el-input v-model="formData.englishName" placeholder="请输入英文名" />
      </el-form-item>
      <el-form-item label="性别:" prop="gender">
        <el-radio-group v-model="formData.gender">
          <el-radio :label="'MALE'">男</el-radio>
          <el-radio :label="'FEMALE'">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期:" prop="birthday">
        <el-date-picker
          v-model="formData.birthday"
          placeholder="请选择出生日期"
          :picker-options="birthdayOptions"
        />
      </el-form-item>
      <el-form-item ref="contactList" label="联系人:" prop="contactList">
        <div class="contactBox">
          <div v-for="(item, index) in formData.contactList" :key="index" class="multipleForm contact">
            <el-select
              v-model="item.contactTypeId"
              placeholder="请选择联系人关系"
            >
              <el-option v-for="(list, i) in relationList" :key="i" :label="list.value" :value="list.id" />
            </el-select>
            <el-input v-model="item.name" placeholder="请输入联系人姓名" />
            <el-input v-model="item.phone" placeholder="请输入手机号码" @focus="clearMsg" />
            <div class="addContact">
              <span v-if="index === 0" class="iconfont iconplus" @click="addContact()" />
              <span v-else class="iconfont iconminus" @click="removeContact(index)" />
              <span @click="changeParent(index)">{{ item.isReceiver ? '取消接送人' : '设为接送人' }}</span>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="地区:">
        <div class="area multipleForm">
          <el-select
            v-model="formData.area.provinceCode"
            :placeholder="$t('collectionManage.collBasicMerProvincePlh')"
            @change="getCity($event, 'change')"
          >
            <el-option v-for="(province, i) in provinceList" :key="i" :label="province.name" :value="province.code" />
          </el-select>
          <el-select
            v-model="formData.area.cityCode"
            :placeholder="$t('collectionManage.collBasicMerCityPlh')"
            @change="getRegion($event, 'change')"
          >
            <el-option v-for="(city, i) in cityList" :key="i" :label="city.name" :value="city.code" />
          </el-select>
          <el-select v-model="formData.area.countyCode" :placeholder="$t('collectionManage.collBasicMerRegionPlh')">
            <el-option v-for="(region, i) in regionList" :key="i" :label="region.name" :value="region.code" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="详细地址:">
        <el-input v-model="formData.address" placeholder="请输入详细地址" />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
import { getAreaByCode } from '@/api/area'
import { getContact } from '@/api/contact'
import { validPhoneNumber } from '@/utils/validate'

export default {
  props: {
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      provinceList: [],
      provinceSelectCode: null,
      cityList: [],
      citySelectCode: null,
      regionList: [],
      rules: {
        name: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            const patt = /^[\u4e00-\u9fa5]{0,}$/g
            if (!value) {
              callback(new Error('中文名不能为空'))
            } else if (!patt.test(value)) {
              callback(new Error('只能输入中文名'))
            }
          }
        }],
        gender: [{ required: true, message: '性别不能为空', trigger: 'change' }],
        birthday: [{ required: true, message: '出生日期不能为空', trigger: 'change' }],
        contactList: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            value.forEach(item => {
              if (!item.contactTypeId) {
                callback(new Error('联系人关系不能为空'))
              } else if (!item.name) {
                callback(new Error('联系人姓名不能为空'))
              } else if (!item.phone) {
                callback(new Error('联系人手机号码不能为空'))
              } else if (!validPhoneNumber(item.phone)) {
                callback(new Error('联系人手机号码格式错误'))
              }
            })
          }
        }]
      },
      relationList: [],
      birthdayOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        }
      }
    }
  },
  mounted() {
    setTimeout(() => { // 修改时导入地区
      if (this.formData.area && this.formData.area.cityCode) {
        this.getCity(this.formData.area.provinceCode, 'load')
      }
      if (this.formData.area && this.formData.area.countyCode) {
        this.getRegion(this.formData.area.cityCode, 'load')
      }
    }, 1000)
  },
  created() {
    this.getContactList()
    this.getProvince()
  },
  methods: {
    getContactList() { // 联系人称呼列表
      getContact().then(res => {
        this.relationList = res.data
      })
    },
    getProvince() { // 省区列表
      getAreaByCode().then(res => {
        const data = res.data
        this.provinceList = data
      })
    },
    getCity(value, type) { // 根据省获取市区列表
      if (this.provinceSelectCode !== value) {
        this.provinceSelectCode = value
        if (type === 'change') {
          this.formData.area.cityCode = ''
          this.formData.area.countyCode = ''
          this.regionList = []
        }
        const param = {
          code: value
        }
        getAreaByCode(param).then(res => {
          const data = res.data
          this.cityList = data
        })
      }
    },
    getRegion(value, type) { // 根据市获取县区列表
      if (this.citySelectCode !== value) {
        this.citySelectCode = value
        if (type === 'change') {
          this.formData.area.countyCode = ''
        }
        const param = {
          code: value
        }
        getAreaByCode(param).then(res => {
          const data = res.data
          this.regionList = data
        })
      }
    },
    clearMsg() {
      this.$refs.contactList.clearValidate()
    },
    addContact() { // 增加联系人
      let flag = false
      this.formData.contactList.forEach(item => {
        if (!item.contactTypeId || !item.name || !item.phone) {
          flag = true
        }
        if (!validPhoneNumber(item.phone)) {
          flag = true
        }
      })
      if (flag) {
        this.$message.warning('请完善已有联系人')
        return
      }
      const contact = {
        contactTypeId: '',
        name: '',
        phone: '',
        isReceiver: false
      }
      this.formData.contactList.push(contact)
    },
    removeContact(index) { // 删除联系人
      this.formData.contactList.splice(index, 1)
      this.$refs.contactList.clearValidate()
      this.$nextTick(() => {
        this.$refs.basicForm.$children[0].validateField('contactList')
      })
    },
    changeParent(index) { // 设为或取消接送人
      if (this.formData.contactList[index].isReceiver) {
        let count = 0
        this.formData.contactList.forEach(item => {
          if (item.isReceiver) {
            count++
          }
        })
        if (count < 2) {
          this.$message.warning('最少保留一个接送人')
          return
        }
      }
      this.formData.contactList[index].isReceiver = !this.formData.contactList[index].isReceiver
    }
  }
}
</script>

<style lang="scss" scoped>
  .basicForm {
    .area {
      font-size: 0;
    }

    .multipleForm {
      display: flex;
      justify-content: space-between;

      /deep/ .el-select, .el-input {
        width: 32%;
      }
    }

    .contact {
      position: relative;

      .addContact {
        position: absolute;
        top: 0;
        right: -110px;

        span {
          cursor: pointer;
          @include c_main_color();

          &:hover {
            opacity: 0.8;
          }
        }

        .iconfont {
          font-weight: bold;
        }
      }
    }

    .contact + .contact {
      margin-top: 16px;
    }
  }
</style>
