<template>
  <div style="position: relative">
    <div class="border" id="editorjs"></div>

  </div>

</template>
<script>

// import the styles

import {editorjs_config,parser_config} from "@/plugins/editorjs_config";


export default {
  name: 'Login',
  components: {
  },
  props:{
    first_content: Object,
    content_json: Object,
    content_text: String,
    content_html: String,
  },
  data() {

    return {
      editor: null,
      editorjs: null,

parser:null,
    }
  },
  mounted() {
    var self = this;

    this.parser = new edjsParser(parser_config, {}, {});
    editorjs_config.data = this.first_content

    editorjs_config.onChange = (api, event) => {
      // console.log('Now I know that Editor\'s content changed!', event)
      self.editor_changed();

    }
    editorjs_config.onReady=  () => {
      new DragDrop(self.editorjs);
    }
    this.editorjs = new EditorJS(editorjs_config);

    setTimeout(function (){
      self.editor_changed()

    },500)


  },
  watch: {


  },
  methods: {
    editor_changed() {
      var self = this;
      this.editorjs.save().then((outputData) => {
        // console.log('Article data: ', outputData)
        console.log("prser",self.parser.parse(outputData))
        self.editorData = self.parser.parse(outputData);
        self.$emit('update:content_json', outputData)


        let tmp = document.createElement("DIV");
        tmp.innerHTML = this.editorData;
        // this.content_text = tmp.textContent || tmp.innerText || "";
        // this.content_html = this.editorData;

        self.$emit('update:content_text', tmp.textContent || tmp.innerText || "")
        self.$emit('update:content_html', self.editorData)

      }).catch((error) => {
        alert("خطا در پردازش متن")
        console.log('Saving failed: ', error)
      });
    },

  }
}


</script>

