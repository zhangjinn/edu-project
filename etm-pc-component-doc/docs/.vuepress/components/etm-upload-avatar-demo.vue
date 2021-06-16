<template>
  <div class="etm-upload-avatar-demo-wrap">
    <high-code :code="code" :description="description">
        <etm-upload-avatar
            v-model="avatar"
            resource-name="myresource"
            media-type="image"
            @success="success"
            :uploadFile="uploadFile"
        />

    </high-code>
    <params-table :table-data="attrTableData" />
  </div>
</template>
<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";
export default {
  name: 'etm-upload-avatar-demo',
  components: {HighCode, ParamsTable},
  data() {
    return {
      avatar: '',
      submitAvatar: '',
      code: `
      <template>
        <div>
          <etm-upload-avatar
            v-model="avatar"
            resource-name="myresource"
            media-type="image"
            @success="success"
            :uploadFile="uploadFile"
          />
        </div>
      </template>
      <script>
        export default {
          data() {
            return {
              avatar: '',
              submitAvatar: '',
            }
          },
          methods:{
            success(val, key, url) {
              this.avatar = url // 这里是用来回显的图片url
              this.submitAvatar = key // 这里是用于提交后台的图片url格式
            },
            uploadFile() {
              // 这里请引用@/api/base目录下的uploadFile函数
            }
          }
        }
      `,
      description: '用于上传用户头像的组件',
      attrTableData: [
        {
          param: 'value',
          description: '图片的url',
          type: 'String',
          option: '非空字符串',
          default: '-'
        },
        {
          param: 'btnText',
          description: '上传头像按钮的文本',
          type: 'String',
          option: '非空字符串',
          default: '更换头像'
        },
        {
          param: 'description',
          description: '上传头像的文件格式说明',
          type: 'String',
          option: '非空字符串',
          default: '仅支持.jpg/.png文件'
        },
        {
          param: 'resourceName',
          description: '资源的标识名称（必填）',
          type: 'String',
          option: '',
          default: '-'
        },
        {
          param: 'mediaType',
          description: '资源类型',
          type: 'String',
          option: 'image, video',
          default: 'image'
        },
        {
          param: 'type',
          description: '支持资源的文件类型',
          type: 'Array',
          option: 'jpeg, jpg, png',
          default: `['jpeg', 'jpg', 'png']`
        },
        {
          param: 'shape',
          description: '头像框的形状',
          type: 'String',
          option: 'circle, square',
          default: 'circle'
        },
        {
          param: 'uploadFile',
          description: '上传头像调用的api',
          type: 'Function',
          option: '请传入@/api/base目录下的uploadFile函数',
          default: '-'
        }
      ]
    }
  },
  computed:{
  },
  methods:{
    success(val, key, url) {
      this.avatar = url
      this.submitAvatar = key
    },
    uploadFile() {
      // 这里请引用@/api/base目录下的uploadFile函数
    }
  }
}
</script>

<style scoped>

</style>
