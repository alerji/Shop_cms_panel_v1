<template>
  <div>
    <CCol>
      <div class="form-group">
        <label>
          {{ label }}
        </label>
        <CInputFile
            :label="$t('image')"
            custom
            horizontal
            ref="file_selector"
            v-show="false"

            v-on:change="handleFileUpload"
        />
        <div v-on:click="open_file_selector()"
        >
          <CImg height="100px"
                width="100px"
                v-model="preview"
                :src="preview"
          />

        </div>
      </div>
    </CCol>


  </div>
</template>

<script>

export default {
  name: 'ImageSelector',

  inheritAttrs: false,
  components: {},
  props: {
    baseUrl:String,
    file: File,
    label: String,
    base64: String,
    previewImage: {type: [String], default: "/img/placeholder.png"}
  },
  data() {
    return {
      preview: "/img/placeholder.png"
    }
  },
  computed: {},
  watch: {
    'previewImage': function () {
      this.preview = this.previewImage

    }
  },
  mounted() {
    if (this.previewImage != null) {
      this.preview = this.baseUrl+this.previewImage
    }
  },
  methods: {
    handleFileUpload(files, e) {
      console.log("handle upload")
      var myfile = e.target.files[0];
      if (myfile == null) {
        return
      }
      this.preview = URL.createObjectURL(myfile);

      // e.target.value = '';
      // e.target.files = '';
      this.$emit('update:file', myfile)
      this.encodeImageFileAsURL(myfile)
    },
    open_file_selector() {
      this.$refs.file_selector.$el.getElementsByTagName('input')[0].click()
    },
    encodeImageFileAsURL(file) {
      var self = this
      var reader = new FileReader();
      reader.onloadend = function () {
        self.$emit('update:base64', reader.result)

      }
      reader.readAsDataURL(file);
    }
  },


}
</script>