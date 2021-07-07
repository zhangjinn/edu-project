
export default {
  showSuccessMessage: function(object, message) {
    object.$message({
      showClose: true,
      message: message,
      type: 'success'
    })
  },
  showMessage: function(object, message) {
    object.$message({
      showClose: true,
      message: message
    })
  },
  showWarningMessage: function(object, message) {
    object.$message({
      showClose: true,
      message: message,
      type: 'warning'
    })
  },
  showErrorMessage: function(object, message) {
    object.$message({
      showClose: true,
      message: message,
      type: 'error'
    })
  },

  handleTimeStr: function(time) {
    if (time === undefined || time === null) {
      return ''
    }
    const date = new Date(time)
    const y = date.getFullYear()
    let MM = date.getMonth() + 1
    MM = MM < 10 ? '0' + MM : MM
    let d = date.getDate()
    d = d < 10 ? '0' + d : d
    let h = date.getHours()
    h = h < 10 ? '0' + h : h
    let m = date.getMinutes()
    m = m < 10 ? '0' + m : m
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m
  }
}
