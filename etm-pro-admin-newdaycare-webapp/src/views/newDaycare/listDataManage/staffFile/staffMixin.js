import clanJson from './common/clan.JSON'
export default {
  name: 'staffMixin',
  data () {
    return {
      nationOptions: clanJson.data,
      genderOptions: [
        { name: '男', value: 'MALE' },
        { name: '女', value: 'FEMALE' }
      ],
      marrigeOptions: [
        { name: '已婚', value: true },
        { name: '未婚', value: false }
      ],
      hukouTypeOptions: [
        { name: '农业户口', value: 'COUNTRYSIDE' },
        { name: '非农业户口', value: 'NOT_COUNTRYSIDE' }
      ],
      educationOptions: [
        { name: '小学', value: 'primary_school' },
        { name: '初中', value: 'junior_high_school' },
        { name: '高中', value: 'high_school' },
        { name: '中专', value: 'technical_secondary_school' },
        { name: '大专', value: 'college' },
        { name: '本科', value: 'undergraduate' },
        { name: '研究生', value: 'graduate_student' },
        { name: '博士', value: 'doctoral' },
        { name: '博士后', value: 'postdoctoral' }
      ],
      contractTypeOptions: [
        { name: '劳动合同', value: 'employment_contract' },
        { name: '非全日制劳动合同', value: 'part_time_labor_contract' },
        { name: '劳务合同', value: 'labor_contract' }
      ],
      compilationStatusOptions: [
        { name: '编制', value: true },
        { name: '非编制', value: false }
      ],
      cardOptions: [
        { name: '居民身份证' },
        { name: '临时身份证' },
        { name: '港澳同胞回乡证' },
        { name: '港澳居民来往内地通行证' },
        { name: '中华人民共和国来往港澳通行证' },
        { name: '台湾居民来往大陆通行证' },
        { name: '大陆居民往来台湾通行证' },
        { name: '军官证' },
        { name: '士兵证' },
        { name: '军队学员证' },
        { name: '军队文职干部证' },
        { name: '军队离退休干部证' },
        { name: '军队职工证' },
        { name: '护照' },
        { name: '外国人居留证' },
        { name: '外国人出入境证' },
        { name: '外交官证' }
      ]

    }
  },
  filters: {
    hukouTypeFilter (val) {
      return val === 'NOT_COUNTRYSIDE' ? '非农业户口' : '农业户口'
    },
    compilationStatus (val) {
      return val ? '编制' : '非编制'
    },
    educationTypeFilter (val) {
      return {
        primary_school: '小学',
        junior_high_school: '初中',
        high_school: '高中',
        technical_secondary_school: '中专',
        college: '大专',
        undergraduate: '本科',
        graduate_student: '研究生',
        doctoral: '博士',
        postdoctoral: '博士后'
      }[val]
    },
    marrigeStatusFilter (val) {
      return val ? '已婚' : '未婚'
    },
    contractTypeFilter (val) {
      return {
        employment_contract: '劳动合同',
        part_time_labor_contract: '非全日制劳动合同',
        labor_contract: '劳务合同'
      }[val]
    },
    genderFilter (val) {
      return val === 'MALE' ? '男' : '女'
    }
  },
  methods: {
    educationTypeFilter (val) {
      return {
        primary_school: '小学',
        junior_high_school: '初中',
        high_school: '高中',
        technical_secondary_school: '中专',
        college: '大专',
        undergraduate: '本科',
        graduate_student: '研究生',
        doctoral: '博士',
        postdoctoral: '博士后'
      }[val]
    },
    contractTypeFilter (val) {
      return {
        employment_contract: '劳动合同',
        part_time_labor_contract: '非全日制劳动合同',
        labor_contract: '劳务合同'
      }[val]
    }
  }
}
