<template>
  <div class="childFollowPanel-wrap">
    <div class="btn-box">
      <el-button
        type="primary"
        @click="commentFollow('FOLLOW_UP')"
      >
        写跟进
      </el-button>
      <el-button
        plain
        @click="commentFollow('PHONE', $event)"
      >
        打电话
      </el-button>
      <!--<el-button @click="commentFollow('TASK')">任务</el-button>-->
      <el-button
        plain
        @click="commentFollow('SEND_MESSAGE', $event)"
      >
        发短信
      </el-button>
      <!--<el-button @click="commentFollow('phone')">到访</el-button>-->
      <!--<el-button @click="commentFollow('phone')">签约</el-button>-->

      <etm-pop
        pop="simple"
        :visible.sync="showCall"
        title="选择联系人"
        @close="showCall = false"
        @cancel="showCall = false"
        @confirm="showCall = false"
      >
        <ul>
          <li
            v-for="(item, index) of childInfoDetail.relationshipList"
            :key="index"
            class="callLi"
          >
            <div>{{ item.parentName }} ({{ item.relationshipName }}) <span>{{ item.telephone }}</span></div>
            <etm-text
              type="primary"
              @click="callPhone(item.telephone, `${item.parentName} ( ${item.relationshipName} )`)"
            >
              <i
                class="iconfont iconphone"
              />拨打
            </etm-text>
          </li>
        </ul>
      </etm-pop>
      <!--      <etm-static-dialog-->
      <!--        v-if="target"-->
      <!--        :visible.sync="showPop"-->
      <!--        :target="target"-->
      <!--      >-->
      <!--        <ul>-->
      <!--          <li v-for="(item, index) of childInfoDetail.relationshipList" :key="index">-->
      <!--            <etm-field-label :label="`${item.parentName} ( ${item.relationshipName} )`">-->
      <!--              <span-->
      <!--                style="cursor:pointer;"-->
      <!--                @click="callPhone(item.telephone, `${item.parentName} ( ${item.relationshipName} )`)"-->
      <!--              >-->
      <!--                {{ item.telephone }} <etm-text>拨打</etm-text>-->
      <!--              </span>-->
      <!--            </etm-field-label>-->
      <!--          </li>-->
      <!--        </ul>-->
      <!--      </etm-static-dialog>-->

      <!--      <etm-static-dialog-->
      <!--        v-if="target2"-->
      <!--        :visible.sync="showPop2"-->
      <!--        :target="target2"-->
      <!--      >-->
      <!--        <ul>-->
      <!--          <li v-for="(item, index) of childInfoDetail.relationshipList" :key="index">-->
      <!--            <etm-field-label :label="`${item.parentName} ( ${item.relationshipName} )`">-->
      <!--              <span id="(item.telephone)" style="cursor:pointer;">-->
      <!--                {{ item.telephone }} <etm-text @click="handleSendMessage(item.telephone)">发短信</etm-text>-->
      <!--              </span>-->
      <!--            </etm-field-label>-->
      <!--          </li>-->
      <!--        </ul>-->
      <!--      </etm-static-dialog>-->
    </div>
    <div
      v-if="isCommentFollow"
      class="follow-box"
    >
      <el-collapse-transition>
        <el-form
          label-width="100px"
          label-position="left"
          :model="followData"
        >
          <el-row
            :span="24"
            :gutter="24"
          >
            <el-col :span="12">
              <el-form-item label="跟进时间">
                <el-date-picker
                  v-model="followData.followTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下次跟进时间">
                <el-date-picker
                  v-model="followData.nextFollowTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            :span="24"
            :gutter="24"
          >
            <el-col :span="12">
              <el-form-item label="跟进方式">
                <el-select
                  v-model="followData.meansId"
                  clearable
                >
                  <el-option
                    v-for="(item) of followTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学员状态">
                <el-select
                  v-model="followData.childStatus"
                  clearable
                >
                  <el-option
                    v-for="(item) of childStatusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            :span="24"
            :gutter="24"
          >
            <el-col :span="12">
              <el-form-item label="重要程度">
                <el-select
                  v-model="followData.childImportance"
                  clearable
                >
                  <el-option
                    v-for="(item) of childImportanceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预约到访时间">
                <el-date-picker
                  v-model="followData.visitTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="试听">
                <div class="button-group">
                  <el-button
                    v-has="{authId : 'newdaycare.auditionTeach.create'}"
                    type="primary"
                    size="small"
                    @click="showTry({type : 'audi', classType : 'TEACH', childName : childInfo.childName})"
                  >
                    早教试听
                  </el-button>
                  <el-button
                    v-has="{authId : 'newdaycare.auditionCare.create'}"
                    type="primary"
                    size="small"
                    @click="showAudition({type : 'audi', classType : 'CARE', childName : childInfo.childName})"
                  >
                    托育试听
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="选择模板"
                placeholder="请选择模板"
              >
                <el-select
                  v-model="followData.templateId"
                  clearable
                  @change="handleTemplateChange"
                >
                  <el-option
                    v-for="(item) of childTemplateList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="padding-bottom: 24px;">
            <el-col>
              <el-input
                v-model="followData.content"
                type="textarea"
                resize="none"
                :rows="4"
                :maxlength="200"
                placeholder="请填写跟进内容"
              />
            </el-col>
          </el-row>
          <el-row style="padding-bottom: 24px;">
            <el-col>
              <upload-img
                resource-name="childManage/more"
                :preview-src-list="followData.previewSrcLists"
                :preview-src-key="followData.previewSrcKey"
                :text="''"
                @getImgList="getImgList"
              />
            </el-col>
          </el-row>
          <el-row style="padding-bottom: 8px;">
            <el-col>
              <div class="btn-box">
                <el-button
                  plain
                  @click="cancel"
                >
                  取消
                </el-button>
                <el-button
                  v-throttle
                  type="primary"
                  @click="save"
                >
                  保存
                </el-button>
                <el-button
                  v-throttle
                  type="primary"
                  @click="next"
                >
                  保存并下一个
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-transition>
    </div>
    <etm-tabs
      v-model="currentTab"
      :show-toggle="false"
    >
      <el-tab-pane
        label="全部"
        name="all"
      />
      <el-tab-pane
        label="跟进记录"
        name="follow"
      />
      <el-tab-pane
        label="任务"
        name="task"
      />
      <el-tab-pane
        label="到访记录"
        name="visit"
      />
      <div class="timeline">
        <el-timeline>
          <template v-if="currentTab === 'all'">
            <el-timeline-item
              v-for="(item, index) of childDetail.all"
              :key="index"
              :icon="computeIcon(item)"
            >
              <template v-if="item.type === '到访'">
                <div
                  class="title-box"
                  style="align-items: flex-start;"
                >
                  <div class="title">
                    预约{{ item.type }}
                    <span :class="[item.visitType]">{{ visitStuts[item.visitType] }}</span>
                  </div>
                  <div class="time">
                    <span>{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                    <el-button
                      v-if="item.visitType !== 'VISIT' && item.visitType !== 'CANCEL_VISIT'"
                      size="mini"
                      type="primary"
                      @click="visitTrigger(item.followId)"
                    >
                      到访确认
                    </el-button>
                  </div>
                </div>

                <etm-field-label
                  v-if="item.type === '试听'"
                  type="left"
                  :label="item.courseType === 'CARE' ? '班级名称' : '课程名称'"
                >
                  {{ item.courseType === 'CARE' ? item.clazzName : item.courseTitle }}
                </etm-field-label>
                <etm-field-label
                  v-if="item.type === '试听'"
                  type="left"
                  label="上课时间"
                >
                  {{ item.classTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
                </etm-field-label>
                <etm-field-label
                  v-if="item.type === '试听'"
                  type="left"
                  label="上课老师"
                >
                  {{ item.classTeacher }}
                </etm-field-label>

                <etm-field-label
                  v-if="item.type === '到访'"
                  type="left"
                  label="预约到访时间"
                >
                  {{
                    item.appointmentVisitTime | parseTime('{y}-{m}-{d} {h}:{i}')
                  }}
                </etm-field-label>

                <etm-field-label
                  v-if="item.type === '到访' && item.visitType === 'VISIT'"
                  type="left"
                  label="到访时间"
                >
                  {{
                    item.visitTime | parseTime('{y}-{m}-{d} {h}:{i}')
                  }}
                </etm-field-label>

                <etm-field-label
                  v-if="item.type === '到访' && item.visitType === 'VISIT'"
                  type="left"
                  label="到访情况"
                >
                  {{
                    item.visits
                  }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="操作人"
                >
                  {{ item.createName }}
                </etm-field-label>
              </template>
              <template v-if="item.type === '试听'">
                <div
                  class="title-box"
                  style="align-items: flex-start;"
                >
                  <div class="title">
                    预约{{ item.type }}
                    <span :class="[item.visitType]">{{ visitStuts[item.visitType] }}</span>
                  </div>
                  <div class="time">
                    <span>{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                    <el-button
                      v-if="item.visitType !== 'VISIT' && item.visitType !== 'CANCEL_VISIT'"
                      size="mini"
                      type="primary"
                      @click="visitTrigger(item.followId)"
                    >
                      到访确认
                    </el-button>
                  </div>
                </div>

                <etm-field-label
                  v-if="item.type === '试听'"
                  type="left"
                  :label="item.courseType === 'CARE' ? '班级名称' : '课程名称'"
                >
                  {{ item.courseType === 'CARE' ? item.clazzName : item.courseTitle }}
                </etm-field-label>
                <etm-field-label
                  v-if="item.type === '试听'"
                  type="left"
                  label="上课时间"
                >
                  {{ item.classTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
                </etm-field-label>
                <etm-field-label
                  v-if="item.type === '试听'"
                  type="left"
                  label="上课老师"
                >
                  {{ item.classTeacher }}
                </etm-field-label>

                <etm-field-label
                  v-if="item.type === '到访'"
                  type="left"
                  label="预约到访时间"
                >
                  {{
                    item.appointmentVisitTime | parseTime('{y}-{m}-{d} {h}:{i}')
                  }}
                </etm-field-label>

                <etm-field-label
                  v-if="item.type === '到访' && item.visitType === 'VISIT'"
                  type="left"
                  label="到访时间"
                >
                  {{
                    item.visitTime | parseTime('{y}-{m}-{d} {h}:{i}')
                  }}
                </etm-field-label>

                <etm-field-label
                  v-if="item.type === '到访' && item.visitType === 'VISIT'"
                  type="left"
                  label="到访情况"
                >
                  {{
                    item.visits
                  }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="操作人"
                >
                  {{ item.createName }}
                </etm-field-label>
              </template>
              <template v-if="item.type === '跟进'">
                <div class="title-box">
                  <span class="title">写跟进</span>
                  <span class="time">{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </div>
                <etm-field-label
                  type="left"
                  label="跟进内容"
                >
                  {{ item.content }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="跟进方式"
                >
                  {{ item.meansName }}
                </etm-field-label>
                <!--<etm-field-label label="学员状态">{{ item.childStatus }}</etm-field-label>-->
                <!--<etm-field-label label="重要程度">{{ item.childImportance }}</etm-field-label>-->
                <etm-field-label
                  type="left"
                  label="跟进时间"
                >
                  {{
                    item.followTime | parseTime('{y}-{m}-{d} {h}:{i}')
                  }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="下次跟进时间"
                >
                  {{
                    item.nextFollowTime | parseTime('{y}-{m}-{d} {h}:{i}')
                  }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="操作人"
                >
                  {{ item.followerName }}
                </etm-field-label>
                <div class="imgs-box">
                  <!--<img v-for="(img, i) of item.imageList" :key="i+'2'" :src="img.url" :alt="img.name">-->
                  <div
                    v-for="(img) of item.imageList"
                    :key="img.url"
                    style=" margin-bottom: 8px;
  margin-right: 8px;"
                  >
                    <el-image
                      style=" height: 100px;
  width: 100px;"
                      :src="img.url"
                      :preview-src-list="item.imageList.map(img => img.url)"
                      fit="cover"
                      z-index="999999"
                    />
                  </div>
                </div>
              </template>
              <template v-if="item.type === '打电话'">
                <div class="title-box">
                  <span class="title">打电话</span>
                  <span class="time">{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </div>
                <etm-field-label
                  type="left"
                  label="播放"
                >
                  <etm-text
                    v-if="!item.phoneRecordingUrl"
                    type="normal"
                  >
                    未接通
                  </etm-text>
                  <etm-text
                    v-else
                    type="primary"
                    @click="playAudio(item.phoneRecordingUrl, $event)"
                  >
                    播放
                  </etm-text>
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="操作人"
                >
                  {{ item.followerName }}
                </etm-field-label>
              </template>
              <template v-if="item.type === '发短信'">
                <div class="title-box">
                  <span class="title">发短信</span>
                  <span class="time">{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </div>
                <etm-field-label
                  type="left"
                  label="短信内容"
                >
                  {{ item.content }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="操作人"
                >
                  {{ item.followerName }}
                </etm-field-label>
              </template>
              <template v-if="item.type === '任务'">
                <div class="title-box">
                  <span class="title">任务</span>
                  <span class="time">{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </div>
                <etm-field-label
                  type="left"
                  label="下次跟进时间"
                >
                  {{
                    item.nextFollowTime | parseTime('{y}-{m}-{d} {h}:{i}')
                  }}
                </etm-field-label>
                <etm-field-label
                  type="left"
                  label="操作人"
                >
                  {{ item.followerName }}
                </etm-field-label>
              </template>
            </el-timeline-item>
            <etm-empty v-if="childDetail.all.length === 0" />
          </template>

          <template v-else-if="currentTab === 'follow'">
            <el-timeline-item
              v-for="(item, index) of childDetail.followList"
              :key="index"
              icon="iconfont iconxiegenjin"
            >
              <div class="title-box">
                <span class="title">写跟进</span>
                <span class="time">{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </div>
              <etm-field-label
                type="left"
                label="跟进内容"
              >
                {{ item.content }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="跟进方式"
              >
                {{ item.meansName }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="跟进时间"
              >
                {{
                  item.followTime | parseTime('{y}-{m}-{d} {h}:{i}')
                }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="下次跟进时间"
              >
                {{
                  item.nextFollowTime | parseTime('{y}-{m}-{d} {h}:{i}')
                }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="操作人"
              >
                {{ item.followerName }}
              </etm-field-label>
              <div class="imgs-box">
                <!--<img v-for="(img) of item.imageList" :key="img.url + '_'" :src="img.url" :alt="img.url">-->

                <el-image
                  v-for="(img) of item.imageList"
                  :key="img.url"
                  style="width: 100px;"
                  :src="img.url"
                  :preview-src-list="[img.url]"
                />
              </div>
            </el-timeline-item>
            <etm-empty v-if="childDetail.followList.length === 0" />
          </template>

          <template v-else-if="currentTab === 'task'">
            <el-timeline-item
              v-for="(item, index) of childDetail.taskList"
              :key="index"
              icon="iconfont iconrenwu"
            >
              <div class="title-box">
                <span class="title">任务</span>
                <span class="time">{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </div>
              <etm-field-label
                type="left"
                label="下次跟进时间"
              >
                {{
                  item.nextFollowTime | parseTime('{y}-{m}-{d} {h}:{i}')
                }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="操作人"
              >
                {{ item.followerName }}
              </etm-field-label>
            </el-timeline-item>
            <etm-empty v-if="childDetail.taskList.length === 0" />
          </template>

          <template v-else-if="currentTab === 'visit'">
            <el-timeline-item
              v-for="(item, index) of childDetail.visit"
              :key="index"
              icon="iconfont iconyuyuedaofang"
            >
              <div
                class="title-box"
                style="align-items: flex-start;"
              >
                <div class="title">
                  预约{{ visitType[item.type] }}
                  <span :class="[item.visitType]">{{ visitStuts[item.visitType] }}</span>
                </div>
                <div class="time">
                  <span>{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                  <el-button
                    v-if="item.visitType !== 'VISIT' && item.visitType !== 'CANCEL_VISIT'"
                    size="mini"
                    type="primary"
                    @click="visitTrigger(item.followId)"
                  >
                    到访确认
                  </el-button>
                </div>
              </div>

              <etm-field-label
                v-if="item.type === 'AUDITION'"
                type="left"
                :label="item.courseType === 'CARE' ? '班级名称' : '课程名称'"
              >
                {{ item.courseType === 'CARE' ? item.clazzName : item.courseTitle }}
              </etm-field-label>
              <etm-field-label
                v-if="item.type === 'AUDITION'"
                type="left"
                label="上课时间"
              >
                {{ item.classTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
              </etm-field-label>
              <etm-field-label
                v-if="item.type === 'AUDITION'"
                type="left"
                label="上课老师"
              >
                {{ item.classTeacher }}
              </etm-field-label>

              <etm-field-label
                v-if="item.type === 'VISIT'"
                type="left"
                label="预约到访时间"
              >
                {{
                  item.appointmentVisitTime | parseTime('{y}-{m}-{d} {h}:{i}')
                }}
              </etm-field-label>

              <etm-field-label
                v-if="item.type === 'VISIT' && item.visitType === 'VISIT'"
                type="left"
                label="到访时间"
              >
                {{
                  item.visitTime | parseTime('{y}-{m}-{d} {h}:{i}')
                }}
              </etm-field-label>

              <etm-field-label
                v-if="item.type === 'VISIT' && item.visitType === 'VISIT'"
                type="left"
                label="到访情况"
              >
                {{
                  item.visits
                }}
              </etm-field-label>

              <etm-field-label
                type="left"
                label="操作人"
              >
                {{ item.createName }}
              </etm-field-label>
            </el-timeline-item>
            <etm-empty v-if="childDetail.visit.length === 0" />
          </template>
        </el-timeline>
      </div>
    </etm-tabs>

    <send-message
      ref="sendMessage"
      :send-message="sendMessage"
    />

    <resolve-visit
      ref="resolveVisit"
      :follow-id="followId"
      @update="updateVisit"
    />
    <about-course
      ref="aboutCourse"
      :prop="aboutProp"
      @getIds="getIds"
    />
    <audition-course
      ref="auditionCourse"
      :prop="auditionProp"
      @getIds="getIds"
    />
  </div>
</template>

<script>
/**
 * childFollowPanel create by haijinsha
 * createTime 2020/8/29 17:39
 */

import resolveVisit from '@/views/newDaycare/childManage/myChild/components/resolveVisit'
import baseMixin from '@/layout/mixin/baseMixin'
import aboutCourse from '@/views/newDaycare/childManage/myChild/components/aboutCourse'
import auditionCourse from '@/views/newDaycare/childManage/myChild/components/auditionCourse'
import {
  createCareApp,
  createChildFollow, createCreaAudi, createTeachApp, createTeachAudi,
  queryChildInfoForDisplay,
  queryChildInfoForEdit,
  queryChildLogsByPanelType,
  queryVisit
} from '@/api/newDaycare/childManage'
import {
  queryChildAttribute,
  queryChildFollowSelect,
  queryChildStatus,
  queryFollowTemplateSelect
} from '@/api/newDaycare/childManageSetting'
import { createCall } from '@/api/newDaycare/yunCall'
import { parseTime } from '@/utils'
import UploadImg from '@/components/EtmUploadImg/index'
import SendMessage from '@/views/newDaycare/childManage/myChild/components/sendMessage'

export default {
  name: 'ChildFollowPanel',
  components: { SendMessage, UploadImg, resolveVisit, aboutCourse, auditionCourse },
  filters: {},
  mixins: [baseMixin],
  props: {
    childId: {
      type: [String, Number],
      default: '',
      required: true
    }
  },
  data () {
    return {
      showCall: false,
      followId: 0,
      aboutProp: {},
      auditionProp: {},
      currentTab: 'all',
      isCommentFollow: true,
      handleType: '',
      visitType: {
        VISIT: '到访',
        AUDITION: '试听'
      },
      visitStuts: {
        TO_BE_VISITED: '待到访',
        VISIT: '已到访',
        NOT_VISIT: '待到访',
        CANCEL_VISIT: '取消'
      },
      childDetail: {
        all: [],
        followList: [],
        taskList: [],
        visit: []
      },
      followData: {
        meansId: '',
        templateId: '',
        followTime: parseTime(new Date(), null),
        nextFollowTime: '',
        content: '',
        imageList: [],
        type: '',
        childStatus: '',
        childImportance: '',
        visitTime: '',
        previewSrcLists: [],
        previewSrcKey: [],
        courseManagementMap: {
          TEACH: [],
          CARE: []
        }
      },
      followTypeList: [],
      childStatusList: [],
      childImportanceList: [],
      childTemplateList: [],
      originTemplateList: [],
      childInfo: {},
      childInfoDetail: {},
      showPop: false,
      showPop2: false,
      target: null,
      target2: null,
      sendMessage: {
        phone: '',
        childId: this.childId
      }
    }
  },
  computed: {},
  watch: {
    childId: {
      handler () {
        this.init()
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    computeIcon (item) {
      const arr = ['iconfont',
        item.type === '打电话' ? 'icondadianhua' : '',
        item.type === '发短信' ? 'iconfaduanxin' : '',
        item.type === '任务' ? 'iconrenwu' : '',
        item.type === '跟进' ? 'iconxiegenjin' : '',
        item.type === '到访' ? 'iconyuyuedaofang' : '',
        item.type === '试听' ? 'iconyuyuedaofang' : ''
      ]
      return arr.join(' ')
    },
    getIds (event) {
      let str = ''
      if (this.followData.content) {
        str = '；'
      }
      let _ids = []

      if (event.classType === 'CARE') {
        _ids = event.ids

        event.ids.forEach(cur => {
          str += `已预约${cur.headTeacher}的${cur.courseName}；`
        })
      } else {
        _ids = event.ids.map(cur => {
          str += `已预约${cur.headTeacher}的${cur.courseName}；`
          return cur.courseManagementId
          // return cur
        })
      }
      // this.followData.courseManagementMap[event.classType] = _ids.map(v => {
      //   return v.courseManagementId
      // })

      const require = {
        TEACH: {
          audi: createTeachAudi,
          app: createTeachApp
        },
        CARE: {
          audi: createCreaAudi,
          app: createCareApp
        }
      }
      require[event.classType][event.type](_ids, event.id).then(res => {
        this.$message.success(`新增${event.type === 'app' ? '约课' : '试听'}成功`)
        this.followData.content = this.followData.content + str
      })
    },
    showTry (prop) {
      this.aboutProp = { ...prop, childId: this.childId }
      this.$nextTick(() => {
        this.$refs.aboutCourse.show()
      })
    },
    showAudition (prop) {
      this.auditionProp = { ...prop, childId: this.childId }
      this.$nextTick(() => {
        this.$refs.auditionCourse.show()
      })
    },
    init () {
      if (!this.childId) {
        return false
      }

      queryVisit(this.childId).then(res => {
        this.childDetail.visit = res.data
      })
      queryChildLogsByPanelType({ childId: this.childId, type: null }).then(res => {
        this.childDetail.all = res.data
      })
      queryChildLogsByPanelType({ childId: this.childId, type: 'FOLLOW_UP' }).then(res => {
        this.childDetail.followList = res.data
      })
      queryChildLogsByPanelType({ childId: this.childId, type: 'TASK' }).then(res => {
        this.childDetail.taskList = res.data
      })

      queryChildInfoForDisplay({ childId: this.childId }).then(res => {
        this.childInfoDetail = res.data
      })

      // 获取学员信息用于编辑
      queryChildInfoForEdit({ childId: this.childId }).then(res => {
        this.childInfo = res.data

        queryChildStatus({ childCategory: this.childInfo.category }).then(res => {
          this.childStatusList = this.convertDataToOptions(res.data, 'childStatusName', 'childStatusId')

          this.followData.childStatus = this.childInfo.statusId
        })

        queryChildFollowSelect().then(res => {
          this.followTypeList = this.convertDataToOptions(res.data, 'followMeansName', 'followMeansId')
          // this.followData.meansId = this.followTypeList.length && this.followTypeList[0].value
        })

        queryChildAttribute({ name: 'IMPORTANCE' }).then(res => {
          this.childImportanceList = this.convertDataToOptions(res.data, 'option', 'childAttributeId')
          // this.followData.childImportance = this.childImportanceList.length && this.childImportanceList[0].value
          this.followData.childImportance = this.childInfo.importanceAttrId
        })
      })
      queryFollowTemplateSelect().then(res => {
        this.originTemplateList = res.data
        this.childTemplateList = this.convertDataToOptions(res.data, 'followContentTemplateName', 'followContentTemplateId')
      })
    },
    updateVisit () {
      queryVisit(this.childId).then(res => {
        this.childDetail.visit = res.data
      })
      queryChildLogsByPanelType({ childId: this.childId, type: null }).then(res => {
        this.childDetail.all = res.data
      })
      this.$emit('update', {})
    },
    visitTrigger (id) {
      this.followId = id
      this.$refs.resolveVisit.show()
    },
    handleTemplateChange () {
      const find = this.originTemplateList.find(item => item.followContentTemplateId === this.followData.templateId)
      console.log(find)
      this.followData.content = find.content
    },
    commentFollow (type, event) {
      const phone = []
      const parentName = []

      switch (type) {
        case 'FOLLOW_UP':
          this.isCommentFollow = !this.isCommentFollow
          break
        case 'PHONE': {
          if (this.childInfoDetail.relationshipList.length > 1) {
            // this.target = event
            this.showCall = true
          } else {
            this.callPhone(this.childInfoDetail.relationshipList[0].telephone, `${this.childInfoDetail.relationshipList[0].parentName}(${this.childInfoDetail.relationshipList[0].relationshipName})`)
          }
          break
        }
        case 'SEND_MESSAGE':
          // console.log(this.childInfoDetail)
          // if (this.childInfoDetail.relationshipList.length > 1) {
          //   this.target2 = event
          // } else {
          //   this.target2 = event
          //   this.showPop2 = true
          // }

          this.childInfoDetail.relationshipList.forEach(cur => {
            phone.push(cur.telephone)
            parentName.push(`${cur.parentName} (${cur.relationshipName})`)
          })

          this.sendMessage.phone = phone
          this.sendMessage.parentName = parentName
          this.sendMessage.childId = this.childId
          this.$refs.sendMessage.handleVisible(true)
          break
      }
    },
    handleSendMessage (phone) {
      this.sendMessage.phone = phone
      this.target2 = null
      this.$refs.sendMessage.handleVisible(true)
    },
    callPhone (telephone, name) {
      this.$etmTip.init({
        type: 'warn',
        title: `确定要拨打给 <span class="mainColor" style="font-size: 16px;">${name} ${telephone}</span> 吗？`,
        content: '系统将在您确认拨打电话后自动为您拨号，请留意接听您的手机。',
        confirmBtn: '拨打',
        cancelBtn: '取消',
        confirm: () => {
          createCall({ childId: this.childId, telephone }).then(res => {
            this.$message.success('操作成功')
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    // 获取图片
    getImgList (val, key) {
      this.followData.previewSrcLists = val
      this.followData.previewSrcKey = key
    },

    cancel () {
      this.isCommentFollow = false
      this.followData.content = ''
      this.followData.nextFollowTime = ''
      this.followData.meansId = ''
      this.followData.previewSrcKey = []
      this.followData.previewSrcLists = []
      this.$emit('cancel')
    },
    save () {
      return new Promise((resolve, reject) => {
        if (!this.followData.content) {
          reject(new Error('请填写跟进内容'))
          return this.$message.warning('请填写跟进内容')
        }
        const { meansId, courseManagementMap, visitTime, childImportance, childStatus, content, nextFollowTime, followTime, previewSrcKey } = this.followData
        const imageList = previewSrcKey.map(item => {
          return {
            name: 'image',
            url: item
          }
        })

        let _courseManagementMap = courseManagementMap
        console.log('courseManagementMap', courseManagementMap)

        if (!courseManagementMap.TEACH.length && !courseManagementMap.CARE.length) {
          _courseManagementMap = null
        }

        createChildFollow({
          childId: this.childId,
          courseManagementMap: _courseManagementMap,
          visitTime,
          meansId,
          childImportance,
          childStatus,
          imageList,
          content,
          nextFollowTime,
          followTime
        }).then(res => {
          this.$message.success({ message: '操作成功', duration: 1000, showClose: true })
          this.cancel()
          this.init()
          this.$emit('update', {})
          resolve()
        })
      })
    },
    next () {
      this.save().then(res => {
        this.$emit('next', this.childId)
        this.$emit('update', {})
      })
    },
    playAudio (url, event) {
      const audio = new Audio(url)
      audio.play()
      let targetText = ''
      audio.onplay = function (e) {
        targetText = event.target.innerText
        event.target.innerText = '播放中...'
      }
      audio.onpause = function (e) {
        event.target.innerText = targetText
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.childFollowPanel-wrap {
  ::v-deep {
    .el-date-editor,
    .el-select {
      width: 100%;
    }
  }

  .button-group {
    .el-button + .el-button {
      margin-left: 8px;
    }
  }

  .btn-box {
    padding-bottom: 16px;

    .el-button {
      margin-left: 0;
      margin-right: 8px;
    }
  }

  .follow-box {
    border-top: 1px solid $color-divide;
    padding-top: 16px;

    .btn-box {
      text-align: right;

      .el-button {
        margin: 0 0 0 8px;
      }
    }
  }

  .timeline {
    ::v-deep {
      .el-timeline-item {
        min-height: 120px;
        padding-bottom: 1px;

        .iconxiegenjin,
        .iconxueyuanguanli,
        .icondadianhua,
        .iconfaduanxin,
        .iconrenwu,
        .iconyuyuedaofang {
          font-size: 26px;
        }

        .iconxiegenjin {
          color: #ffaf5f;
        }

        .iconyuyuedaofang {
          color: #ffaf5f;
        }

        .iconxueyuanguanli {
          color: #fba047;
        }

        .icondadianhua {
          color: #629fff;
        }

        .iconfaduanxin {
          color: #69d88e;
        }

        .iconrenwu {
          color: #ff7e7e;
        }

        .el-timeline-item__node--normal {
          height: 30px;
          left: 0;
          width: 30px;
        }

        .el-timeline-item__tail {
          border-left: 1px solid #e4e7ed;
          height: 100%;
          left: 14px;
          position: absolute;

        }

        .el-timeline-item__node {
          /*background-color: #E2EEFF;*/
          background-color: $white;

        }

        .el-timeline-item__wrapper {
          padding-top: 8px;

          .el-timeline-item__content {
            padding-left: 16px;
          }
        }
      }

      .EtmFieldLabel-wrap {
        &:not(:last-child) {
          margin-bottom: 0;
        }
      }
    }

    .title-box {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding-bottom: 16px;

      .title {
        color: $color-title;
        font-size: 16px;

        span {
          border-radius: 4px;
          display: inline-block;
          font-size: 12px;
          margin-left: 8px;
          padding: 0 6px;
        }

        .NOT_VISIT {
          border: 1px solid #f52e2e;
          color: #f52e2e;
        }

        .VISIT {
          border: 1px solid #ffac4e;
          color: #ffac4e;
        }

        .TO_BE_VISITED {
          border: 1px solid #1990ff;
          color: #1990ff;
        }

        .CANCEL_VISIT {
          border: 1px solid #ccc;
          color: #ccc;
        }
      }

      //div.time{
      //  text-align: right;
      //}

      .time {
        color: $color-info;
        text-align: right;

        span {
          display: block;
        }
      }
    }

    .imgs-box {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 16px;

      img {
        margin-right: 8px;
        width: 48px;
      }
    }
  }

}

.callLi {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  i {
    font-size: 12px;
  }

  div {
    span {
      color: #999;
    }
  }
}

</style>
