<template>
  <div class="tpl-wrap">
    <etm-layout-split>
      <div slot="header">
        <el-tabs :tab-position="tabPosition">
          <el-tab-pane label="短信模板">

            <etm-table-page
              :columns="columns"
              :data="tableData"
              index-type="index"
              border
              @currentChange="currentChange"
            >

              <etm-table-tool-bar slot="tool">
                <el-input suffix-icon="el-icon-search" placeholder="请输入搜索内容" />

                <el-button slot="right" @click="showPop = true">新建模板</el-button>

              </etm-table-tool-bar>

              <el-table-column slot="right" label="操作" width="180">
                <template>
                  <etm-text type="primary">编辑</etm-text>
                  <etm-text type="primary">删除</etm-text>
                </template>
              </el-table-column>
            </etm-table-page>
          </el-tab-pane>
          <el-tab-pane label="短信签名">
            <template v-if="true">
              <etm-form type="small">
                <el-form-item label="短信签名" required="true">
                  <el-input placeholder="请输入公司或产品名称" />
                </el-form-item>
                <el-form-item label="营业执照" required="true">
                  <etm-upload-image :preview-src-list="[]" resource-name="img" />
                </el-form-item>
                <el-form-item label="门头照" required="true">
                  <etm-upload-image :preview-src-list="[]" resource-name="img" />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input type="textarea" :rows="6" placeholder="请简述使用场景，以便快速通过审核" />

                </el-form-item>
                <el-form-item>
                  <div>
                    <el-checkbox v-model="checked" />
                    已阅读并同意
                    <el-button type="text">《承诺保证书》</el-button>
                  </div>
                </el-form-item>
              </etm-form>
              <etm-form-foot @save="save" @canvel="cancel" />
            </template>

            <template v-if="false">

              <etm-form type="small">
                <el-form-item label="">
                  <template>
                    <etm-text type="danger">审核中，预计3个工作日完成审核。</etm-text>
                  </template>
                  <template v-if="false">
                    <etm-text type="danger">审核通过，短信功能已开通。</etm-text>
                  </template>
                  <template v-if="false">
                    <etm-text type="danger">审核失败，公司名称不合法。</etm-text>
                  </template>

                </el-form-item>
                <el-form-item label="短信签名" required="true">
                  请输入公司或产品名称
                </el-form-item>
                <el-form-item label="营业执照" required="true">
                  <img src="http://placehold.it/200x200" width="100" height="100" alt="">
                </el-form-item>
                <el-form-item label="门头照" required="true">
                  <img src="http://placehold.it/200x200" width="100" height="100" alt="">
                </el-form-item>
                <el-form-item label="备注">
                  请简述使用场景，以便快速通过审核

                </el-form-item>
                <el-form-item label="">
                  <div>
                    <el-checkbox v-model="checked" disabled checked />
                    已阅读并同意
                    <el-button type="text">《承诺保证书》</el-button>
                  </div>
                </el-form-item>
              </etm-form>
              <!--              <etm-form-foot @save="save" @canvel="cancel"/>-->
            </template>

          </el-tab-pane>

        </el-tabs>
      </div>
    </etm-layout-split>

    <etm-pop
      :visible="showPop"
      pop="simple"
      cancel-btn="取消"
      title="新建模板"
      @open="showPop = true"
      @close="showPop = false"
      @confirm="showPop = false"
      @cancel="showPop = false"
    >
      <div class="smsPop">
        <el-form ref="form" label-width="80px">
          <el-form-item label="模板名称" required="“true”">
            <el-input placeholder="请输入模板名称" />
          </el-form-item>
          <el-form-item label="模板内容" required="“true”">
            <el-input type="textarea" placeholder="请填写内容" :rows="3" />
          </el-form-item>
        </el-form>
      </div>
    </etm-pop>

  </div>

</template>

<script>
/**
 * tpl create by Administrator
 * createTime 2020/8/27 16:00
 */

import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import EtmUploadImage from '@/components/EtmUploadImg/index'

export default {
  name: 'Tpl',
  components: {
    EtmUploadImage,
    EtmPop
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      showPop: false,
      tabPosition: 'left',
      columns: [
        {
          label: '模板名称',
          prop: 'actualAmount'

        },
        {
          label: '模板内容',
          prop: 'actualAmount'

        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.tpl-wrap {
  margin-top: 16px;
}
</style>
