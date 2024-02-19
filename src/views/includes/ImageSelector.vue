<template>
  <div>
    <CCol>
      <div class="form-group">
        <label>
          {{ label }}
        </label>
<!--        <CIcon name="cil-list" @click.native="file_manager_modal=true"/>-->
        <CInputFile
            :label="$t('image')"
            custom
            horizontal
            ref="file_selector"
            v-show="false"

            v-on:change="handleFileUpload"
        />
        <div
        >
          <CImg height="100px"
                width="100px"
                @click.native="file_manager_modal=true"
                class="border-dark"
                v-model="preview"
                :src="preview"
          />
<div style="display: flex" v-if="multiple">
  <div v-for="item in selected_media">
    <CImg :src="get_image_link(media.filter(x=>x.id==item)[0])" width="45px" height="45px" @click.native="preview=get_image_link(media.filter(x=>x.id==item)[0])"/>
  </div>
</div>
        </div>
      </div>
    </CCol>

    <CModal
        title="فایل منیجر"
        color="info"
        size="xl"

        :show.sync="file_manager_modal"
    >
      <CRow v-on:dragenter="dragEnterHandlerFile">

        <div id="drag_zone"
             v-on:dragexit="dragExitHandlerFile"
             v-on:dragleave="dragLeaveHandlerFile"
             v-on:drop="dropHandlerFile"
             v-on:dragover="dragOverHandlerFile">
          <label>برای ارسال فایل را بکشید</label>
        </div>
        <CCol col="3" class="b-l-1" v-if="media.length>0">
          <CRow v-if="selected_media_data.id!=0">
            <CCol col="12">
              <CImg loading="lazy" :class="`m-1 border`" :src="preview" style="width: 50%;height: auto"/>
            </CCol>
            <CCol col="12">
              نام فایل:
              {{media.filter(x=>x.id==selected_media_data.id)[0].name}}
              <hr>

            </CCol>
            <CCol col="12">
              <div style="display: inline-flex;" >

                <CInput class="pb-0"
                        label="alt"
                        horizontal
                        v-model="media.filter(x=>x.id==selected_media_data.id)[0].alt">

                  <template #append>
                    <CButton size="sm" ourlined color="success" @click="update_media_alt(media.filter(x=>x.id==selected_media_data.id)[0])">
                      <CIcon name="cil-check"/>
                    </CButton>
                  </template>
                </CInput>

              </div>
              <hr>

            </CCol>
            <CCol col="12">
              <CIcon name="cil-clone" style="cursor: pointer" @click.native="copy_link()"/>
              <div >{{preview}}</div>
              <input id="copy_link" v-show="false" v-model="preview"/>
              <hr>

            </CCol>

            <CCol col="12">
              سایز:
              {{selected_media_data.width}}x{{selected_media_data.height}}
              <hr>

            </CCol>

          </CRow>
        </CCol>
        <CCol col="7"
              style="height: 60vh;overflow: auto"
        >
          <CInput class="pb-0"
                  placeholder="جستجو"
                  horizontal
                  v-model="search">

          </CInput>
          <CRow>
            <CCol col="3"  v-for="item in selected_archive==0 ? media.filter(x=>x.name.includes(search)) : media.filter(x=>x.archive_id==selected_archive)" @click="select_media(item)">
              <CImg loading="lazy" :class="`m-1 border ${selected_media.includes(item.id)?' border-info':''}`" :src="get_image_link(item)" style="width: 100%;height: auto"/>
            </CCol>
          </CRow>
        </CCol>
        <CCol col="2" class="b-r-1">
          <div v-for="archive in archives"
               @click="selected_archive=archive.id"
               :class="`archive_div ${selected_archive==archive.id ?'active':''}`" :key="archive.id">
            {{ archive.type }}
            <CIcon name="cil-folder" />

          </div>
        </CCol>

      </CRow>
      <template #footer>
        <CButton @click="file_manager_modal = false" color="dark">انتخاب</CButton>
        <CButton @click="file_manager_modal = false" color="dark">انصراف</CButton>
      </template>
    </CModal>


  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'ImageSelector',

  inheritAttrs: false,
  components: {},

  props: {
    baseUrl: String,
    label: String,
    multiple: {type: [Boolean], default: false},
    media_id:Array,
    default_archive: String,
    base64: String,
    previewImage: {type: [String], default: "/img/placeholder.png"}
  },
  data() {
    return {
      search: "",
      file: null,
      file_manager_modal: false,
      media: [],
      archives: [],
      selected_archive: 0,
      selected_media:[],
      selected_media_data:{id:0,height:'',width:'',size:''},
      preview: "/img/placeholder.png",
    }
  },
  computed: {},
  watch: {
    'previewImage': function () {
      this.preview = this.previewImage
    },
    'media_id': function () {
      this.selected_media = this.media_id
    }
  },
  mounted() {

    if (this.previewImage != null) {
      this.preview = this.baseUrl + this.previewImage
    }
    if(this.media_id!=null){
      this.selected_media = this.media_id
    }
    this.get_medias()
    this.paste_image_clicpboard()
  },
  methods: {
    copy_link(){
      var copyText = document.getElementById("copy_link");
      // Select the text field
      copyText.select();
      copyText.setSelectionRange(0, 99999); // For mobile devices
      // Copy the text inside the text field
      navigator.clipboard.writeText(copyText.value);

      this.$toast.success("کپی شد!!!")
    },
    select_media(item){
      var self = this;
      if(this.multiple){
        if(this.selected_media.includes(item.id)){
          this.selected_media.splice(this.selected_media.findIndex(x=>x==item.id),1)
        }else{
          this.selected_media.push(item.id)
        }
      }else{
        this.selected_media = [item.id]

      }
      console.log(this.selected_media)
      this.selected_media_data.id = item.id
      this.preview = this.get_image_link(item)

      const img = new Image();
      img.onload = function() {
        self.selected_media_data.height =this.height
        self.selected_media_data.width = this.width

      }

      img.src = this.preview;
        this.$emit('update:media_id', this.selected_media)

    },
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
    },
    get_medias() {
      var self = this;
      var formData = new FormData();
      axios.post('/api/admin/site/media_archives', formData, {}).then(function (response) {

        var content_cats = response.data;

        // items = content_cats.orders;
        self.media = content_cats.media
        self.archives = content_cats.archives
        self.archives.splice(0,0,{type:'All',id:0})
        if(self.default_archive!=null){
          self.selected_archive =  self.archives.filter(x=>x.type==self.default_archive)[0].id
        }else{
          self.selected_archive = self.archives[0].id
        }

        // console.log("cats is "+items);
        // self.description = '';
        // localStorage.setItem("api_token", response.data.access_token);
        // self.$router.push({ path: 'notes' });
      })
          .catch(function (error) {

            console.log(error);
          });

    },
    update_media_alt(item) {
      var self = this;
      var formData = new FormData();
      formData.append("id",item.id);
      formData.append("alt",item.alt);
      axios.post('/api/admin/site/update_media_alt', formData, {}).then(function (response) {

        var content_cats = response.data;

        // items = content_cats.orders;

        // console.log("cats is "+items);
        // self.description = '';
        // localStorage.setItem("api_token", response.data.access_token);
        // self.$router.push({ path: 'notes' });
      })
          .catch(function (error) {

            console.log(error);
          });

    },
    get_image_link(item) {
      var self = this
      try {
        let link = item.name;
        const arch = this.archives.filter(x => x.id == item.archive_id)[0]
        link = arch.path + link
        return axios.defaults.baseURL + link
      }catch (e) {
        // self.get_medias()
      }

    },

    dropHandlerFile(ev) {
      console.log('File(s) dropped')
      var self = this

      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault()

      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...ev.dataTransfer.items].forEach((item, i) => {
          // If dropped items aren't files, reject them
          if (item.kind === 'file') {
            const file = item.getAsFile()
            // var files = e.target.files || e.dataTransfer.files;
              var reader = new FileReader()

              console.log('file', file)
              reader.onloadend = function () {
                var obj = {file: reader.result, preview: reader.result, upload: 0, name: file.name}
                self.upload_file(obj)
              }
              reader.readAsDataURL(file)
              // this.tagArray.push(f[0].name)

              // console.log("files", this.tagArray);


          }
        })
      } else {
        // Use DataTransfer interface to access the file(s)
        [...ev.dataTransfer.files].forEach((file, i) => {
          console.log(`… file[${i}].name = ${file.name}`)
        })
      }
      document.getElementById('drag_zone').style.display = 'none'
    },
    dragOverHandlerFile(ev) {
      var drop_has_file = 'none'
      if (ev.dataTransfer.types) {
        for (var i = 0; i < ev.dataTransfer.types.length; i++) {
          if (ev.dataTransfer.types[i] == 'Files') {
            drop_has_file = 'block'
            console.log('File(s) in drop zone')
          }
        }
      }
      document.getElementById('drag_zone').style.display = drop_has_file

      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault()
    },
    dragLeaveHandlerFile(ev) {
      // document.getElementById("drag_zone").style.display="none"
      console.log('File(s) in drop leave')
      document.getElementById('drag_zone').style.display = 'none'

      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault()
    },
    dragEnterHandlerFile(ev) {
      // document.getElementById("drag_zone").style.display="none"
      console.log('File(s) in drop enter')
      document.getElementById('drag_zone').style.display = 'block'

      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault()
    },
    dragExitHandlerFile(ev) {
      console.log('File(s) in drop exit')

      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault()
    },
    paste_image_clicpboard() {
      var self = this
      addEventListener('paste', ev => {
        for (const item of ev.clipboardData.items) { /// Clipboard may contain multiple elements of different type -- text, image, etc
          if (item.type.startsWith('image/')) { /// We are only interested in clipboard data that is an image
            /// Do something with the data, image available as `item.getAsFile()`
            const file = item.getAsFile()
            // var files = e.target.files || e.dataTransfer.files;
            if (self.if_file_allowed(file.name)) {
              var reader = new FileReader()

              console.log('file', file)
              reader.onloadend = function () {
                var obj = {file: reader.result, preview: reader.result, upload: 0, name: file.name}
                self.upload_file(obj)
              }
              reader.readAsDataURL(file)
              // this.tagArray.push(f[0].name)

              // console.log("files", this.tagArray);
              self.tagFlag = true
            }
          }
        }
      })
    },
    upload_file(obj) {
      let self = this;
      const formData = new FormData()
      let url= "/api/admin/site/upload_media";

      formData.append('file', obj.file)
      formData.append('archive',this.default_archive)

      axios.post(url, formData, {}).then((res) => {
        self.media.splice(0,0,res.data)
      }).catch(function (error) {

        console.log(error);
      });

    }

  },


}
</script>
<style>
.archive_div {
  //border: 1px solid darkgray;
  border-radius: 4px;
  padding: 5px;
  margin: 3px;
  text-align: left;
  cursor: pointer;
}
.archive_div:hover {
  //border: 1px solid darkgray;
  background: rgba(51, 153, 255, 0.5);
}
.archive_div.active {
color: white;
  background: #39f;
}
#drag_zone{
  position: absolute;
  display: none;
  margin-right: 3%;
  margin-top: 2%;
  width: 95%;
  height: 90%;
  background: #d9d9d9c4;
  z-index: 10000;
  text-align: center;
  border-radius: 10px;
}
</style>