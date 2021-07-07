import request from '@/utils/request'

// 查询在册会员列表
export function getRegisteredMemberList({
  name,
  telephone,
  enterSchoolStartTime,
  enterSchoolEndTime,
  monthAge,
  schoolId,
  eliminationStatus,
  pageNum,
  pageSize
}) {
  return request({
    url: '/neuroo/customer/list/on_school',
    method: 'get',
    params: {
      name,
      telephone,
      enterSchoolStartTime,
      enterSchoolEndTime,
      monthAge,
      schoolId,
      eliminationStatus,
      pageNum,
      pageSize
    }
  })
}

// 查询毕业会员列表
export function getGraduatedMemberList({
  name,
  schoolId,
  graduateStartTime,
  graduateEndTime,
  pageNum,
  pageSize
}) {
  return request({
    url: '/neuroo/customer/list/graduate',
    method: 'get',
    params: {
      name,
      schoolId,
      graduateStartTime,
      graduateEndTime,
      pageNum,
      pageSize
    }
  })
}

// 查询会员详情
export function getMemberDetail(id) {
  return request({
    url: `/neuroo/customer/${id}`,
    method: 'get'
  })
}

// 新增会员
export function addMember(data) {
  return request({
    url: '/neuroo/customer',
    method: 'post',
    data
  })
}

// 更新会员回填信息
export function getMemberInfo(id) {
  return request({
    url: `/neuroo/customer/${id}/update_data`,
    method: 'get'
  })
}

// 查询指定地区编码对应地区的子地区列表
export function queryDistrictList(code) {
  return request({
    url: '/basic/area/sub',
    method: 'get',
    params: { code }
  })
}

// 更新会员
export function modifyMember({ id, data }) {
  return request({
    url: `/neuroo/customer/${id}`,
    method: 'put',
    data
  })
}

// 查询会员的排课表
export function queryTimeTableContent({ customerId, startDate, endDate }) {
  return request({
    url: '/neuroo/schedule/customer_schedule',
    method: 'get',
    params: { customerId, startDate, endDate }
  })
}

// 删除排课表(课程日期中间表)
export function deleteCourse(scheduleId) {
  return request({
    url: `/neuroo/schedule/${scheduleId}`,
    method: 'delete'
  })
}

// 删除课程会员学位
export function deletTimeTableCourse(positionId) {
  return request({
    url: `/neuroo/position/${positionId}`,
    method: 'delete'
  })
}

// 查询班级列表
export function getClazzList(schoolId) {
  return request({
    url: `/neuroo/clazz/class_list/${schoolId}`,
    method: 'get'
  })
}

// 根据班级和日期查找排课表
export function getCourseList({ clazzId, date }) {
  return request({
    url: '/neuroo/schedule/schedule_by_clazz',
    method: 'get',
    params: { clazzId, date }
  })
}

// 给会员新增排课
export function addCourse({ customerId, scheduleId }) {
  return request({
    url: '/neuroo/position',
    method: 'post',
    data: { customerId, scheduleId }
  })
}

// 查询考勤日历
export function getAttendance({ customerId, date }) {
  return request({
    url: '/neuroo/attendance/attendance_calendar',
    method: 'get',
    params: { customerId, date }
  })
}

// 查询请假记录分页
export function queryLeaveRecord({ customerId, pageNum, pageSize }) {
  return request({
    url: '/neuroo/leave_request/record_page',
    method: 'get',
    params: { customerId, pageNum, pageSize }
  })
}

// 查询会员的订单列表
export function queryOrderList({ customerId, pageNum, pageSize }) {
  return request({
    url: '/neuroo/order/by_customer',
    method: 'get',
    params: { customerId, pageNum, pageSize }
  })
}

// 查询会员是否有排课(会员一键排课前置条件)
export function checkArrangeState({ customerId, lastLesson, startDate }) {
  return request({
    url: '/neuroo/position/find_customer_schedule',
    method: 'post',
    data: { customerId, lastLesson, startDate }
  })
}

// 给会员一键排课
export function arrangeClass({ customerId, lastLesson, clazzId, startDate, orderId }) {
  return request({
    url: '/neuroo/position/customer_auto_schedule',
    method: 'post',
    data: { customerId, lastLesson, clazzId, startDate, orderId }
  })
}

// 查询订单详情
export function getOrderDetail(id) {
  return request({
    url: `/neuroo/order/${id}`,
    method: 'get'
  })
}

// 毕业
export function graduate({ customerIds, leaveSchoolType }) {
  return request({
    url: '/neuroo/customer/leave_school',
    method: 'post',
    data: { customerIds, leaveSchoolType }
  })
}

// 入园
export function enter(customerIds) {
  return request({
    url: '/neuroo/customer/into_school',
    method: 'post',
    data: { customerIds }
  })
}

// 获取当前账号能看到的园区
export function getSchoolList() {
  return request({
    url: '/neuroo/organization',
    method: 'get'
  })
}

// 转园会员和订单
export function transferSchool({ targetSchoolId, customerId }) {
  return request({
    url: '/neuroo/order/customer/transfer',
    method: 'post',
    data: { targetSchoolId, customerId }
  })
}
