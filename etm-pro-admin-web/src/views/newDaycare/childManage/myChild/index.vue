<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            ref="tabs"
            v-model="currentTab"
            :setting="hasAuthOfBool('daycare.child.setting')"
            @setting="setting"
          >
            <el-tab-pane
              v-if="hasAuth('daycare.childUnsettled.queryBatch', 'tabs', 'activeTab')"
              label="未成交学员"
              name="UNSOLD"
            >
              <etm-screen-tab
                v-if="searchItems.length"
                v-model="quickScreening"
                :options="searchItems"
                title="快捷筛选"
                @change="searchChange"
              />
              <search-field category="UNSOLD" @query="query" @change="fieldChange" />
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('daycare.childSettled.queryBatch', 'tabs', 'activeTab')"
              label="已成交学员"
              name="DEAL"
            >
              <!--<etm-screen-tab v-if="searchItems.length" :category-list="searchItems" title="快捷筛选" @change="searchChange" />-->
              <search-field category="DEAL" @query="query" @change="fieldChange" />
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('daycare.childLeave.queryBatch', 'tabs', 'activeTab')"
              label="历史学员"
              name="HISTORY"
            >
              <!--              <etm-tool-bar v-model="formData" @search="handleSearch" />-->
              <search-field category="HISTORY" @query="query" @change="fieldChange" />
            </el-tab-pane>
          </etm-tabs>
        </div>

        <div slot="body">
          <template v-if="currentTab === 'UNSOLD'">
            <etm-table-page
              v-fixedHead
              :columns="columns"
              :data="tableData"
              index-type="index"
              selection
              border
              @currentChange="currentChange"
              @selection-change="handleSelectionChange"
            >
              <etm-table-tool-bar slot="tool">
                <div slot="right">
                  <el-button type="primary" @click="showAddChildVisible"><i class="el-icon-plus" />&nbsp;&nbsp;添加学员
                  </el-button>
                  <el-button
                    v-has="{authId: 'daycare.child.assign'}"
                    :disabled="selected.length <= 0"
                    plain
                    @click="assignChildVisible = true"
                  >分配学员
                  </el-button>
                  <el-button :disabled="selected.length <= 0" plain @click="handleGiveUp">放弃回公海</el-button>
                  <el-dropdown key="UNSOLD" @command="changeCommand">
                    <el-button plain>
                      更多<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="batchImport">批量导入</el-dropdown-item>
                      <el-dropdown-item command="batchRemove">批量删除</el-dropdown-item>
                      <el-dropdown-item command="batchAssignManage">分配批次管理</el-dropdown-item>
                      <el-dropdown-item command="batchImportManage">导入批次管理</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>

              </etm-table-tool-bar>
              <el-table-column slot="left" label="学员姓名" fixed="left" width="150">
                <template v-slot="{row}">
                  <etm-text type="primary" @click="handleRowClick(row)">{{ row.name }}</etm-text>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="联系人姓名" fixed="left" width="100">
                <template v-slot="{row}">
                  {{ row.parentName && row.parentName.split(',')[0] }}
                </template>
              </el-table-column>
              <el-table-column slot="left" label="联系人电话" fixed="left" width="150">
                <template v-slot="{row}">
                  {{ row.parentPhone && row.parentPhone.split(',')[0] }}
                </template>
              </el-table-column>
              <el-table-column slot="right" fixed="right" width="300" label="操作">
                <template v-slot="{row}">
                  <etm-text type="primary" @click="handleFollow(row)">跟进</etm-text>
                  <etm-text type="primary" @click="handleCall(row,$event)">打电话</etm-text>
                  <etm-text type="primary" @click="handleSms(row)">发短信</etm-text>
                  <el-dropdown :hide-on-click="false">
                    <etm-text type="primary">更多<i class="el-icon-arrow-down el-icon--right" /></etm-text>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-has="{authId : 'newdaycare.auditionTeach.create'}"
                        @click.native="showCourse(row, 'TEACH', 'audi')"
                      >早教试听
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-has="{authId : 'newdaycare.auditionCare.create'}"
                        @click.native="showCourseCase(row, 'CARE', 'audi')"
                      >托育试听
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="handleBooking(row)">预收定金</el-dropdown-item>
                      <el-dropdown-item
                        v-has="{authId : 'newdaycare.contractTeach.create'}"
                        @click.native="handleSignUp({...row, signUpType : 'CARE'})"
                      >早教签约
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-has="{authId : 'newdaycare.contractCare.create'}"
                        @click.native="handleSignUp({...row, signUpType : 'EARNEST'})"
                      >托育签约
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="!row.admissionStatus"
                        v-has="{authId : 'newdaycare.childSettledAdd.create'}"
                        @click.native="kindergarten(row)"
                      >入园
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </etm-table-page>
          </template>
          <template v-if="currentTab === 'DEAL'">
            <etm-table-page
              v-fixedHead
              :data="tableData2"
              index-type="index"
              selection
              border
              @currentChange="currentChange"
              @selection-change="handleSelectionChange"
            >
              <etm-table-tool-bar slot="tool">
                <div slot="right">
                  <el-button :disabled="selected.length <= 0" plain @click="assignChildVisible = true">分配学员
                  </el-button>
                  <el-dropdown key="DEAL" @command="changeCommand">
                    <el-button plain>
                      更多<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-has="{authId : 'newdaycare.auditionTeach.create'}" command="batchImport">批量导入</el-dropdown-item>
                      <el-dropdown-item command="batchRemove">批量删除</el-dropdown-item>
                      <el-dropdown-item command="batchAssignManage">分配批次管理</el-dropdown-item>
                      <el-dropdown-item v-has="{authId : 'newdaycare.auditionTeach.create'}" command="batchImportManage">导入批次管理</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>

              </etm-table-tool-bar>

              <el-table-column slot="left" label="学员姓名" fixed="left" width="150">
                <template v-slot="{row}">
                  <etm-text type="primary" @click="handleRowClick(row)">{{ row.name }}</etm-text>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="联系人姓名" fixed="left" width="100">
                <template v-slot="{row}">
                  {{ row.parentName && row.parentName.split(',')[0] }}
                </template>
              </el-table-column>
              <el-table-column slot="left" label="联系人电话" fixed="left" width="150">
                <template v-slot="{row}">
                  {{ row.parentPhone && row.parentPhone.split(',')[0] }}
                </template>
              </el-table-column>
              <el-table-column slot="left" label="性别" width="120">
                <template v-slot="{row}">
                  <span>{{ row.gender }}</span>
                </template>
              </el-table-column>

              <el-table-column slot="left" label="年龄" width="220">
                <template v-slot="{row}">
                  <span>{{ row.age }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="早教剩余课时" width="180">
                <template v-slot="{row}">
                  <div v-for="(le, i) of row.tcLesson" :key="i">
                    <etm-field-label
                      v-if="!!le.courseName"
                      :label="le.courseName"
                    >{{
                      le.lesson
                    }}课时
                    </etm-field-label>
                  </div>
                </template>
              </el-table-column>
              <!--              <el-table-column slot="left" label="托育剩余天数" width="180">-->
              <!--                <template v-slot="{row}">-->
              <!--                  <div v-for="(le, i) of row.caeLesson" :key="i">-->
              <!--                    <etm-field-label-->
              <!--                      v-if="!!le.courseName"-->
              <!--                      :label="le.courseName"-->
              <!--                    >{{-->
              <!--                      le.lesson-->
              <!--                    }}天-->
              <!--                    </etm-field-label>-->
              <!--                  </div>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column slot="left" label="所在班级" min-width="120">
                <template v-slot="{row}">
                  <span>{{ row.clazzName }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="家长端激活" min-width="120">
                <template v-slot="{row}">
                  <span>{{ row.activationStatus }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="学员类型" min-width="120">
                <template v-slot="{row}">
                  <span>{{ row.typeList }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="学员状态" width="120">
                <template v-slot="{row}">
                  <span>{{ row.statusName }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="学员来源" width="120">
                <template v-slot="{row}">
                  <span>{{ row.sourceName }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="重要程度" width="120">
                <template v-slot="{row}">
                  <span>{{ row.importanceName }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="下次跟进时间" min-width="120">
                <template v-slot="{row}">
                  <span>{{ row.nextFollowTime }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="最后跟进时间" min-width="120">
                <template v-slot="{row}">
                  <span>{{ row.followTime }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="跟进人员" width="120">
                <template v-slot="{row}">
                  <span>{{ row.followerName }}</span>
                </template>
              </el-table-column>

              <el-table-column slot="right" fixed="right" width="280" label="操作">
                <template v-slot="{row}">
                  <etm-text type="primary" @click="handleFollow(row)">跟进</etm-text>
                  <etm-text type="primary" @click="handleCall(row,$event)">打电话</etm-text>
                  <etm-text type="primary" @click="handleSms(row)">发短信</etm-text>
                  <el-dropdown :hide-on-click="false">
                    <etm-text type="primary">更多<i class="el-icon-arrow-down el-icon--right" /></etm-text>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-has="{authId : 'newdaycare.auditionTeach.create'}" @click.native="showCourse(row, 'TEACH', 'app')">早教约课</el-dropdown-item>
                      <!--                      <el-dropdown-item @click.native="showCourse(row, 'CARE', 'app')">托育约课</el-dropdown-item>-->
                      <el-dropdown-item @click.native="handleBooking(row)">预收定金</el-dropdown-item>
                      <el-dropdown-item
                        v-has="{authId : 'newdaycare.contractTeach.create'}"
                        @click.native="handleSignUp({...row, signUpType : 'CARE'})"
                      >早教续约
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-has="{authId : 'newdaycare.contractCare.create'}"
                        @click.native="handleSignUp({...row, signUpType : 'EARNEST'})"
                      >托育续约
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="!row.admissionStatus"
                        v-has="{authId : 'newdaycare.childSettledAdd.create'}"
                        @click.native="kindergarten(row)"
                      >入园
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </etm-table-page>
          </template>
          <template v-if="currentTab === 'HISTORY'">
            <etm-table-page
              v-fixedHead
              :data="tableData3"
              index-type="index"
              selection
              border
              @currentChange="currentChange"
              @selection-change="handleSelectionChange"
            >
              <etm-table-tool-bar slot="tool">
                <div slot="right">
                  <el-button :disabled="selected.length <= 0" plain @click="assignChildVisible = true">分配学员
                  </el-button>
                  <el-dropdown @command="changeCommand">
                    <el-button plain>
                      更多<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="batchRemove">批量删除</el-dropdown-item>
                      <el-dropdown-item command="batchAssignManage">分配批次管理</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>

              </etm-table-tool-bar>
              <el-table-column slot="left" label="学员姓名" fixed="left" width="150">
                <template v-slot="{row}">
                  <etm-text type="primary" @click="handleRowClick(row)">{{ row.name }}</etm-text>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="联系人姓名" fixed="left" width="100">
                <template v-slot="{row}">
                  {{ row.parentName && row.parentName.split(',')[0] }}
                </template>
              </el-table-column>
              <el-table-column slot="left" label="联系人电话" fixed="left" width="150">
                <template v-slot="{row}">
                  {{ row.parentPhone && row.parentPhone.split(',')[0] }}
                </template>
              </el-table-column>
              <el-table-column slot="left" label="性别" width="120">
                <template v-slot="{row}">
                  <span>{{ row.gender }}</span>
                </template>
              </el-table-column>

              <el-table-column slot="left" label="年龄" width="100">
                <template v-slot="{row}">
                  <span>{{ row.age }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="早教剩余课时" width="180">
                <template v-slot="{row}">
                  <div v-for="(le, i) of row.tcLesson" :key="i">
                    <etm-field-label
                      v-if="!!le.courseName"
                      :label="le.courseName"
                    >{{
                      le.lesson
                    }}课时
                    </etm-field-label>
                  </div>
                </template>
              </el-table-column>
              <!--              <el-table-column slot="left" label="托育剩余天数" width="180">-->
              <!--                <template v-slot="{row}">-->
              <!--                  <div v-for="(le, i) of row.caeLesson" :key="i">-->
              <!--                    <etm-field-label-->
              <!--                      v-if="!!le.courseName"-->
              <!--                      :label="le.courseName"-->
              <!--                    >{{-->
              <!--                      le.lesson-->
              <!--                    }}天-->
              <!--                    </etm-field-label>-->
              <!--                  </div>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column slot="left" label="所在班级" min-width="120">
                <template v-slot="{row}">
                  <span>{{ row.clazzName }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="家长端激活" min-width="120">
                <template v-slot="{row}">
                  <span>{{ row.activationStatus }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="学员类型" min-width="120">
                <template v-slot="{row}">
                  <span>{{ row.typeList }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="学员状态" width="120">
                <template v-slot="{row}">
                  <span>{{ row.statusName }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="学员来源" width="120">
                <template v-slot="{row}">
                  <span>{{ row.sourceName }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="重要程度" width="120">
                <template v-slot="{row}">
                  <span>{{ row.importanceName }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="下次跟进时间" min-width="120">
                <template v-slot="{row}">
                  <span>{{ row.nextFollowTime }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="最后跟进时间" min-width="120">
                <template v-slot="{row}">
                  <span>{{ row.followTime }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="跟进人员" width="120">
                <template v-slot="{row}">
                  <span>{{ row.followerName }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="right" fixed="right" width="300" label="操作">
                <template v-slot="{row}">
                  <etm-text type="primary" @click="handleFollow(row)">跟进</etm-text>
                  <etm-text type="primary" @click="handleCall(row,$event)">打电话</etm-text>
                  <etm-text type="primary" @click="handleSms(row)">发短信</etm-text>
                  <el-dropdown :hide-on-click="false">
                    <etm-text type="primary">更多<i class="el-icon-arrow-down el-icon--right" /></etm-text>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-has="{authId : 'newdaycare.auditionTeach.create'}" @click.native="showCourse(row, 'TEACH', 'app')">早教约课</el-dropdown-item>
                      <!--                      <el-dropdown-item @click.native="showCourse(row, 'CARE', 'app')">托育约课</el-dropdown-item>-->
                      <el-dropdown-item @click.native="handleBooking(row)">预收定金</el-dropdown-item>
                      <el-dropdown-item v-has="{authId : 'newdaycare.contractTeach.create'}" @click.native="handleSignUp({...row, signUpType : 'CARE'})">早教续约</el-dropdown-item>
                      <el-dropdown-item v-has="{authId : 'newdaycare.contractCare.create'}" @click.native="handleSignUp({...row, signUpType : 'EARNEST'})">托育续约</el-dropdown-item>
                      <el-dropdown-item v-if="!row.admissionStatus" v-has="{authId : 'newdaycare.childSettledAdd.create'}" @click.native="kindergarten(row)">入园</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </etm-table-page>
          </template>
        </div>

        <!--添加学员-->
        <div class="addChildren">
          <etm-pop
            :append-to-body="false"
            pop="big"
            title="添加学员"
            :visible="addChildVisible"
            :confirm="handleAddChild"
            @cancel="addChildVisible = false"
            @close="addChildVisible = false"
          >
            <add-child-form v-if="addChildVisible" ref="addChildForm" :child-type="currentTab" />
          </etm-pop>
        </div>

        <!--分配学员-->
        <etm-pop
          :append-to-body="false"
          pop="complex"
          title="分配学员"
          :visible.sync="assignChildVisible"
          :confirm="submitAssignChild"
          @cancel="assignChildVisible = false"
          @close="assignChildVisible = false"
        >
          <assign-child v-if="assignChildVisible" ref="assignChild" :selected.sync="selected" @success="assignSuccess" />
        </etm-pop>

        <!--学员详情-->
        <etm-drawer
          :visible.sync="childDetail.visible"
          type="big"
        >
          <etm-layout-split
            v-if="childDetail.visible"
            :left-styles="{minWidth: '560px', maxWidth: '560px'}"
            :styles="{height: '100vh'}"
            class="child-info-box"
          >
            <div slot="left" class="left">
              <child-logs :child-id="childDetail.childId" />
            </div>
            <div slot="right" class="right">
              <child-info
                :child-id="childDetail.childId"
                :category="currentTab"
                @update="update"
                @next="handleNext"
                @prevChild="prevChild"
              />
            </div>
          </etm-layout-split>
        </etm-drawer>

        <!--跟进-->
        <etm-drawer :visible.sync="followData.visible" type="big">
          <etm-layout-split
            v-if="followData.visible"
            :left-styles="{minWidth: '560px', maxWidth: '560px'}"
            :styles="{height: '100vh'}"
            class="follow-box"
          >
            <div slot="left" class="left">
              <child-follow-panel
                :child-id="childDetail.childId"
                :child-name="childDetail.childName"
                @next="handleNext"
                @update="childLogUpdate"
              />
            </div>
            <div slot="right" class="left">
              <child-info
                ref="childInfo"
                :child-id="childDetail.childId"
                :category="currentTab"
                @update="update"
                @next="handleNext"
                @prevChild="prevChild"
              />
            </div>
          </etm-layout-split>
        </etm-drawer>
        <!--批量导入-->
        <etm-pop
          pop="complex"
          title="批量导入"
          :visible="batchImportData.visible"
          :cancel="importCancel"
          @close="importCancel"
          @confirm="importConfirm"
        >
          <batch-import v-if="batchImportData.visible" ref="batchImport" type="importType" :category="currentTab" />
        </etm-pop>

        <!--打电话-->
        <etm-pop
          pop="simple"
          :visible.sync="showCall"
          title="选择联系人"
          @close="showCall = false"
          @cancel="showCall = false"
          @confirm="showCall = false"
        >
          <ul>
            <li v-for="(item, index) of currentRow.parentName" :key="index" class="callLi">
              <div>{{ item }} <span>{{ currentRow.parentPhone[index] }}</span></div>
              <etm-text type="primary" @click="callPhone(currentRow.parentPhone[index], item)"><i
                class="iconfont iconphone"
              />拨打
              </etm-text>
            </li>
          </ul>
        </etm-pop>

        <!--发短信-->
        <etm-pop
          pop="simple"
          :visible.sync="showMessage"
          title="发短信"
          @close="showMessage = false"
          @cancel="showMessage = false"
          @confirm="showMessage = false"
        >
          <ul>
            <li v-for="(item, index) of currentRow.parentName" :key="index">
              <etm-field-label :label="`${item}`">
                <template style="cursor:pointer;">{{ currentRow.parentPhone[index] }}
                  <etm-text type="primary" @click="handleSendMessage(currentRow.parentPhone[index])">发短信</etm-text>
                </template>
              </etm-field-label>
            </li>
          </ul>
        </etm-pop>

        <!--预收定金-->
        <etm-pop
          pop="complex"
          title="预收定金"
          :visible="deposit.visible"
          @cancel="deposit.visible = false"
          @close="deposit.visible = false"
          @confirm="addDepositConfirm"
        >
          <child-deposit v-if="deposit.visible" ref="childDeposit" :child-id="currentRow.id" />
        </etm-pop>

        <!--        约课/试听-->
        <about-course ref="aboutCourse" :prop="aboutCourseProp" @getIds="getIds" />

        <audition-course ref="auditionCourse" :prop="auditionCourseProp" @getIds="getIds" />

        <!--        签约组件-->
        <sign-up ref="signup" :prop="signUpProp" />

        <kindergarten ref="kindergarten" :prop="kindergartenParams" @success="update" />

        <send-message ref="sendMessage" :send-message="sendMessageData" />
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import kindergarten from '@/views/newDaycare/childManage/myChild/components/kindergarten'
import { uploadFile } from '@/api/base'
import { Loading } from 'element-ui-etm'
import {
  createCareApp,
  createChild,
  createCreaAudi,
  createTeachApp,
  createTeachAudi,
  queryChildList,
  removeChildOnBatch,
  updateChildResourceStatus,
  uploadFileBatchImport
} from '@/api/newDaycare/childManage'
import { createCall } from '@/api/newDaycare/yunCall'
import { parseTime } from '@/utils'
import SearchField from '@/views/newDaycare/childManage/myChild/components/searchField'
import AddChildForm from '@/views/newDaycare/childManage/myChild/components/addChildForm'
import AssignChild from '@/views/newDaycare/childManage/myChild/components/assignChild'
import ChildInfo from '@/views/newDaycare/childManage/myChild/components/childInfo'
import BatchImport from '@/views/newDaycare/childManage/myChild/components/batchImport'
import ChildLogs from '@/views/newDaycare/childManage/myChild/components/childLogs'
import ChildFollowPanel from '@/views/newDaycare/childManage/myChild/components/childFollowPanel'
import ChildDeposit from '@/views/newDaycare/childManage/myChild/components/childDeposit'
import { createDeposit } from '@/api/newDaycare/contract'
import signUp from '@/views/newDaycare/contract/components/singUp'
import SendMessage from '@/views/newDaycare/childManage/myChild/components/sendMessage'
import aboutCourse from '@/views/newDaycare/childManage/myChild/components/aboutCourse'
import auditionCourse from '@/views/newDaycare/childManage/myChild/components/auditionCourse'

let uploadLoading
// import { removeSubOrganization } from '@/api/base/org'
// import { delCourseSpecial } from '@/api/guardcare/edu/courseManage'

// import aboutCourse from '@/views/daycare/childManage/myChild/components/aboutCourse'

/**
 * index create by haijinsha
 * createTime 2020/8/25 10:11
 */
export default {
  name: 'Index',
  components: {
    kindergarten,
    aboutCourse,
    // aboutCourse,
    SendMessage,
    ChildDeposit,
    ChildFollowPanel,
    ChildLogs,
    BatchImport,
    ChildInfo,
    AssignChild,
    AddChildForm,
    SearchField,
    signUp,
    auditionCourse
  },
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      kindergartenParams: {},
      signUpProp: {},
      currentTab: 'UNSOLD',
      uploadFile: uploadFile,
      aboutCourseProp: {},
      auditionCourseProp: {},
      searchItems: [],
      // 快捷筛选
      quickScreening: null,
      fieldList: [],
      formData: [],
      typeEnum: {
        CARE: '托育',
        TEACH: '早教',
        GUARD: '幼儿园'
      },
      columns: [
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '年龄',
          prop: 'age'
        },
        {
          label: '学员状态',
          prop: 'statusName'
        },
        {
          label: '学员来源',
          prop: 'sourceName'
        },
        {
          label: '重要程度',
          prop: 'importanceName'
        },
        {
          label: '跟进人员',
          prop: 'followerName'
        },
        {
          label: '市场人员',
          prop: 'marketerName'
        },
        {
          label: '下次跟进时间',
          prop: 'nextFollowTime',
          width: '160'
        },
        {
          label: '最后跟进时间',
          prop: 'followTime',
          width: '160'
        },
        {
          label: '录入时间',
          prop: 'createTime'
        }
      ],
      tableData: { content: [] },
      // TODO 添加学员
      addChildVisible: false,
      // TODO 分配学员
      assignChildVisible: false,

      // 跟进人员
      followers: [],
      // 已选中的学员
      selected: [],
      childDetail: {
        visible: false,
        activeTab: 'follow',
        childId: '',
        childName: ''
      },
      // 市场人员
      markers: [],
      batchImportData: {
        visible: false
      },
      followData: {
        visible: false
      },
      flag: false,
      currentRow: {},
      target: null,
      showCall: false,
      deposit: {
        visible: false
      },
      tableData2: {
        content: []
      },
      tableData3: {
        content: []
      },
      showMessage: false,
      sendMessageData: {
        phone: '',
        childId: ''
      }
    }
  },
  computed: {},
  watch: {
    currentTab() {
      this.fieldList = []
      this.init()
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    kindergarten(row) {
      this.kindergartenParams = row
      this.$refs.kindergarten.show()
    },
    init() {
      // 未成交
      if (this.currentTab === 'UNSOLD') {
        queryChildList({
          pageNum: this.pageInfo.pageNum,
          pageSize: this.pageInfo.pageSize,
          quickScreening: this.quickScreening,
          category: 'UNSOLD',
          fieldList: this.fieldList
        }).then(res => {
          this.tableData = res.data
          this.tableData.content.forEach(item => {
            item.createTime = parseTime(item.createTime, '')
            item.followTime = item.followTime ? parseTime(item.followTime, '') : ''
            item.nextFollowTime = item.nextFollowTime ? parseTime(item.nextFollowTime, '') : ''
          })
        })
      }
      // 已成交
      if (this.currentTab === 'DEAL') {
        queryChildList({
          pageNum: this.pageInfo.pageNum,
          pageSize: this.pageInfo.pageSize,
          // quickScreening: this.quickScreening,
          category: 'DEAL',
          fieldList: this.fieldList
        }).then(res => {
          this.tableData2 = res.data
          this.tableData2.content.forEach(item => {
            item.createTime = parseTime(item.createTime, '')
            item.followTime = item.followTime ? parseTime(item.followTime, '') : ''
            item.nextFollowTime = item.nextFollowTime ? parseTime(item.nextFollowTime, '') : ''
            item.activationStatus = item.activationStatus ? '已激活' : '未激活'
            item.typeList = (item.typeList || '').split(',').map(cur => this.typeEnum[cur]).join('、')
          })
        })
      }

      if (this.currentTab === 'HISTORY') {
        queryChildList({
          pageNum: this.pageInfo.pageNum,
          pageSize: this.pageInfo.pageSize,
          // quickScreening: this.quickScreening,
          category: 'HISTORY',
          fieldList: this.fieldList
        }).then(res => {
          this.tableData3 = res.data
          this.tableData3.content.forEach(item => {
            item.createTime = parseTime(item.createTime, '')
            item.followTime = item.followTime ? parseTime(item.followTime, '') : ''
            item.nextFollowTime = item.nextFollowTime ? parseTime(item.nextFollowTime, '') : ''
            item.activationStatus = item.activationStatus ? '已激活' : '未激活'
            item.typeList = (item.typeList || '').split(',').map(cur => this.typeEnum[cur]).join('、')
          })
        })
      }
    },
    childLogUpdate() {
      this.$refs['childInfo'].updateStep()
    },
    getIds(e) {
      const require = {
        'TEACH': {
          'audi': createTeachAudi,
          'app': createTeachApp
        },
        'CARE': {
          'audi': createCreaAudi,
          'app': createCareApp
        }
      }
      let _ids = []
      if (e.classType === 'CARE') {
        _ids = e.ids
      } else {
        _ids = e.ids.map(cur => {
          return cur.courseManagementId
        })
      }

      require[e.classType][e.type](_ids, e.id).then(res => {
        this.$message.success(`新增${e.type === 'app' ? '约课' : '试听'}成功`)
      })
    },
    // 搜索条件
    handleSearch() {

    },
    showCourse(row, classType, type) {
      this.aboutCourseProp = {
        childId: row.id,
        childName: row.name,
        classType,
        type
      }

      this.$nextTick(() => {
        this.$refs['aboutCourse'].show()
      })
    },
    showCourseCase(row, classType, type) {
      this.auditionCourseProp = {
        childId: row.id,
        childName: row.name,
        classType,
        type
      }

      this.$nextTick(() => {
        this.$refs['auditionCourse'].show()
      })
    },
    // 快捷筛选
    searchChange(item) {
      this.quickScreening = item
      this.init()
    },
    // 应用设置
    setting() {
      this.$router.push({ name: 'childcareSetting2' })
    },
    // 快捷条件
    query(data) {
      console.log(data)
      this.fieldList = data
      this.pageInfo.pageNum = 1
      this.init()
    },
    fieldChange(data) {
      this.searchItems = data.map(item => {
        return {
          name: item.value,
          value: item.key
        }
      })
      this.searchItems.unshift({
        name: '全部',
        value: null
      })
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init(this.currenrQuery)
    },
    showAddChildVisible() {
      this.addChildVisible = true
    },
    changeCommand(command) {
      this[command]()
    },
    handleGiveUp() {
      this.$etmTip.init({
        type: 'error',
        title: `确认放弃学员？`,
        content: `放弃后将无法撤销，是否继续操作？`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          updateChildResourceStatus({ childIdList: this.selected.map(item => item.id) }).then(res => {
            this.$message.success('操作成功')
            this.$etmTip.close()
            this.init()
          })
        }
      })
      this.$etmTip.open()
    },
    handleNext(childId) {
      if (this.currentTab === 'UNSOLD') {
        let index = this.tableData.content.findIndex(item => item.id === childId)
        if (index >= 0 && index !== this.tableData.content.length - 1) {
          this.childDetail.childId = this.tableData.content[++index].id
        } else {
          this.$message.info('该学员是当前页的最后一位')
        }
      } else if (this.currentTab === 'DEAL') {
        let index = this.tableData2.content.findIndex(item => item.id === childId)
        if (index >= 0 && index !== this.tableData2.content.length - 1) {
          this.childDetail.childId = this.tableData2.content[++index].id
        } else {
          this.$message.info('该学员是当前页的最后一位')
        }
      } else if (this.currentTab === 'HISTORY') {
        let index = this.tableData3.content.findIndex(item => item.id === childId)
        if (index >= 0 && index !== this.tableData3.content.length - 1) {
          this.childDetail.childId = this.tableData3.content[++index].id
        } else {
          this.$message.info('该学员是当前页的最后一位')
        }
      }
    },
    prevChild(childId) {
      if (this.currentTab === 'UNSOLD') {
        let index = this.tableData.content.findIndex(item => item.id === childId)
        if (index > 0) {
          this.childDetail.childId = this.tableData.content[--index].id
        } else {
          this.$message.info('该学员是当前页的第一位')
        }
      } else if (this.currentTab === 'DEAL') {
        let index = this.tableData2.content.findIndex(item => item.id === childId)
        if (index > 0) {
          this.childDetail.childId = this.tableData2.content[--index].id
        } else {
          this.$message.info('该学员是当前页的第一位')
        }
      } else if (this.currentTab === 'HISTORY') {
        let index = this.tableData3.content.findIndex(item => item.id === childId)
        if (index > 0) {
          this.childDetail.childId = this.tableData3.content[--index].id
        } else {
          this.$message.info('该学员是当前页的第一位')
        }
      }
    },
    batchAssignManage() {
      this.$router.push({ name: 'newdaycare_assignBatch' })
    },
    batchImportManage() {
      this.$router.push({ name: 'newdaycare_importBatch' })
    },
    batchImport() {
      this.batchImportData.visible = true
    },
    // 批量删除学员
    batchRemove() {
      if (!this.selected.length) {
        this.$message.info('请先选择学员')
        return false
      }
      this.$etmTip.init({
        type: 'error',
        title: `确认删除学员？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          removeChildOnBatch({ childIdList: this.selected.map(item => item.id) }).then(res => {
            this.$message.success('操作成功')
            this.$etmTip.close()
            this.init()
          })
        }
      })
      this.$etmTip.open()
    },
    importConfirm() {
      const data = this.$refs.batchImport.submit()
      if (this.flag && data) {
        this.$message.info('请等待上传完成')
        return false
      }

      if (!data) {
        return false
      }

      this.flag = true
      const params = {
        source: data.source,
        batchNo: data.batchNo,
        category: data.category
      }

      uploadLoading = Loading.service({
        fullscreen: true,
        lock: true,
        customClass: 'etm-loading',
        // text: '数据加载中...',
        // spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,.1)'
      })

      uploadFileBatchImport({ file: data.file.raw, options: params }).then(res => {
        this.importCancel()
        // this.$message.success('操作成功')
        if (res.data.msg) {
          this.$etmTip.init({
            type: 'error',
            title: res.data.msg,
            content: '',
            confirmBtn: '确定',
            // cancelBtn: '取消',
            cancel: () => {
              this.$etmTip.close()
            },
            confirm: () => {
              this.$etmTip.close()
            }
          })
        } else {
          this.$etmTip.init({
            type: 'success',
            title: '批量导入成功',
            content: `导入成功数据${res.data.successCount}条，导入失败数据${res.data.failCount}条`,
            confirmBtn: '确定',
            // cancelBtn: '取消',
            cancel: () => {
              this.$etmTip.close()
            },
            confirm: () => {
              this.$etmTip.close()
            }
          })
        }
        this.$etmTip.open()
        this.init()
        uploadLoading.close()
        this.flag = false
      }).catch(res => {
        this.flag = false
        uploadLoading.close()
      })
    },
    importCancel() {
      this.batchImportData.visible = false
      this.$refs['batchImport'].reset()
      this.$refs['batchImport'].$refs['etmForm'].$children[0].resetFields()
    },
    // 添加学员
    handleAddChild() {
      // const data = this.$refs.addChildForm.submit()

      this.$refs.addChildForm.submit().then(data => {
        // console.log(res)
        data && createChild({ ...data, category: this.currentTab }).then(res => {
          this.addChildVisible = false
          this.$message.success('添加学员成功')
          this.init()
        })
      })
      // data && createChild({ ...data, category: this.currentTab }).then(res => {
      //   this.addChildVisible = false
      //   this.$message.success('添加学员成功')
      //   this.init()
      // })
    },

    // 表格多选
    handleSelectionChange(e) {
      this.selected = e
    },
    // 学员详情
    handleRowClick(row) {
      this.childDetail.visible = true
      this.childDetail.childId = row.id
      this.childDetail.childName = row.childName
    },
    // 分配学员
    submitAssignChild() {
      this.$refs.assignChild.submitAssignChild()
    },
    assignSuccess() {
      this.assignChildVisible = false
    },
    handleFollow(row) {
      this.followData.visible = true
      this.childDetail.childId = row.id
      // this.childDetail.childName = row.name
    },
    update() {
      this.pageInfo = {
        pageSize: 10,
        pageNum: 1
      }
      this.init()
      const childId = this.childDetail.childId
      // const childName = this.childDetail.childName
      this.childDetail.childId = ''
      // this.childDetail.childName = ''
      setTimeout(() => {
        this.childDetail.childId = childId
      }, 16)
    },
    handleCall(row, event) {
      console.log(row)
      this.currentRow = { ...row }
      this.currentRow.parentPhone = this.currentRow.parentPhone.split(',')
      this.currentRow.parentName = this.currentRow.parentName.split(',')
      if (Array.isArray(this.currentRow.parentName) && this.currentRow.parentName.length > 1) {
        this.target = event
        this.showCall = true
      } else {
        this.callPhone(this.currentRow.parentPhone.join(), this.currentRow.parentName.join())
      }
    },
    callPhone(telephone, name) {
      this.showCall = false

      this.$etmTip.init({
        type: 'warn',
        title: `确定要拨打给 ${name} ${telephone} 吗？`,
        content: `系统将在您确认拨打电话后自动为您拨号，请留意接听您的手机。`,
        confirmBtn: '拨打',
        cancelBtn: '取消',
        confirm: () => {
          createCall({ childId: this.currentRow.id, telephone }).then(res => {
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
    handleSms(row, event) {
      // this.currentRow = { ...row }
      // this.currentRow.parentPhone = this.currentRow.parentPhone.split(',')
      // this.currentRow.parentName = this.currentRow.parentName.split(',')
      // this.showMessage = true
      // console.log(row)

      this.sendMessageData.phone = row.parentPhone.split(',')
      this.sendMessageData.parentName = row.parentName.split(',')
      this.sendMessageData.childId = this.currentRow.id
      this.$refs.sendMessage.handleVisible(true)
    },
    handleSendMessage(phone) {
      this.sendMessageData.phone = phone
      this.sendMessageData.childId = this.currentRow.id
      this.$refs.sendMessage.handleVisible(true)
    },
    handleTry() {
    },
    handleBooking(row) {
      this.deposit.visible = true
      this.currentRow = row
    },
    addDepositConfirm() {
      const data = this.$refs.childDeposit.submit()
      if (!data) {
        return false
      }
      const { type, money, paymentType, dateCharge, remark } = data
      createDeposit({ type, money, paymentType, childId: this.currentRow.id, dateCharge, remark }).then(res => {
        this.$message.success('操作成功')
        this.deposit.visible = false
      })
    },
    handleSignUp(row) {
      this.signUpProp = { id: row.id, name: row.name, type: this.currentTab, signUpType: row.signUpType }

      this.$nextTick(() => {
        this.$refs['signup'].show()
      })
      // console.log(row)
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
}

.addChildren {
  ::v-deep {
    .el-dialog__body {
      margin-top: 16px;
    }
  }
}

.callLi {
  display: flex;
  align-items: center;
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

::v-deep .EtmDrawer-wrap {
  .EtmLayoutSplit-wrap {
    .layout-left {
      margin-right: 8px;
    }
  }
}

</style>
