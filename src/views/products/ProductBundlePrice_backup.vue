<template>
  <div>
    <CRow>
      <CCol col="12 col-sm-10">
        <CCard>
          <CCardHeader>
            <strong>لیست قیمت خصوصیتی {{product_title}}</strong>
            <CButton
                @click="product_bundle_prices.push({bundles:{}})"
                type="submit" ref="submit_form" size="sm" color="primary">
              <CIcon name="cil-plus" size="sm"/>
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CRow class="m-0 border" v-for="(bundle_price,index) in product_bundle_prices">
              <CCol col="6 col-sm-3" style="padding: 1px;" v-for="type in product_bundles">
                <CSelect
                    :options="bundles.filter(x=>x.id==type)[0].items"
                    placeholder="انتخاب کنید"
                    :label="bundles.filter(x=>x.id==type)[0].title"
                    :value.sync="bundle_price.bundles[type]"
                />
              </CCol>
              <CCol col="6 col-sm-2" style="padding: 1px;" >
                <CInputCurrency
                    label="قیمت"
                    v-model="bundle_price.price"
                />
              </CCol>
              <CCol col="6 col-sm-2" style="padding: 1px;" >
                <CInput
                    label="کد"
                    v-model="bundle_price.code"
                />
              </CCol>
              <CCol col="6 col-sm-2" style="padding: 1px;" >
                <CInputCurrency
                    label="قیمت ویژه"
                    v-model="bundle_price.off_price"
                />
              </CCol>
              <CCol col="6 col-sm-3" style="padding: 1px;" >
                <div class="form-group">
<label>تاریخ قیمت</label>
                  <date-picker
                      style="margin-top: 30px;"

                      v-model="bundle_price.off_date"
                  />
                </div>
              </CCol>
              <CCol col="3 col-sm-1" style="padding: 1px;" >
                <CInputCurrency
                    label="موجودی"
                    v-model="bundle_price.stock"
                />
              </CCol>
              <CCol col="3 col-sm-3" style="padding: 1px;" >
                <div style="display: flex;flex-flow: wrap;">
                  <div  v-for="image in gallery" :key="image.image_id"  @click="select_image(bundle_price,image,index)">
                    <img :src="image.image" width="45px" height="45px"
                         :style="`margin:1px; ${bundle_price.image_id == image.image_id ? ' border:1px solid blue; ':''}`"/>
                  </div>
                </div>
              </CCol>
              <CCol  col="3 col-sm-1" style="padding: 1px;" >
                <CButton
                    color="danger"
                    size="sm"
                    style="margin-top: 30px;"
                    @click="product_bundle_prices.splice(index,1)"
                    outlined>
                  <CIcon name="cil-minus" size="sm"/>
                </CButton>

              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CButton
                @click="login()"
                type="submit" ref="submit_form" size="sm" color="primary">
              ثبت
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol col="12 col-sm-2">
        <CCard>
          <CCardHeader>
            <strong>خصوصیات مرتبط</strong>
          </CCardHeader>
          <CCardBody style="min-height: 200px">
            <CRow>
              <CCol col="12" style="display: inline-flex;align-self: center;gap: 10px;" v-for="bundle in bundles">
                <input
                    type="checkbox"
                    v-model="product_bundles"
                    :value="bundle.id"
                />

                <label>{{ bundle.title }}</label>

              </CCol>
            </CRow>


          </CCardBody>

        </CCard>
      </CCol>
    </CRow>


  </div>

</template>

<script>
import axios from "axios";

import {bus} from '../../main';
import Vue from 'vue'

export default {
  name: 'Login',
  data() {
    return {
      confirm_delete_name: new Date().getTime() + "_" + this.$vnode.tag,
      gallery: [],
      bundles: [],
      product_bundle_prices: [],
      product_bundles: [],
      product_title: '',

    }
  }, mounted() {
    this.get_categories();
    bus.$on(this.confirm_delete_name, (data) => {
      // alert(data);
      if (data == "true") {
        this.delete_item();

      } else {
        this.status_form = 0;
      }
    });
  }, watch: {},
  methods: {
select_image(bundle_price,image,index){
  Vue.set(this.product_bundle_prices[index],"image_id",image.image_id)
  // bundle_price.image_id = image.image_id
},
    editDetails(item) {
      this.name = item.title.title;
      this.description = item.title.summary;
      this.previewImage = item.image;

      this.status_form = item.id;

    },
    get_categories() {
      var self = this;
      var formData = new FormData();
      formData.append("id", this.$route.params.product_id)
      axios.post('/api/admin/product/get_product_bundle_prices', formData, {}).then(function (response) {

        var content_cats = response.data;
        self.product_title = content_cats.product_title
        self.bundles = content_cats.bundles
        self.gallery = content_cats.gallery
        self.product_bundle_prices = []
        self.product_bundles = content_cats.product_bundles
        content_cats.product_bundle_prices.forEach(function (val){
          val.bundles = {}
          val.bundles_temp.forEach(function (bun){
            // console.log("bun[0]",Object.keys(bun)[0],bun[Object.keys(bun)[0]])
            val.bundles[Object.keys(bun)[0]] = bun[Object.keys(bun)[0]]
          })
        })
        self.product_bundle_prices = content_cats.product_bundle_prices
        console.log("self.product_bundle_prices",self.product_bundle_prices)
      })
          .catch(function (error) {

            console.log(error);
          });

    },


    login() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/product/update_product_price_bundle";


      formData.append('id', this.$route.params.product_id);
      formData.append('bundles', JSON.stringify(this.product_bundles));
      formData.append('product_bundle_prices', JSON.stringify(this.product_bundle_prices));

      axios.post(url, formData, {}).then((res) => {

        self.$root.modal_component.show_api_response_modals(res);

        if (res.data.error == 0) {

          self.get_categories();
        }

      }).catch(function (error) {

        console.log(error);
      });

    },
    delete_item_dialog(item) {
      this.$root.modal_component.show_confirm_modal(this.$t("warning"), this.$t("deleteMessage"), [this.$t("ok")], this.confirm_delete_name);

      this.status_form = item.id;

    },
    delete_item() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/product/delete_brand";


      formData.append('id', this.status_form);

      axios.post(url, formData, {}).then((res) => {

        self.$root.modal_component.show_api_response_modals(res);
        self.status_form = 0;

        self.get_categories();


      })
          .catch(function (error) {
            console.log(error);
          });
    },
  }
}


</script>
