import { validPhoneNumber, validNumber } from './validate'

/**
* 输入框校验
* */
const rulePhone = (rule, value, callback) => {
  // 家长电话可以为空
  if (value !== '') {
    if (!validPhoneNumber(value)) {
      return callback(new Error('手机号码有误，请重填'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const ruleNumber = (rule, value, callback) => {
  // 数字类型输入框可以为空
  if (value !== '') {
    if (!validNumber(value)) {
      callback(new Error('需要输入数字类型哦~'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const rulePositiveIntegerNumber = (rule, value, callback) => {
  // 数字类型输入框可以为空
  if (value !== '') {
    if (!validNumber(value)) {
      callback(new Error('需要输入数字类型哦~'))
    } else {
      if (value <= 0) {
        callback(new Error('必须大于0'))
      } else {
        callback()
      }
    }
  } else {
    callback()
  }
}

const ruleNumberNew = (rule, value, callback) => {
  // 数字类型输入框可以为空
  if (value !== '') {
    if (!validNumber(value)) {
      callback(new Error('格式错误'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const formValidate = {
  // 表单项不能为空验证  （之后客户线索中所有验证表单均需加上此项，可参考观测报告列表）
  nullValueRule (required = false, message = '请输入', trigger = ['blur', 'change'], type) {
    if (type && type === 'array') {
      return {
        type: 'array',
        required,
        message,
        trigger
      }
    } else if (type === 'object') {
      return {
        required,
        trigger: 'change',
        validator: (rule, value, callback) => {
          console.log(value)
          if (!value.province && !value.city && !value.region) {
            callback(new Error('商户所属省市区不能为空'))
          } else if (!value.city && !value.region) {
            callback(new Error('选择城市'))
          } else if (!value.region) {
            callback(new Error('选择行政区'))
          } else {
            callback()
          }
        }
      }
    } else {
      return {
        required,
        message,
        trigger
      }
    }
  },

  // 手机号校验
  phoneRule (trigger = 'blur') {
    return {
      validator: rulePhone,
      trigger
    }
  },

  // 必须为数字校验且大于0
  isPositiveIntegerNumber (required = false, trigger = ['blur', 'change']) {
    return {
      required,
      validator: rulePositiveIntegerNumber,
      trigger
    }
  },

  // 必须为数字校验
  isNumberRule (min = 0, trigger = ['blur', 'change']) {
    return {
      min,
      validator: ruleNumber,
      trigger
    }
  },

  // 必须为数字校验
  isNumberRuleNew (min = 0, trigger = ['blur', 'change']) {
    return {
      min,
      validator: ruleNumberNew,
      trigger
    }
  }

}
export default formValidate
