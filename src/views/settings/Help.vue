<template>
  <div>
    <CRow>
      <CCol col="12">
        <CCard>
          <CCardHeader>
            <strong>آموزش و راهنما</strong>

          </CCardHeader>
          <CCardBody>
            <CTabs>
              <CTab title="داشبورد">
                <CRow>
                  <CCol col="3">
                    <div style="display: grid"  @click="show_video('dashboard','آموزش داشبورد')">
                      <img src="/img/placeholder.png" height="100px"/>
                      <label>آموزش بخش داشبورد</label>
                      <CButton color="dark">نمایش</CButton>
                    </div>

                  </CCol>
                </CRow>
              </CTab>
              <CTab title="بلاگ">
                <CRow>
                  <CCol col="3">
                    <div style="display: grid"  @click="show_video('blog','آموزش بلاگ')">
                      <img src="/img/placeholder.png" height="100px"/>
                      <label>آموزش بخش بلاگ</label>
                      <CButton color="dark">نمایش</CButton>
                    </div>

                  </CCol>
                </CRow>
              </CTab>
              <CTab title="کاربران پنل">
                <CRow>
                  <CCol col="3">
                    <div style="display: grid"  @click="show_video('users','آموزش کاربران پنل')">
                      <img src="/img/placeholder.png" height="100px"/>
                      <label>آموزش بخش کاربران پنل</label>
                      <CButton color="dark">نمایش</CButton>
                    </div>

                  </CCol>
                </CRow>
              </CTab>
              <CTab title="سفارشات">
                <CRow>
                  <CCol col="3">
                    <div style="display: grid"  @click="show_video('orders','آموزش سفارشات')">
                      <img src="/img/placeholder.png" height="100px"/>
                      <label>آموزش بخش سفارشات</label>
                      <CButton color="dark">نمایش</CButton>
                    </div>

                  </CCol>
                </CRow>
              </CTab>
              <CTab title="محصولات">
                <CRow>
                  <CCol col="3">
                    <div style="display: grid"  @click="show_video('products_1','آموزش محصولات قسمت 1')">
                      <img src="/img/placeholder.png" height="100px"/>
                      <label>آموزش محصولات قسمت 1</label>
                      <CButton color="dark">نمایش</CButton>
                    </div>

                  </CCol>
                  <CCol col="3">
                    <div style="display: grid"  @click="show_video('products_2','آموزش محصولات قسمت 2')">
                      <img src="/img/placeholder.png" height="100px"/>
                      <label>آموزش محصولات قسمت 2</label>
                      <CButton color="dark">نمایش</CButton>
                    </div>

                  </CCol>
                  <CCol col="3">
                    <div style="display: grid"  @click="show_video('products_3','آموزش محصولات قسمت 3')">
                      <img src="/img/placeholder.png" height="100px"/>
                      <label>آموزش محصولات قسمت 3</label>
                      <CButton color="dark">نمایش</CButton>
                    </div>

                  </CCol>
                  <CCol col="3">
                    <div style="display: grid"  @click="show_video('products_4','آموزش محصولات قسمت 4')">
                      <img src="/img/placeholder.png" height="100px"/>
                      <label>آموزش محصولات قسمت 4</label>
                      <CButton color="dark">نمایش</CButton>
                    </div>

                  </CCol>
                </CRow>
              </CTab>
              <CTab title="گزارشات">
                <CRow>
                  <CCol col="3">
                    <div style="display: grid"  @click="show_video('reports','آموزش بخش گزارشات')">
                      <img src="/img/placeholder.png" height="100px"/>
                      <label>آموزش بخش گزارشات</label>
                      <CButton color="dark">نمایش</CButton>
                    </div>

                  </CCol>
                </CRow>
              </CTab>
              <CTab title="تنظیمات">
                <CRow>

                  <CCol col="3">
                    <div style="display: grid"  @click="show_video('settings','آموزش بخش تنظیمات')">
                      <img src="/img/placeholder.png" height="100px"/>
                      <label>آموزش بخش تنظیمات</label>
                      <CButton color="dark">نمایش</CButton>
                    </div>

                  </CCol>
                </CRow>
              </CTab>

            </CTabs>

          </CCardBody>

        </CCard>
      </CCol>
    </CRow>
    <CModal
        :show.sync="video_modal"
        color="transparent"
        :title="video_title"
        size="lg"
        border-color="primary"
    >
      <div>
        <video
            controls

            width="100%" height="100%" :src="video_source">
          <source :src="video_source">
        </video>
      </div>


      <template #footer>
      </template>
    </CModal>


  </div>

</template>

<script>
import axios from "axios";

import {bus} from '../../main';


export default {
  name: 'Login',
  data() {
    return {
      video_modal:false,
      video_title:'',
      video_source:'',
    }
  }, mounted() {

  }, watch: {

  },
  methods: {
    show_video(video,title){
          this.video_title=title
          this.video_source='https://panel.charlotte-perfume.ir/learning/'+video+".mp4"
              this.video_modal=true

    }
  }
}


</script>
