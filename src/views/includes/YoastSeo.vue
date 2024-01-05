<template>
  <div >
    <div>
      <CRow>
        <CCol >
          <CCard header="Snippet Preview" class="mb-2">
            <snippet-preview
                :title="metaTitle"
                :description="metaDescription"
                :url="url"
                baseUrl="https://my-site.com/"
                @update:titleWidth="(value) => titleWidth = value"
                @update:titleLengthPercent="(value) => titleLengthPercent = value"
                @update:descriptionLengthPercent="(value) => descriptionLengthPercent = value" />
          </CCard>

          <CCard header="Content Assessor" class="mb-2">
            <content-assessor
                :title="metaTitle"
                :titleWidth="titleWidth"
                :description="metaDescription"
                :url="url"
                :text="description"
                :locale="locale"
                :translations="translations"
                :resultFilter="assessorResultFilter" />
          </CCard>

          <CCard header="SEO Assessor" class="mb-2" no-body>

<CCardBody>
  <seo-assessor
      :keyword="focusKeyword"
      :title="metaTitle"
      :titleWidth="titleWidth"
      :description="metaDescription"
      :url="url"
      :text="description"
      :locale="locale"
      :translations="translations"
      :resultFilter="assessorResultFilter" />
</CCardBody>


          </CCard>

        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>

import { SnippetPreview, ContentAssessor, SeoAssessor } from '@/plugins/yoastseo/index'
import YoastSeoFaIr from '@/plugins/yoastseo/languages/fa_IR.json'
export default {
  name: 'App',
  components: {
    ContentAssessor,
    SeoAssessor,
    SnippetPreview
  },
  props:{
    focusKeyword:   String,
    metaTitle: String,
    metaDescription: String,
    description: String,
  },
  data () {
    return {
      url: 'page/1',

      titleWidth: 0,
      titleLengthPercent: 0,
      descriptionLengthPercent: 0,
      translations: YoastSeoFaIr,
      locale: 'fa_IR',
      localeOptions: [
        {
          text: 'en_US',
          value: 'en_US'
        },
        {
          text: 'fa_IR',
          value: 'fa_IR'
        }
      ]
    }
  },
  watch: {
    locale (newVal) {
      if (newVal === 'fa_IR') {
        this.translations = YoastSeoFaIr
      } else {
        this.translations = null
      }
    }
  },
  methods: {
    assessorResultFilter (value) {
      return value
    }
  }
}
</script>
