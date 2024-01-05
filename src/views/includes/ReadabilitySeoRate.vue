<template>
  <div>
    <CTabs>
      <CTab title="سئو">
        <YoastSeo
            :focusKeyword="keyword"
            :metaTitle="metaTitle"
            :metaDescription="metaDescription"
            :description="htmlContent"
        />
      </CTab>

      <CTab title="خوانایی">
        <div class="form-group">
          <label>
            خوانایی
          </label>
          <CProgress :value="read_score.fleschReadingEase"/>
          <p>Flesch Reading-Ease: {{read_score.fleschReadingEase}}</p>
          <p>Flesch-Kincaid Grade: {{read_score.fleschKincaidGrade}}</p>
          <p>SMOG grade: {{read_score.smogIndex}}</p>
          <p>Coleman-Liau index: {{read_score.colemanLiauIndex}}</p>
          <p>Automated Readability Index: {{read_score.automatedReadabilityIndex}}</p>
          <p>Linsear Write: {{read_score.linsearWriteFormula}}</p>
          <p>Rix: {{read_score.rix}}</p>
          <p>Reading time: {{read_score.readingTime}}</p>
          <p>Median grade: {{read_score.medianGrade}}</p>
        </div>
      </CTab>

    </CTabs>


  </div>
</template>

<script>

import Readability from "@/plugins/readability";
import YoastSeo from "@/views/includes/YoastSeo";
export default {
  name: 'ReadabilitySeoRate',

  inheritAttrs: false,
components:{
  YoastSeo
},
  props: {
    keyword: String,
    content: String,
    htmlContent: String,
    metaTitle: String,
    metaDescription: String,
  },
  data() {
    return {
read_score:{
  automatedReadabilityIndex: 0,
  colemanLiauIndex: 0,
  fleschKincaidGrade: 0,
  fleschReadingEase: 0,
  linsearWriteFormula: 0,
  medianGrade: 0,
  readingTime: 0,
  rix: 0,
  smogIndex: 0
},
    }
  },
  computed: {},
  watch:{
    'content': function() {
      this.read_score = Readability.getScore(this.content)

    }
  },
  mounted() {

  },
  methods: {

  },


}
</script>