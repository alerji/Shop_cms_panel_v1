<template>
 <div>
   <CCard>
     <CCardHeader>
       <CCol col="12" >
         <div class="main__title">
           <label>منابع</label>
         </div>
       </CCol>
     </CCardHeader>
     <CCardBody>
       <CRow >
         <!-- main title -->

         <!-- end main title -->
         <!-- form -->
         <CCol col="12" >
           <div class="form">
             <CRow >


               <div class="col-12 col-md-7 form__content">
                 <div class="row">
                   <div class="col-12">
                     <div class="form__group">
                       <CInput
                           v-model="name"
                           label="عنوان فصل"
                       />
                     </div>
                   </div>


                 </div>
               </div>


               <CCol col="12" >
                 <CRow >

                   <CCol col="12" >
                     <CButton
                         color="primary"
                         @click="insert_data">{{status_form ==0 ?
                         'افزودن' : 'ویرایش'}}
                     </CButton>
                   </CCol>
                 </CRow>
               </CCol>
             </CRow>
           </div>
         </CCol>

         <CCol col="12">

           <CRow >
             <!-- main title -->
             <!-- end main title -->

             <!-- users -->


           </CRow>
         </CCol>
         <!-- end form -->
       </CRow>

     </CCardBody>
   </CCard>
   <CCard v-for="season in items">
     <CCardHeader>
       <CRow>
         <CCol col="6">
           <label>{{season.name}}</label>

         </CCol>
         <CCol col="6">
           <div style="text-align: left">
             <CButton @click="edit_item(season)"
                      class="mr-1"
                      color="primary">
               ویرایش فصل
             </CButton>
             <CButton @click="add_episode(season)"
                      class="mr-1"

                      color="success">
               افزودن قسمت
             </CButton>

           </div>

         </CCol>
       </CRow>

     </CCardHeader>
     <CCardBody>
       <CCol col="12"   style="margin-bottom: 40px">
         <CRow style="padding: 5px;">
           <CCol  v-for="episode in season.episodes" col="3" >
             <CCard>
               <CCardHeader style="justify-content: space-between;display: flex;">
                 <label style="z-index: 100;">{{episode.name}}</label>
                 <label style="z-index: 100;">{{episode.duration}}</label>

               </CCardHeader>
               <CCardBody>
                 <img  :src="episode.image" style="width: 100%;"/>

               </CCardBody>
               <CCardFooter>
                 <CButton
                     color="warning"
                     @click="edit_episode(episode,season)">
                   ویرایش قسمت
                 </CButton>
               </CCardFooter>
             </CCard>


           </CCol>

         </CRow>

       </CCol>

     </CCardBody>
   </CCard>
   <CModal
       :show.sync="episode_modal"
       :no-close-on-backdrop="false"
       color="transparent"
       border-color="primary"
   >
  <div>
    <CRow>
      <CCol col="12">
        <div class="row">
          <div class="col-12 col-md-5 form__cover">
            <ImageSelector label="تصویر "
                           :previewImage="file_preview"
                           v-on:update:previewImage="file_preview = $event"
                           @imagefile="(n) => file = n"
            />
          </div>
          <div class="col-12">
            <CInput v-model="episode_name" type="text" class="form__input" label="عنوان"/>

          </div>

          <div class="col-12">
            <CTextarea v-model="episode_summary" id="text" name="text" class="form__textarea"
                       label="توضیحات"></CTextarea>
          </div>



          <div class="col-6">
            <CInput v-model="episode_duration" type="text" class="form__input"
                    label="مدت زمان قسمت" />
          </div>


          <CCol col="12" >
            <div class="form__group">
              <CInput v-model="episode_link" type="text" class="form__input" label="لینک ویدئو" />
            </div>
          </CCol>

          <CCol col="12">
            <CButton
                color="primary"
                v-if="status_form_episode==0" @click="insert_episode()" type="button" class="form__btn">ثبت</CButton>
            <CButton
                color="primary"

                v-if="status_form_episode!=0" @click="insert_episode()" type="button" class="form__btn">ویرایش</CButton>


          </CCol>
        </div>
      </CCol>
    </CRow>


  </div>
</CModal>
 </div>

</template>

<script>
    import axios from "axios";
    // import {bus} from '../main';
import ImageSelector from "@/views/includes/ImageSelector.vue";
    export default {
        name: 'ItemsList',
        data() {
            return {
                items: [],
              file_preview: '',
              file: null,
              episode_modal:false,
              selected_season:0,
              status_form_episode:0,
                status_form: 0,
                name: '',
              episode_name: '',
              episode_summary: '',
              episode_link: '',
              episode_duration: '',
            }
        },
        components: {
          ImageSelector
        },
        mounted() {
            this.get_data();
        },
        methods: {
            edit_item(item) {
                this.name = item.name
                this.status_form = item.id
            },
            edit_episode(item, season) {
              this.episode_name= item.name;
              this.episode_summary= item.summary;
              this.episode_duration= item.duration;
              this.episode_link= item.sources[0].link;
              this.file_preview= item.image;
              this.episode_modal = true;
              this.status_form_episode = item.id;
              this.selected_season = season.id;
            },
            add_episode(item) {

              this.status_form_episode = 0;
              this.episode_modal = true;
              this.selected_season = item.id;
              },
            get_data() {

                var self = this;

                var formData = new FormData();

                formData.append('poster_id', this.$route.params.id)
                axios.post('/api/get_seasons', formData, {}).then(function (response) {

                    var content_data = response.data;

                    // items = content_cats.orders;
                    self.items = content_data

                }).catch(function (error) {
                    console.log(error);
                });


            },
            insert_data() {

                var self = this;
                if (this.name == "") {
                    return
                }
                var formData = new FormData();
                var url = '/api/insert_seasons'
                formData.append('name', this.name);
                formData.append('poster_id', this.$route.params.id);

                if (this.status_form != 0) {
                    formData.append('id', this.status_form);
                    url = '/api/edit_seasons'
                }
                axios.post(url, formData, {}).then(function (response) {

                    self.get_data()
                    self.name = ''
                    self.status_form = 0;
                    self.$toast.success('ثبت با موفقیت انجام شد');


                }).catch(function (error) {
                    console.log(error);
                    self.$toast.error('خطا در ثبت اطلاعات');

                });


            },
          insert_episode() {

            var self = this;

            var formData = new FormData();
            var url = ""
            if (this.status_form_episode == 0) {
              url = "/api/insert_episode";
            } else {
              url = "/api/edit_episode"
              formData.append("id", this.status_form_episode)
            }

            formData.append("season_id", this.selected_season)
            formData.append("name", this.episode_name)
            formData.append("summary", this.episode_summary)
            formData.append("view_status", 1)
            formData.append("duration", this.episode_duration)
            formData.append("poster_image", this.file)
            formData.append("link", this.episode_link)


            axios.post(url, formData, {}).then(function (response) {

              var content_data = response.data.data;
              // self.$router.go(-1)
              // items = content_cats.orders;
              // self.$toast.success('ثبت با موفقیت انجام شد');
              self.episode_modal = false
self.get_data()

            }).catch(function (error) {
              console.log(error);
              // self.$toast.error('خطا در ثبت اطلاعات');

            });


          },


        }
    }
</script>

