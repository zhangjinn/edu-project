<template>
  <div class="form-wrap">
    <div class="formContent">
      <div class="formList">
        <etm-title :show-line="false" :border="true" size="big">
          商户信息
          <span class="state">（{{ basicFinish ? '已完成' : '未完成' }}）</span><span class="must">*</span>
          <template slot="tool">
            <div v-if="isEdit" v-show="!showBasicEdit" class="editTxt" @click="edit('basic')">
              <span class="iconfont iconedit1" />编辑
            </div>
          </template>
        </etm-title>
        <div v-show="!showBasicEdit">
          <etm-form type="dialog">
            <el-form-item label="商户全称" required>
              <el-input :value="formData.merchantName || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="商户简称" required>
              <el-input :value="formData.abbreviation || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="公众号appid" required>
              <el-input :value="formData.subscribeAppid || '未填写'" disabled />
            </el-form-item>
          </etm-form>
        </div>
        <div v-show="showBasicEdit" class="formBox">
          <etm-form ref="basicForm" :model="basicData" :rules="rule" type="dialog">
            <el-form-item label="商户全称" prop="merchantName">
              <el-input v-model="basicData.merchantName" placeholder="请输入商户全称" />
            </el-form-item>
            <el-form-item label="商户简称" prop="abbreviation">
              <el-input v-model="basicData.abbreviation" placeholder="请输入商户简称" />
            </el-form-item>
            <el-form-item label="公众号appid" prop="subscribeAppid">
              <el-input v-model="basicData.subscribeAppid" placeholder="请输入微信公众号appid" />
            </el-form-item>
            <el-form-item>
              <div class="btnBox">
                <el-button type="primary" @click="save('basic')">保存</el-button>
                <el-button plain @click="cancel('basic')">取消</el-button>
              </div>
            </el-form-item>
          </etm-form>
        </div>
      </div>
      <div class="formList">
        <etm-title :show-line="false" :border="true" size="big">
          联系人信息
          <span class="state">（{{ contactFinish ? '已完成' : '未完成' }}）</span><span class="must">*</span>
          <template slot="tool">
            <div v-if="isEdit" v-show="!showContactEdit" class="editTxt" @click="edit('contact')">
              <span class="iconfont iconedit1" />编辑
            </div>
          </template>
        </etm-title>
        <div v-show="!showContactEdit">
          <etm-form type="dialog">
            <el-form-item label="联系人名称" required>
              <el-input :value="formData.name || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="联系人手机号" required>
              <el-input :value="formData.phone || '未填写'" disabled />
              <div class="warnBox">
                <span class="iconfont iconwarn" />
                用于修改登录密码及支付密码
              </div>
            </el-form-item>
            <el-form-item label="联系人邮箱" required>
              <el-input :value="formData.email || '未填写'" disabled />
              <div class="warnBox">
                <span class="iconfont iconwarn" />
                用于接收开户邮件
              </div>
            </el-form-item>
          </etm-form>
        </div>
        <div v-show="showContactEdit" class="formBox">
          <etm-form ref="contactForm" :model="contactData" :rules="rule" type="dialog">
            <el-form-item label="联系人名称" prop="name">
              <el-input v-model="contactData.name" placeholder="请输入联系人名称" />
            </el-form-item>
            <el-form-item label="联系人手机号" prop="phone">
              <el-input v-model="contactData.phone" placeholder="请输入联系人手机号" />
              <div class="warnBox">
                <span class="iconfont iconwarn" />
                用于修改登录密码及支付密码
              </div>
            </el-form-item>
            <el-form-item label="联系人邮箱" prop="email">
              <el-input v-model="contactData.email" placeholder="请输入联系人邮箱" />
              <div class="warnBox">
                <span class="iconfont iconwarn" />
                用于接收开户邮件
              </div>
            </el-form-item>
            <el-form-item>
              <div class="btnBox">
                <el-button type="primary" @click="save('contact')">保存</el-button>
                <el-button plain @click="cancel('contact')">取消</el-button>
              </div>
            </el-form-item>
          </etm-form>
        </div>
      </div>
      <div class="formList">
        <etm-title :show-line="false" :border="true" size="big">
          门店信息
          <span class="state">（{{ businessFinish ? '已完成' : '未完成' }}）</span><span class="must">*</span>
          <template slot="tool">
            <div v-if="isEdit" v-show="!showBusinessEdit" class="editTxt" @click="edit('business')">
              <span class="iconfont iconedit1" />编辑
            </div>
          </template>
        </etm-title>
        <div v-show="!showBusinessEdit">
          <etm-form type="dialog">
            <el-form-item label="商户类别" required>
              <el-input :value="formData.businessType || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="商户经营地址" required>
              <el-input :value="formData.area || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="详细地址" required>
              <el-input :value="formData.businessAddress || '未填写'" disabled />
              <div class="warnBox">
                <span class="iconfont iconwarn" />
                无需输入省市区
              </div>
            </el-form-item>
            <el-form-item label="商户客服电话" required>
              <el-input :value="formData.businessServiceTel || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="经营场所门头照" required>
              <div v-if="formData.businessPlaceDoorHead" class="imgBox">
                <div class="img">
                  <el-image
                    fit="cover"
                    :src="formData.businessPlaceDoorHead"
                    :preview-src-list="[formData.businessPlaceDoorHead]"
                  />
                </div>
              </div>
              <el-input v-else value="未填写" disabled />
            </el-form-item>
            <el-form-item label="经营场所内景照" required>
              <div v-if="formData.businessPlaceInterior" class="imgBox">
                <div class="img">
                  <el-image
                    fit="cover"
                    :src="formData.businessPlaceInterior"
                    :preview-src-list="[formData.businessPlaceInterior]"
                  />
                </div>
              </div>
              <el-input v-else value="未填写" disabled />
            </el-form-item>
          </etm-form>
        </div>
        <div v-show="showBusinessEdit" class="formBox">
          <etm-form ref="businessForm" :model="businessData" :rules="rule" type="dialog">
            <el-form-item label="商户类别" prop="businessType">
              <el-input v-model="businessData.businessType" placeholder="请输入商户类别" />
            </el-form-item>
            <el-form-item label="商户经营地址" prop="area">
              <div>
                <el-row :gutter="16" class="rowBox">
                  <el-col :span="8">
                    <el-select
                      v-model="businessData.area.provinceCode"
                      placeholder="选择省"
                      filterable
                      @change="getCity($event, 'change')"
                    >
                      <el-option
                        v-for="(province, i) in provinceList"
                        :key="i"
                        :label="province.name"
                        :value="province.code"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-select
                      v-model="businessData.area.cityCode"
                      placeholder="选择市"
                      filterable
                      @change="getCounty($event, 'change')"
                    >
                      <el-option v-for="(city, i) in cityList" :key="i" :label="city.name" :value="city.code" />
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-select
                      v-model="businessData.area.areaCode"
                      placeholder="选择县/区"
                      filterable
                      @change="$forceUpdate()"
                    >
                      <el-option
                        v-for="(county, i) in countyList"
                        :key="i"
                        :label="county.name"
                        :value="county.code"
                      />
                    </el-select>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item label="详细地址" prop="businessAddress">
              <el-input v-model="businessData.businessAddress" placeholder="请输入详细地址" />
              <div class="warnBox">
                <span class="iconfont iconwarn" />
                无需输入省市区
              </div>
            </el-form-item>
            <el-form-item label="商户客服电话" prop="businessServiceTel">
              <el-input v-model="businessData.businessServiceTel" placeholder="请输入商户客服电话" />
            </el-form-item>
            <el-form-item label="经营场所门头照" prop="businessPlaceDoorHead">
              <etm-upload-img
                resource-name="accountManage"
                :preview-src-list="businessData.businessPlaceDoorHeadSrc"
                :preview-src-key="businessData.businessPlaceDoorHead"
                :limit-number="1"
                :limit-size="5"
                limit-type="JPG"
                @getImgList="getPlaceDoorHead"
              />
            </el-form-item>
            <el-form-item label="经营场所内景照" prop="businessPlaceInterior">
              <etm-upload-img
                resource-name="accountManage"
                :preview-src-list="businessData.businessPlaceInteriorSrc"
                :preview-src-key="businessData.businessPlaceInterior"
                :limit-number="1"
                :limit-size="5"
                limit-type="JPG"
                @getImgList="getPlaceInterior"
              />
            </el-form-item>
            <el-form-item>
              <div class="btnBox">
                <el-button type="primary" @click="save('business')">保存</el-button>
                <el-button plain @click="cancel('business')">取消</el-button>
              </div>
            </el-form-item>
          </etm-form>
        </div>
      </div>
      <div v-if="type === 'COMPANY' || type === 'PERSONAL_COMPANY'" class="formList">
        <etm-title :show-line="false" :border="true" size="big">
          营业执照信息
          <span class="state">（{{ licenseFinish ? '已完成' : '未完成' }}）</span><span class="must">*</span>
          <template slot="tool">
            <div v-if="isEdit" v-show="!showLicenseEdit" class="editTxt" @click="edit('license')">
              <span class="iconfont iconedit1" />编辑
            </div>
          </template>
        </etm-title>
        <div v-show="!showLicenseEdit">
          <etm-form type="dialog">
            <el-form-item label="营业执照号码" required>
              <el-input :value="formData.licenseNumber || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="注册地址" required>
              <el-input :value="formData.licenseAddress || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="经营范围" required>
              <el-input :value="formData.licenseLimit || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="营业期限" required>
              <el-input :value="formData.licenseExpireDate || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="营业执照" required>
              <div v-if="formData.licensePhoto" class="imgBox">
                <div class="img">
                  <el-image
                    fit="cover"
                    :src="formData.licensePhoto"
                    :preview-src-list="[formData.licensePhoto]"
                  />
                </div>
              </div>
              <el-input v-else value="未填写" disabled />
            </el-form-item>
          </etm-form>
        </div>
        <div v-show="showLicenseEdit" class="formBox">
          <etm-form ref="licenseForm" :model="licenseData" :rules="rule" type="dialog">
            <el-form-item label="营业执照号码" prop="licenseNumber">
              <el-input v-model="licenseData.licenseNumber" placeholder="请输入营业执照号码" />
            </el-form-item>
            <el-form-item label="注册地址" prop="licenseAddress">
              <el-input v-model="licenseData.licenseAddress" placeholder="请输入注册地址" />
            </el-form-item>
            <el-form-item label="经营范围" prop="licenseLimit">
              <el-input v-model="licenseData.licenseLimit" placeholder="请输入经营范围" />
            </el-form-item>
            <el-form-item label="营业期限" prop="licenseExpireDate">
              <el-row class="rangeBox">
                <el-col :span="9">
                  <el-date-picker
                    v-model="licenseData.licenseExpireDate.beginTime"
                    type="date"
                    placeholder="开始日期"
                    :picker-options="LicStartOptions"
                    :clearable="false"
                    @change="confirmLicStart"
                  />
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="9">
                  <el-date-picker
                    v-model="licenseData.licenseExpireDate.endTime"
                    type="date"
                    placeholder="结束日期"
                    :disabled="licenseData.licenseExpireDate.check"
                    :picker-options="LicEndOptions"
                    @change="confirmLicEnd"
                  />
                </el-col>
                <el-col :span="4" class="checkBox">
                  <el-checkbox v-model="licenseData.licenseExpireDate.check">长期有效</el-checkbox>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="营业执照" prop="licensePhoto">
              <etm-upload-img
                resource-name="accountManage"
                :preview-src-list="licenseData.licenseSrc"
                :preview-src-key="licenseData.licensePhoto"
                :limit-number="1"
                :limit-size="5"
                limit-type="JPG"
                @getImgList="getLicensePhoto"
              />
            </el-form-item>
            <el-form-item>
              <div class="btnBox">
                <el-button type="primary" @click="save('license')">保存</el-button>
                <el-button plain @click="cancel('license')">取消</el-button>
              </div>
            </el-form-item>
          </etm-form>
        </div>
      </div>
      <div class="formList">
        <etm-title :show-line="false" :border="true" size="big">
          <template v-if="type === 'COMPANY'">法人身份信息</template>
          <template v-else-if="type === 'PERSONAL_COMPANY'">法人身份信息</template>
          <template v-else-if="type === 'PERSONAL'">经营者身份信息</template>
          <span class="state">（{{ registerFinish ? '已完成' : '未完成' }}）</span><span class="must">*</span>
          <template slot="tool">
            <div v-if="isEdit" v-show="!showRegisterEdit" class="editTxt" @click="edit('register')">
              <span class="iconfont iconedit1" />编辑
            </div>
          </template>
        </etm-title>
        <div v-show="!showRegisterEdit">
          <etm-form type="dialog">
            <el-form-item label="证件类型" required>
              <el-input :value="formData.IDcardType || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="证件号码" required>
              <el-input :value="formData.idCardNumber || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="证件名称" required>
              <el-input :value="formData.idCardName || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="证件有效期" required>
              <el-input :value="formData.IDExpireDate || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="证件照片(正)" required>
              <div v-if="formData.idCardFrontPhoto" class="imgBox">
                <div class="img">
                  <el-image
                    fit="cover"
                    :src="formData.idCardFrontPhoto"
                    :preview-src-list="[formData.idCardFrontPhoto]"
                  />
                </div>
              </div>
              <el-input v-else value="未填写" disabled />
            </el-form-item>
            <el-form-item label="证件照片(反)" required>
              <div v-if="formData.idCardBackPhoto" class="imgBox">
                <div class="img">
                  <el-image
                    fit="cover"
                    :src="formData.idCardBackPhoto"
                    :preview-src-list="[formData.idCardBackPhoto]"
                  />
                </div>
              </div>
              <el-input v-else value="未填写" disabled />
            </el-form-item>
          </etm-form>
        </div>
        <div v-show="showRegisterEdit" class="formBox">
          <etm-form ref="registerForm" :model="registerData" :rules="rule" type="dialog">
            <el-form-item label="证件类型" prop="IDcardType">
              <el-input v-model="registerData.IDcardType" disabled />
            </el-form-item>
            <el-form-item label="证件号码" prop="idCardNumber">
              <el-input v-model="registerData.idCardNumber" placeholder="请输入证件号码" />
            </el-form-item>
            <el-form-item label="证件名称" prop="idCardName">
              <el-input v-model="registerData.idCardName" placeholder="请输入证件的姓名" />
            </el-form-item>
            <el-form-item label="证件有效期" prop="IDExpireDate">
              <el-row class="rangeBox">
                <el-col :span="9">
                  <el-date-picker
                    v-model="registerData.IDExpireDate.startTime"
                    type="date"
                    placeholder="开始日期"
                    :picker-options="IDStartOptions"
                    :clearable="false"
                    @change="confirmIDStart"
                  />
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="9">
                  <el-date-picker
                    v-model="registerData.IDExpireDate.endTime"
                    type="date"
                    placeholder="结束日期"
                    :disabled="registerData.IDExpireDate.check"
                    :picker-options="IDEndOptions"
                    @change="confirmIDEnd"
                  />
                </el-col>
                <el-col :span="4" class="checkBox">
                  <el-checkbox v-model="registerData.IDExpireDate.check">长期有效</el-checkbox>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="证件照片(正)" prop="idCardFrontPhoto">
              <etm-upload-img
                resource-name="accountManage"
                :preview-src-list="registerData.idCardFrontSrc"
                :preview-src-key="registerData.idCardFrontPhoto"
                :limit-number="1"
                :limit-size="5"
                limit-type="JPG"
                @getImgList="getIdCardFrontPhoto"
              />
            </el-form-item>
            <el-form-item label="证件照片(反)" prop="idCardBackPhoto">
              <etm-upload-img
                resource-name="accountManage"
                :preview-src-list="registerData.idCardBackSrc"
                :preview-src-key="registerData.idCardBackPhoto"
                :limit-number="1"
                :limit-size="5"
                limit-type="JPG"
                @getImgList="getIdCardBackPhoto"
              />
            </el-form-item>
            <el-form-item>
              <div class="btnBox">
                <el-button type="primary" @click="save('register')">保存</el-button>
                <el-button plain @click="cancel('register')">取消</el-button>
              </div>
            </el-form-item>
          </etm-form>
        </div>
      </div>
      <div class="formList">
        <etm-title :show-line="false" :border="true" size="big">
          <template v-if="type === 'COMPANY'">结算信息</template>
          <template v-else-if="type === 'PERSONAL_COMPANY'">法人账户信息</template>
          <template v-else-if="type === 'PERSONAL'">结算信息</template>
          <span class="state">（{{ settleFinish ? '已完成' : '未完成' }}）</span><span class="must">*</span>
          <template slot="tool">
            <div v-if="isEdit" v-show="!showSettleEdit" class="editTxt" @click="edit('settle')">
              <span class="iconfont iconedit1" />编辑
            </div>
          </template>
        </etm-title>
        <div v-show="!showSettleEdit">
          <etm-form type="dialog">
            <el-form-item label="开户名称" required>
              <el-input :value="formData.openAccountName || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="银行账号" required>
              <el-input :value="formData.bankAccountNumber || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="开户银行" required>
              <el-input :value="formData.branchBankName || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="开户支行" required>
              <el-input :value="formData.openAccountBank || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="联行号" required>
              <el-input :value="formData.bankContactLine || '未填写'" disabled />
            </el-form-item>
            <el-form-item v-if="type === 'COMPANY' || type === 'PERSONAL_COMPANY'" label="对公账户证明文件">
              <div v-if="formData.openAccountLicensePhoto" class="imgBox">
                <div class="img">
                  <el-image
                    fit="cover"
                    :src="formData.openAccountLicensePhoto"
                    :preview-src-list="[formData.openAccountLicensePhoto]"
                  />
                </div>
              </div>
              <el-input v-else value="未填写" disabled />
            </el-form-item>
          </etm-form>
        </div>
        <div v-show="showSettleEdit" class="formBox">
          <etm-form ref="settleForm" :model="settleData" :rules="rule" type="dialog">
            <el-form-item label="开户名称" prop="openAccountName">
              <el-input v-model="settleData.openAccountName" placeholder="请输入开户名称" />
            </el-form-item>
            <el-form-item label="银行账号" prop="bankAccountNumber">
              <el-input v-model="settleData.bankAccountNumber" placeholder="请输入银行账号" />
            </el-form-item>
            <el-form-item label="开户银行" prop="branchBankName">
              <el-select
                v-model="settleData.branchBankName"
                filterable
                placeholder="请选择开户银行"
              >
                <el-option v-for="(bank, i) in bankList" :key="i" :label="bank" :value="bank" />
              </el-select>
            </el-form-item>
            <el-form-item label="开户支行" prop="openAccountBank">
              <el-input v-model="settleData.openAccountBank" placeholder="请输入开户支行" />
            </el-form-item>
            <el-form-item label="联行号" prop="bankContactLine">
              <el-input v-model="settleData.bankContactLine" placeholder="请输入联行号" />
            </el-form-item>
            <el-form-item v-if="type === 'COMPANY' || type === 'PERSONAL_COMPANY'" label="对公账户证明文件">
              <etm-upload-img
                resource-name="accountManage"
                :preview-src-list="settleData.openAccountLicenseSrc"
                :preview-src-key="settleData.openAccountLicensePhoto"
                :limit-number="1"
                :limit-size="5"
                limit-type="JPG"
                @getImgList="getOpenAccountLicensePhoto"
              />
            </el-form-item>
            <el-form-item>
              <div class="btnBox">
                <el-button type="primary" @click="save('settle')">保存</el-button>
                <el-button plain @click="cancel('settle')">取消</el-button>
              </div>
            </el-form-item>
          </etm-form>
        </div>
      </div>
      <div class="formList">
        <etm-title :show-line="false" :border="true" size="big">
          更多信息
          <span class="state">（{{ moreFinish ? '已完成' : '未完成' }}）</span>
          <template slot="tool">
            <div v-if="isEdit" v-show="!showMoreEdit" class="editTxt" @click="edit('more')">
              <span class="iconfont iconedit1" />编辑
            </div>
          </template>
        </etm-title>
        <div v-show="!showMoreEdit">
          <etm-form type="dialog">
            <el-form-item label="微信经营类目">
              <el-input :value="formData.value || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="支付宝经营类目">
              <el-input :value="formData.value || '未填写'" disabled />
            </el-form-item>
            <el-form-item label="银联商户简称">
              <el-input :value="formData.value || '未填写'" disabled />
            </el-form-item>
          </etm-form>
        </div>
        <div v-show="showMoreEdit" class="formBox">
          <etm-form type="dialog">
            <el-form-item label="微信经营类目">
              <div>
                <el-row :gutter="16" class="rowBox">
                  <el-col :span="6">
                    <el-select v-model="moreData.wechat">
                      <el-option v-for="(list, index) in wechatList" :key="index" :label="list" :value="list" />
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="moreData.wechat">
                      <el-option v-for="(list, index) in wechatList" :key="index" :label="list" :value="list" />
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="moreData.wechat">
                      <el-option v-for="(list, index) in wechatList" :key="index" :label="list" :value="list" />
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="moreData.wechat">
                      <el-option v-for="(list, index) in wechatList" :key="index" :label="list" :value="list" />
                    </el-select>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item label="支付宝经营类目">
              <div>
                <el-row :gutter="16" class="rowBox">
                  <el-col :span="6">
                    <el-select v-model="moreData.alipay">
                      <el-option v-for="(list, index) in alipayList" :key="index" :label="list" :value="list" />
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="moreData.alipay">
                      <el-option v-for="(list, index) in alipayList" :key="index" :label="list" :value="list" />
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="moreData.alipay">
                      <el-option v-for="(list, index) in alipayList" :key="index" :label="list" :value="list" />
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="moreData.alipay">
                      <el-option v-for="(list, index) in alipayList" :key="index" :label="list" :value="list" />
                    </el-select>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item label="银联商户简称">
              <el-input v-model="moreData.abbreviation" placeholder="请输入银联商户简称" />
            </el-form-item>
            <el-form-item>
              <div class="btnBox">
                <el-button type="primary" @click="save('more')">保存</el-button>
                <el-button plain @click="cancel('more')">取消</el-button>
              </div>
            </el-form-item>
          </etm-form>
        </div>
      </div>
    </div>
    <div v-if="isEdit" class="footerBtn">
      <el-button type="primary" @click="submitData">提交</el-button>
    </div>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/11/3 10:07
 */
import etmUploadImg from '@/components/EtmUploadImg'
import { getAreaByCode } from '@/api/area'
import {
  queryPaymentMerchantInfo,
  submitMerchantData,
  updateBasicData,
  updateBusinessData,
  updateContactData,
  updateLicenseData,
  updateRegisterData,
  updateSettleData
} from '@/api/base/accountManage'
import { validEmail, validPhoneNumber } from '@/utils/validate'
import { getBankList } from '@/api/collection'

export default {
  name: 'Index',
  components: {
    etmUploadImg
  },
  filters: {},
  mixins: [],
  props: {
    type: {
      type: String,
      default() {
        return null
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      accountId: 0,
      formData: {
        IDcardType: '身份证'
      },
      showBasicEdit: false,
      basicFinish: false,
      basicData: {}, // 商户信息
      showContactEdit: false,
      contactFinish: false,
      contactData: {}, // 联系人信息
      showBusinessEdit: false,
      businessFinish: false,
      businessData: { // 门店信息
        area: {}
      },
      showLicenseEdit: false,
      licenseFinish: false,
      licenseData: { // 法人身份信息
        licenseExpireDate: {}
      },
      showRegisterEdit: false,
      registerFinish: false,
      registerData: { // 结算信息/法人账户信息
        IDExpireDate: {}
      },
      showSettleEdit: false,
      settleFinish: false,
      settleData: {}, // 更多信息
      showMoreEdit: false,
      moreFinish: false,
      moreData: {}, // 更多信息
      rule: { // 验证规则
        merchantName: [{ required: true, message: '商户全称不能为空', trigger: 'blur' }],
        abbreviation: [{ required: true, message: '商户简称不能为空', trigger: 'blur' }],
        subscribeAppid: [{ required: true, message: '公众号appid不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '联系人名称不能为空', trigger: 'blur' }],
        phone: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('联系人手机号不能为空'))
            } else if (!validPhoneNumber(value)) {
              callback(new Error('手机号码格式错误'))
            } else {
              callback()
            }
          }
        }],
        email: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('联系人邮箱不能为空'))
            } else if (!validEmail(value)) {
              callback(new Error('邮箱格式错误'))
            } else {
              callback()
            }
          }
        }],
        businessType: [{ required: true, message: '商户类别不能为空', trigger: 'blur' }],
        area: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!value.provinceCode) {
              callback(new Error('省份不能为空'))
            } else if (!value.cityCode) {
              callback(new Error('市不能为空'))
            } else if (!value.areaCode) {
              callback(new Error('区县不能为空'))
            } else {
              callback()
            }
          }
        }],
        businessAddress: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
        businessServiceTel: [{ required: true, message: '客服电话不能为空', trigger: 'blur' }],
        businessPlaceDoorHead: [{ required: true, message: '门头照不能为空', trigger: 'change' }],
        businessPlaceInterior: [{ required: true, message: '内景照不能为空', trigger: 'change' }],
        licenseNumber: [{ required: true, message: '营业执照号码不能为空', trigger: 'blur' }],
        licenseAddress: [{ required: true, message: '注册地址不能为空', trigger: 'blur' }],
        licenseLimit: [{ required: true, message: '经营范围不能为空', trigger: 'blur' }],
        licenseExpireDate: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!value.beginTime) {
              callback(new Error('选择开始日期'))
            } else if (!value.check && !value.endTime) {
              callback(new Error('选择结束日期'))
            } else {
              callback()
            }
          }
        }],
        licensePhoto: [{ required: true, message: '营业执照照片不能为空', trigger: 'change' }],
        IDcardType: [{ required: true, message: '证件类型不能为空', trigger: 'blur' }],
        idCardNumber: [{ required: true, message: '证件号码不能为空', trigger: 'blur' }],
        idCardName: [{ required: true, message: '证件名称不能为空', trigger: 'blur' }],
        IDExpireDate: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!value.startTime) {
              callback(new Error('选择开始日期'))
            } else if (!value.check && !value.endTime) {
              callback(new Error('选择结束日期'))
            } else {
              callback()
            }
          }
        }],
        idCardFrontPhoto: [{ required: true, message: '身份照正面不能为空', trigger: 'change' }],
        idCardBackPhoto: [{ required: true, message: '身份照反面不能为空', trigger: 'change' }],
        openAccountName: [{ required: true, message: '开户名称不能为空', trigger: 'blur' }],
        bankAccountNumber: [{ required: true, message: '银行账号不能为空', trigger: 'blur' }],
        branchBankName: [{ required: true, message: '开户银行不能为空', trigger: 'change' }],
        openAccountBank: [{ required: true, message: '开户支行不能为空', trigger: 'blur' }],
        bankContactLine: [{ required: true, message: '联行号不能为空', trigger: 'blur' }]
      },
      provinceList: [], // 省列表
      provinceSelectCode: '', // 暂存的省编码
      cityList: [], // 市列表
      citySelectCode: '', // 暂存的市编码
      countyList: [], // 区列表
      bankList: [], // 银行列表
      bankType: '', // 暂存的银行类型
      bankLineList: [], // 分行列表
      LicStartOptions: {}, // 营业执照开始时间限制
      LicEndOptions: {}, // 营业执照结束时间限制
      IDStartOptions: {}, // 身份证开始时间限制
      IDEndOptions: {}, // 身份证结束时间限制
      wechatList: [],
      alipayList: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getAccountData()
  },
  methods: {
    getAccountData() {
      queryPaymentMerchantInfo().then(res => {
        const { data } = res
        this.$emit('getState', data.state)
        if (data.id) {
          this.accountId = data.id
        }
        const formData = {}
        if (data.merchantName) { // 商户信息
          this.basicFinish = true
          formData.merchantName = data.merchantName
          formData.abbreviation = data.abbreviation
          formData.subscribeAppid = data.subscribeAppid
        }
        if (data.contactInfo) { // 联系人信息
          this.contactFinish = true
          formData.name = data.contactInfo.name
          formData.phone = data.contactInfo.phone
          formData.email = data.contactInfo.email
        }
        if (data.businessInfo) { // 门店信息
          this.businessFinish = true
          formData.businessType = data.businessInfo.businessType
          formData.provinceCode = data.businessInfo.provinceCode
          formData.cityCode = data.businessInfo.cityCode
          formData.areaCode = data.businessInfo.areaCode
          formData.businessAddress = data.businessInfo.businessAddress
          formData.businessServiceTel = data.businessInfo.businessServiceTel
          formData.businessPlaceDoorHead	 = data.businessInfo.businessPlaceDoorHead
          formData.businessPlaceInterior = data.businessInfo.businessPlaceInterior
        }
        if (data.businessLicenseInfo) { // 营业执照信息
          this.licenseFinish = true
          formData.licenseName = data.businessLicenseInfo.licenseName
          formData.licenseNumber = data.businessLicenseInfo.licenseNumber
          formData.licenseAddress = data.businessLicenseInfo.licenseAddress
          formData.licenseLimit = data.businessLicenseInfo.licenseLimit
          formData.licensePhoto = data.businessLicenseInfo.licensePhoto
          formData.licenseBeginTime = data.businessLicenseInfo.beginTime
          formData.licenseEndTime = data.businessLicenseInfo.endTime
          if (data.businessLicenseInfo.endTime) {
            formData.licenseCheck = false
          } else {
            formData.licenseCheck = true
          }
        }
        if (data.idCardInfo) { // 法人身份信息
          this.registerFinish = true
          formData.idCardName = data.idCardInfo.idCardName
          formData.idCardNumber = data.idCardInfo.idCardNumber
          formData.registerBeginTime = data.idCardInfo.beginTime
          formData.registerEndTime = data.idCardInfo.endTime
          formData.idCardFrontPhoto = data.idCardInfo.idCardFrontPhoto
          formData.idCardBackPhoto = data.idCardInfo.idCardBackPhoto
          if (data.idCardInfo.endTime) {
            formData.registerCheck = false
          } else {
            formData.registerCheck = true
          }
        }
        if (data.settlementInfo) { // 结算信息
          this.settleFinish = true
          formData.openAccountName = data.settlementInfo.openAccountName
          formData.bankAccountNumber = data.settlementInfo.bankAccountNumber
          formData.branchBankName = data.settlementInfo.branchBankName
          formData.openAccountBank = data.settlementInfo.openAccountBank
          formData.bankContactLine = data.settlementInfo.bankContactLine
          formData.openAccountLicensePhoto = data.settlementInfo.openAccountLicensePhoto
        }
        this.formData = formData
      })
    },
    getProvince() { // 根据省份列表
      getAreaByCode().then(res => {
        this.provinceList = res.data
      })
    },
    getCity(value, type) { // 根据省的code获取市列表
      if (this.provinceSelectCode !== value) {
        if (this.provinceSelectCode && type === 'change') {
          this.businessData.area.city = ''
          this.businessData.area.county = ''
          this.countyList = []
        }
        this.provinceSelectCode = value
        const param = {
          code: value
        }
        getAreaByCode(param).then(res => {
          this.cityList = res.data
        })
      }
    },
    getCounty(value, type) { // 根据市的code获取县/区列表
      if (this.citySelectCode !== value) {
        if (this.citySelectCode && type === 'change') {
          this.businessData.area.county = ''
        }
        this.citySelectCode = value
        const param = {
          code: value
        }
        getAreaByCode(param).then(res => {
          this.countyList = res.data
        })
      }
    },
    getBank() { // 银行列表
      getBankList().then(res => {
        this.bankList = res.data
      })
    },
    getBankLine() {
      const param = {}
      getBankList(param).then(res => {
        this.bankLineList = res.data
      })
    },
    edit(type) {
      if (type === 'basic') { // 编辑商户信息
        this.basicData = { // 商户信息重新赋值
          merchantName: this.formData.merchantName,
          abbreviation: this.formData.abbreviation,
          subscribeAppid: this.formData.subscribeAppid
        }
        this.showBasicEdit = true
        this.$nextTick(() => { // 清空验证
          this.$refs.basicForm.$children[0].clearValidate()
        })
      } else if (type === 'contact') { // 编辑联系人信息
        this.contactData = { // 联系人信息重新赋值
          name: this.formData.name,
          phone: this.formData.phone,
          email: this.formData.email
        }
        this.showContactEdit = true
        this.$nextTick(() => { // 清空验证
          this.$refs.contactForm.$children[0].clearValidate()
        })
      } else if (type === 'business') { // 编辑门店信息
        this.getProvince()
        this.businessData = { // 门店信息重新赋值
          businessType: this.formData.businessType,
          area: {
            provinceCode: this.formData.provinceCode,
            cityCode: this.formData.cityCode,
            areaCode: this.formData.areaCode
          },
          businessAddress: this.formData.businessAddress,
          businessServiceTel: this.formData.businessServiceTel,
          businessPlaceDoorHeadSrc: [],
          businessPlaceDoorHead: [],
          businessPlaceInteriorSrc: [],
          businessPlaceInterior: []
        }
        if (this.formData.businessPlaceDoorHead) {
          this.businessData.businessPlaceDoorHeadSrc.push(this.formData.businessPlaceDoorHead)
          this.businessData.businessPlaceDoorHead.push(this.formData.businessPlaceDoorHead)
        }
        if (this.formData.businessPlaceInterior) {
          this.businessData.businessPlaceInteriorSrc.push(this.formData.businessPlaceInterior)
          this.businessData.businessPlaceInterior.push(this.formData.businessPlaceInterior)
        }
        this.showBusinessEdit = true
        this.$nextTick(() => { // 清空验证
          this.$refs.businessForm.$children[0].clearValidate()
        })
      } else if (type === 'license') { // 编辑营业执照信息
        this.licenseData = { // 营业执照信息重新赋值
          licenseNumber: this.formData.licenseNumber,
          licenseAddress: this.formData.licenseAddress,
          licenseLimit: this.formData.licenseLimit,
          licenseExpireDate: {
            beginTime: this.formData.licenseBeginTime,
            endTime: this.formData.licenseEndTime,
            ckeck: this.formData.licenseCheck
          },
          licenseSrc: [],
          licensePhoto: []
        }
        if (this.formData.licensePhoto) {
          this.licenseData.licenseSrc.push(this.formData.licensePhoto)
          this.licenseData.licensePhoto.push(this.formData.licensePhoto)
        }
        this.showLicenseEdit = true
        this.$nextTick(() => { // 清空验证
          this.$refs.licenseForm.$children[0].clearValidate()
        })
      } else if (type === 'register') { // 编辑法人身份信息
        this.registerData = { // 法人身份信息重新赋值
          IDcardType: this.formData.IDcardType,
          idCardNumber: this.formData.idCardNumber,
          idCardName: this.formData.idCardName,
          IDExpireDate: {
            beginTime: this.formData.registerBeginTime,
            endTime: this.formData.registerEndTime,
            ckeck: this.formData.registerCheck
          },
          idCardFrontSrc: [],
          idCardFrontPhoto: [],
          idCardBackSrc: [],
          idCardBackPhoto: []
        }
        if (this.formData.idCardFrontPhoto) {
          this.registerData.idCardFrontSrc.push(this.formData.idCardFrontPhoto)
          this.registerData.idCardFrontPhoto.push(this.formData.idCardFrontPhoto)
        }
        if (this.formData.idCardBackPhoto) {
          this.registerData.idCardBackSrc.push(this.formData.idCardBackPhoto)
          this.registerData.idCardBackPhoto.push(this.formData.idCardBackPhoto)
        }
        this.showRegisterEdit = true
        this.$nextTick(() => { // 清空验证
          this.$refs.registerForm.$children[0].clearValidate()
        })
      } else if (type === 'settle') { // 编辑结算信息
        this.getBank()
        this.settleData = { // 结算信息重新赋值
          openAccountName: this.formData.openAccountName,
          bankAccountNumber: this.formData.bankAccountNumber,
          branchBankName: this.formData.branchBankName,
          openAccountBank: this.formData.openAccountBank,
          bankContactLine: this.formData.bankContactLine,
          openAccountLicenseSrc: [],
          openAccountLicensePhoto: []
        }
        if (this.formData.openAccountLicensePhoto) {
          this.settleData.openAccountLicenseSrc.push(this.formData.openAccountLicensePhoto)
          this.settleData.openAccountLicensePhoto.push(this.formData.openAccountLicensePhoto)
        }
        this.showSettleEdit = true
        this.$nextTick(() => { // 清空验证
          this.$refs.settleForm.$children[0].clearValidate()
        })
      } else if (type === 'more') { // 编辑更多信息
        this.showMoreEdit = true
      }
    },
    cancel(type) { // 取消编辑
      if (type === 'basic') { // 商户信息
        this.showBasicEdit = false
      } else if (type === 'contact') { // 联系人信息
        this.showContactEdit = false
      } else if (type === 'business') { // 门店信息
        this.showBusinessEdit = false
      } else if (type === 'license') { // 营业执照信息
        this.showLicenseEdit = false
      } else if (type === 'register') { // 法人身份信息
        this.showRegisterEdit = false
      } else if (type === 'settle') { // 结算信息/法人账户信息
        this.showSettleEdit = false
      } else if (type === 'more') { // 更多信息
        this.showMoreEdit = false
      }
    },
    save(type) { // 保存编辑
      if (type === 'basic') { // 商户信息验证
        this.$refs.basicForm.$children[0].validate(valid => {
          if (valid) {
            const param = {
              id: this.accountId,
              merchantName: this.basicData.merchantName,
              abbreviation: this.basicData.abbreviation,
              subscribeAppid: this.basicData.subscribeAppid
            }
            updateBasicData(param).then(res => {
              this.accountId = res.data.id
              this.$message.success('保存成功')
              this.showBasicEdit = false
              this.basicFinish = true
              this.getAccountData()
            })
          }
        })
      } else if (type === 'contact') { // 联系人信息验证
        this.$refs.contactForm.$children[0].validate(valid => {
          if (valid) {
            const param = {
              id: this.accountId,
              name: this.contactData.name,
              phone: this.contactData.phone,
              email: this.contactData.email
            }
            updateContactData(param).then(res => {
              this.accountId = res.data.id
              this.$message.success('保存成功')
              this.showContactEdit = false
              this.contactFinish = true
              this.getAccountData()
            })
          }
        })
      } else if (type === 'business') { // 门店信息验证
        this.$refs.businessForm.$children[0].validate(valid => {
          if (valid) {
            const param = {
              id: this.accountId,
              areaCode: this.businessData.area.areaCode,
              provinceCode: this.businessData.area.provinceCode,
              cityCode: this.businessData.area.cityCode,
              businessPlaceInterior: this.businessData.businessPlaceInterior[0],
              businessType: this.businessData.businessType,
              businessAddress: this.businessData.businessAddress,
              businessPlaceDoorHead: this.businessData.businessPlaceDoorHead[0],
              businessServiceTel: this.businessData.businessServiceTel
            }
            updateBusinessData(param).then(res => {
              this.accountId = res.data.id
              this.$message.success('保存成功')
              this.showBusinessEdit = false
              this.businessFinish = true
              this.getAccountData()
            })
          }
        })
      } else if (type === 'license') { // 营业执照信息验证
        this.$refs.licenseForm.$children[0].validate(valid => {
          if (valid) {
            const param = {
              id: this.accountId,
              licensePhoto: this.licenseData.licensePhoto[0],
              licenseLimit: this.licenseData.licenseLimit,
              licenseNumber: this.licenseData.licenseNumber,
              licenseName: this.licenseData.licenseName,
              beginTime: this.licenseData.licenseExpireDate.beginTime,
              endTime: this.licenseData.licenseExpireDate.endTime,
              licenseAddress: this.licenseData.licenseAddress
            }
            updateLicenseData(param).then(res => {
              this.accountId = res.data.id
              this.$message.success('保存成功')
              this.showLicenseEdit = false
              this.licenseFinish = true
              this.getAccountData()
            })
          }
        })
      } else if (type === 'register') { // 法人身份信息验证
        this.$refs.registerForm.$children[0].validate(valid => {
          if (valid) {
            const param = {
              id: this.accountId,
              idCardFrontPhoto: this.registerData.idCardFrontPhoto[0],
              idCardBackPhoto: this.registerData.idCardBackPhoto[0],
              idCardName: this.registerData.idCardName,
              idCardNumber: this.registerData.idCardNumber,
              beginTime: this.registerData.IDExpireDate.beginTime,
              endTime: this.registerData.IDExpireDate.endTime
            }
            updateRegisterData(param).then(res => {
              this.accountId = res.data.id
              this.$message.success('保存成功')
              this.showRegisterEdit = false
              this.registerFinish = true
              this.getAccountData()
            })
          }
        })
      } else if (type === 'settle') { // 结算信息验证
        this.$refs.settleForm.$children[0].validate(valid => {
          if (valid) {
            const param = {
              id: this.accountId,
              bankContactLine: this.settleData.bankContactLine,
              openAccountLicensePhoto: this.settleData.openAccountLicensePhoto[0],
              openAccountName: this.settleData.openAccountName,
              branchBankName: this.settleData.branchBankName,
              bankAccountNumber: this.settleData.bankAccountNumber,
              openAccountBank: this.settleData.openAccountBank
            }
            updateSettleData(param).then(res => {
              this.accountId = res.data.id
              this.$message.success('保存成功')
              this.showSettleEdit = false
              this.settleFinish = true
              this.getAccountData()
            })
          }
        })
      } else if (type === 'more') { // 更多信息编辑不需验证
        const param = {
          id: this.accountId
        }
        console.log(param)
        this.showMoreEdit = false
      }
    },
    getPlaceDoorHead(val, key) { // 经营场所门头照
      this.businessData.businessPlaceDoorHeadSrc = val
      this.businessData.businessPlaceDoorHead = key
      this.$refs.businessForm.$children[0].validateField('businessPlaceDoorHead')
    },
    getPlaceInterior(val, key) { // 经营场所内景照
      this.businessData.businessPlaceInteriorSrc = val
      this.businessData.businessPlaceInterior = key
      this.$refs.businessForm.$children[0].validateField('businessPlaceInterior')
    },
    getLicensePhoto(val, key) { // 营业执照
      this.licenseData.licenseSrc = val
      this.licenseData.licensePhoto = key
      this.$refs.licenseForm.$children[0].validateField('licensePhoto')
    },
    getIdCardFrontPhoto(val, key) { // 证件照片(正面)
      this.registerData.idCardFrontSrc = val
      this.registerData.idCardFrontPhoto = key
      this.$refs.registerForm.$children[0].validateField('idCardFrontPhoto')
    },
    getIdCardBackPhoto(val, key) { // 证件照片(反面)
      this.registerData.idCardBackSrc = val
      this.registerData.idCardBackPhoto = key
      this.$refs.registerForm.$children[0].validateField('idCardBackPhoto')
    },
    getOpenAccountLicensePhoto(val, key) { // 证明文件
      this.settleData.openAccountLicenseSrc = val
      this.settleData.openAccountLicensePhoto = key
    },
    confirmLicStart(date) { // 限制营业执照有效期结束日期的选择
      this.LicEndOptions = {
        disabledDate(time) {
          return time.getTime() < new Date(date).getTime()
        }
      }
    },
    confirmLicEnd(date) { // 限制营业执照有效期开始日期的选择
      this.LicStartOptions = {
        disabledDate(time) {
          return time.getTime() > new Date(date).getTime()
        }
      }
    },
    confirmIDStart(date) { // 限制证件有效期结束日期的选择
      this.IDEndOptions = {
        disabledDate(time) {
          return time.getTime() < new Date(date).getTime()
        }
      }
    },
    confirmIDEnd(date) { // 限制证件有效期开始日期的选择
      this.IDStartOptions = {
        disabledDate(time) {
          return time.getTime() > new Date(date).getTime()
        }
      }
    },
    submitData() { // 提交进件信息
      if (!this.basicFinish) {
        this.$message.warning('商户信息未完成')
      } else if (!this.contactFinish) {
        this.$message.warning('联系人信息未完成')
      } else if (!this.businessFinish) {
        this.$message.warning('门店信息未完成')
      } else if (!this.licenseFinish && this.type !== 'PERSONAL') {
        this.$message.warning('营业执照信息未完成')
      } else if (!this.registerFinish) {
        if (this.type === 'PERSONAL') {
          this.$message.warning('经营者身份信息')
        } else {
          this.$message.warning('法人身份信息未完成')
        }
      } else if (!this.settleFinish) {
        if (this.type === 'PERSONAL_COMPANY') {
          this.$message.warning('法人账户信息未完成')
        } else {
          this.$message.warning('结算信息未完成')
        }
      } else {
        const param = {
          type: 'EFPS',
          merchantType: this.type
        }
        if (this.accountId) {
          param.id = this.accountId
        }
        submitMerchantData(param).then(() => {
          this.$message.success('提交成功')
          this.getAccountData()
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.form-wrap {
  .formContent {
    padding-top: 40px;
    width: 800px;

    .formList {
      padding-bottom: 16px;

      .state {
        font-size: 16px;
      }

      .must {
        font-size: 16px;
        @include c_error_color();
      }

      .editTxt {
        width: 60px;
        @include c_secondary_color();
        cursor: pointer;

        &:hover {
          @include etm_color();
        }
      }

      .formBox {
        .btnBox {
          .el-button{
            & + .el-button{
              margin-left: 8px;
            }
          }
        }
      }

      .rangeBox {
        .el-date-editor.el-input {
          width: 100%;
        }
      }

      .line {
        text-align: center;
      }

      .checkBox {
        padding-left: 16px;
      }

      .rowBox {
        display: flex;

        .el-select {
          width: 100%;
        }
      }

      .imgBox {
        .img {
          width: 80px;
          height: 80px;
          border-radius: 2px;
          overflow: hidden;

          .el-image {
            width: 100%;
            height: 100%;
          }
        }
      }

      ::v-deep .el-input {
        &.is-disabled {
          .el-input__inner {
            @include c_text_color();
            cursor: not-allowed;
            pointer-events: none;
          }
        }
      }

      ::v-deep .el-form-item {
        .el-form-item__label {
          width: 130px !important;
        }

        .el-form-item__content {
          margin-left: 130px !important;

          & > div {
            width: 450px;

            &.warnBox {
              position: absolute;
              top: 0;
              left: 460px;
              display: flex;
              width: 220px;
              @include c_secondary_color();
            }
          }
        }
      }
    }
  }

  .footerBtn {
    padding: 16px 0 16px 130px;
    border-top: 1px solid;
    @include bc_divide_color();

    .el-button {
      width: 98px;
    }
  }
}
</style>
