<template>
  <div >
    <div class="border" :id="editor_id"></div>

  </div>

</template>
<script>

// import the styles

import {editorjs_config, parser_config} from "@/plugins/editorjs_config";


export default {
  name: 'Login',
  components: {},
  props: {
    first_content: Object,
    content_json: Object,
    content_text: String,
    content_html: String,
    editor_id: String,
  },
  data() {

    return {

      editor: null,
      editorjs: null,

      parser: null,
    }
  },
  mounted() {
    var self = this;
    var config =Object.assign({}, editorjs_config);
    config.holder = this.editor_id;
    this.parser = new edjsParser(parser_config, {}, {});
    config.data = this.first_content

    config.onChange = (api, event) => {
      // console.log('Now I know that Editor\'s content changed!', event)
      self.editor_changed();

    }

    config.onReady = () => {
      new DragDrop(self.editorjs);
    }
    config.onReady =  () => {
      new Undo(self.editorjs);
    }
    config.tools.columns = {
      class : editorjsColumns,

          config : {
        EditorJsLibrary :  EditorJS, // Pass the library instance to the columns instance.

            tools : {
          header: Header,
              paragraph : Paragraph,
        } // IMPORTANT! ref the column_tools
      }
    }
    this.editorjs = new EditorJS(config);

    setTimeout(function () {
      self.editor_changed()
      const selectElement = document.getElementById(self.editor_id).querySelectorAll('select');
      for(var i=0;i<selectElement.length;i++)
      selectElement[i].addEventListener('change', (event) => {
        self.editor_changed();

      });
    }, 500)


  },
  watch: {},
  methods: {
    editor_changed() {
      var self = this;
      this.editorjs.save().then((outputData) => {
        // console.log('Article data: ', outputData)
        console.log("prser", self.parser.parse(outputData))
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

<style>
.ce-block__content, .ce-toolbar__content{
  max-width: 650px;
}
</style>