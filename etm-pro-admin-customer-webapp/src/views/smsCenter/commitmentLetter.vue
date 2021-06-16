<!--suppress ALL -->
<template>
  <div
    class="commitmentLetter-wrap"
    v-html="agreementHTML"
  />
</template>

<script>/**
 * commitmentLetter create by Administrator
 * createTime 2020/09/10 10:03
 */
import { queryAgreementByType } from '@/api/base/base'

export default {
  name: 'CommitmentLetter',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      agreementHTML: ''
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    queryAgreementByType('bpcPromiseAgreement').then(res => {
      this.agreementHTML = res.data
    })
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.commitmentLetter-wrap {
  @font-face {
    font-family: 'Times New Roman';
  }

  @font-face {
    font-family: '宋体';
  }

  @font-face {
    font-family: 'Wingdings';
  }

  @font-face {
    font-family: 'Courier New';
  }

  @font-face {
    font-family: 'Calibri';
  }

  @font-face {
    font-family: '华文仿宋';
  }

  @list l0:level1 {
    font-family: 宋体;
    margin-left: 36pt;
    mso-level-number-format: decimal;
    mso-level-number-position: left;
    mso-level-suffix: tab;
    mso-level-tab-stop: 36pt;
    mso-level-text: '%1.';
    text-indent: -19pt;
  }

  @list l0:level2 {
    font-family: 'Courier New';
    font-size: 10pt;
    margin-left: 72pt;
    mso-level-number-format: bullet;
    mso-level-number-position: left;
    mso-level-suffix: tab;
    mso-level-tab-stop: 72pt;
    mso-level-text: \6F;
    text-indent: -18pt;
  }

  @list l0:level3 {
    font-family: 宋体;
    margin-left: 108pt;
    mso-level-number-format: decimal;
    mso-level-number-position: left;
    mso-level-suffix: tab;
    mso-level-tab-stop: 108pt;
    mso-level-text: '%3.';
    text-indent: -18pt;
  }

  @list l0:level4 {
    font-family: 宋体;
    margin-left: 144pt;
    mso-level-number-format: decimal;
    mso-level-number-position: left;
    mso-level-suffix: tab;
    mso-level-tab-stop: 144pt;
    mso-level-text: '%4.';
    text-indent: -18pt;
  }

  @list l0:level5 {
    font-family: 宋体;
    margin-left: 180pt;
    mso-level-number-format: decimal;
    mso-level-number-position: left;
    mso-level-suffix: tab;
    mso-level-tab-stop: 180pt;
    mso-level-text: '%5.';
    text-indent: -18pt;
  }

  @list l0:level6 {
    font-family: 宋体;
    margin-left: 216pt;
    mso-level-number-format: decimal;
    mso-level-number-position: left;
    mso-level-suffix: tab;
    mso-level-tab-stop: 216pt;
    mso-level-text: '%6.';
    text-indent: -18pt;
  }

  @list l0:level7 {
    font-family: 宋体;
    margin-left: 252pt;
    mso-level-number-format: decimal;
    mso-level-number-position: left;
    mso-level-suffix: tab;
    mso-level-tab-stop: 252pt;
    mso-level-text: '%7.';
    text-indent: -18pt;
  }

  @list l0:level8 {
    font-family: 宋体;
    margin-left: 288pt;
    mso-level-number-format: decimal;
    mso-level-number-position: left;
    mso-level-suffix: tab;
    mso-level-tab-stop: 288pt;
    mso-level-text: '%8.';
    text-indent: -18pt;
  }

  @list l0:level9 {
    font-family: 宋体;
    margin-left: 324pt;
    mso-level-number-format: decimal;
    mso-level-number-position: left;
    mso-level-suffix: tab;
    mso-level-tab-stop: 324pt;
    mso-level-text: '%9.';
    text-indent: -18pt;
  }

  p.MsoNormal {
    font-family: Calibri;
    font-size: 10.5pt;
    margin: 0;
    margin-bottom: 0.0001pt;
    mso-bidi-font-family: 'Times New Roman';
    mso-fareast-font-family: 宋体;
    mso-font-kerning: 1pt;
    mso-pagination: none;
    mso-style-name: 正文;
    mso-style-parent: '';
    text-align: justify;
    text-justify: inter-ideograph;
  }

  span {
    font-family: 'Times New Roman';
  }

  span.msoIns {
    color: blue;
    mso-style-name: '';
    mso-style-type: export-only;
    text-decoration: underline;
    text-underline: single;
  }

  span.msoDel {
    color: red;
    mso-style-name: '';
    mso-style-type: export-only;
    text-decoration: line-through;
  }

  table.MsoNormalTable {
    font-family: 'Times New Roman';
    font-size: 10pt;
    mso-ansi-language: #0400;
    mso-bidi-language: #0400;
    mso-fareast-language: #0400;
    mso-padding-alt: 0 5.4pt 0 5.4pt;
    mso-pagination: widow-orphan;
    mso-para-margin: 0;
    mso-para-margin-bottom: 0.0001pt;
    mso-style-name: 普通表格;
    mso-style-noshow: yes;
    mso-style-parent: '';
    mso-tstyle-colband-size: 0;
    mso-tstyle-rowband-size: 0;
  }

  @page {
    mso-page-border-surround-footer: no;
    mso-page-border-surround-header: no;
  }
  @page Section0 {
    layout-grid: 15.6pt;
    margin-bottom: 72pt;
    margin-left: 90pt;
    margin-right: 90pt;
    margin-top: 72pt;
    size: 595.3pt 841.9pt;
  }

  div.Section0 {
    page: Section0;
  }
}
</style>
