<template>
  <div>
    <CRow>
      <CCol col="12 col-sm-8">
        <CCard>
          <CCardHeader>
            لیست مقادیر خصوصیات
          </CCardHeader>
          <CCardBody>

            <CDataTableFixed
                :items="items"
                :fields="fields"

                :items-per-page="20"
                hover
                sorter
                pagination
            >
              <template #row="{item}">

                <td>
                  <p class="text-muted">{{ item.row_id + 1 }}</p>

                </td>

              </template>
              <template #نام="{item}">

                <td>
                  <p class="text-muted">{{ item.title.title }}</p>

                </td>

              </template>

              <template #image="{item}">


                <td>
                  <CImg width="50px" height="50px" v-bind:src="item.image"/>
                </td>

              </template>

              <template #عملیات="{item}">
                <td class="py-2">
                  <CButton
                      color="warning"
                      variant="outline"
                      square
                      size="sm"
                      @click="editDetails(item)"
                  >
                    <CIcon name="cil-pencil" size="sm"/>
                  </CButton>
                  <CButton
                      color="danger"
                      variant="outline"
                      square
                      size="sm"
                      @click="delete_dialog(item)"
                  >
                    <CIcon name="cil-trash" size="sm"/>
                  </CButton>
                </td>
              </template>


            </CDataTableFixed>
          </CCardBody>

        </CCard>

      </CCol>
      <CCol col="12 col-sm-4">
        <CCard>
          <CCardHeader>
            <strong>ثبت ایتم خصوصیت محصولات</strong>

          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12">
                <CInput
                    v-model="name"
                    class="required"
                    label="نام ایتم"
                />
              </CCol>
              <CCol col="12">
                <CInput
                    v-model="code"
                    class="required"

                    label="کد ایتم"
                />
              </CCol>

              <CCol col="12">
                <CSelect
                    :options="view_types"
                    :value.sync="view_type"
                    type="color"
                    label="نوع ایکون"
                />
              </CCol>
              <CCol col="12" v-if="view_type==1">
                <CInput
                    type="color"
                    label="رنگ"
                    v-model="color"
                />
              </CCol>
              <CCol col="12" v-if="view_type==2">

                <ImageSelector label="تصویر"
                               :media_id.sync="file"
                               default_archive="product_bundle"
                               :preview-image="previewImage"
                />
              </CCol>
            </CRow>


          </CCardBody>
          <CCardFooter>

            <CButton
                @click="login()"
                type="submit" ref="submit_form" size="sm" color="primary">
              {{ status_form == 0 ? 'ثبت آیتم' : 'ویرایش آیتم' }}

            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <CModal
        :show.sync="delete_modal"
        :no-close-on-backdrop="true"
        :centered="true"
        title="حذف"
        size="md"
        color="dark"
    >
      <template #header>
        <h6 class="modal-title">حذف</h6>
        <CButtonClose @click="delete_modal = false" class="text-white"/>
      </template>
      <div>آیا مایل به حذف این مقدار هستید؟</div>
      <div>مقدار حذف شده در قیمت ها به مقدار زیر منتقل شوند</div>


      <CSelect
          :options="[{label:'انتخاب کنید',value:0},...items.filter(x=>x.value!=status_form)]"
          :value.sync="selected_delete_item"
      />
      <template #footer>
        <CButton @click="delete_item()"
                 color="danger"
        >حذف
        </CButton>
        <CButton
            @click="delete_modal = false"
            color="success"
        >انصراف
        </CButton>
      </template>
    </CModal>


  </div>

</template>

<script>
import axios from "axios";
import {bus} from "../../../main";


export default {
  name: 'Login',
  data() {
    return {
      confirm_delete_name: new Date().getTime() + "_" + this.$vnode.tag,

      name: '',
      file: [],
      color: '',
      code: '',
      view_type: 0,
      view_types: [{label: 'بدون نمایش', value: 0}, {label: 'نمایش رنگ', value: 1}, {label: 'نمایش تصویر', value: 2}],
      previewImage: null,
      description: '',
      delete_modal: false,
      selected_delete_item: 0,
      items: [],
      fields: [
        {key: 'row', label: '#', _style: 'width:10%'},
        {key: 'image', label: 'تصویر', _style: 'width:10%'},
        {key: 'نام', _style: 'width:10%'},

        {key: 'عملیات', _style: 'width:40%;'},


      ],
      details: [],
      collapseDuration: 0,
      status_form: 0
    }
  }, mounted() {
    bus.$on(this.confirm_delete_name, (data) => {
      // alert(data);
      if (data == 'true') {
        this.delete_item();

      } else {
        this.status_form = 0;
      }
    });
    this.get_categories();
  }, watch: {},
  methods: {

    editDetails(item) {
      this.name = item.title.title;
      this.code = item.code;
      this.view_type = parseInt(item.view_type);
      this.color = item.color;
      this.file = item.image_id;
      this.status_form = item.id;
    },
    get_categories() {
      var self = this;
      var formData = new FormData();
      formData.append("id", this.$route.params.bundle_id)
      axios.post('/api/admin/product/get_bundle_items', formData, {}).then(function (response) {

        var content_cats = response.data;
        content_cats.tags.forEach(function (val) {
          val.label = val.title.title;
          val.value = val.id;

        })
        self.items = content_cats.tags.map((item, row_id) => {
          return {...item, row_id}
        });

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    goRegister() {
      this.$router.push({path: 'register'});
    },
    login() {


      let self = this;
      const formData = new FormData()
      let url;
      if (this.status_form == 0) {
        url = "/api/admin/product/add_bundle_item";
      } else {
        url = "/api/admin/product/update_bundle_item";
        formData.append('id', this.status_form)

      }

      formData.append('image', this.file[0]);
      formData.append('name', this.name);
      formData.append('code', this.code);
      formData.append('view_type', this.view_type);
      formData.append('color', this.color);
      formData.append('bundle_id', this.$route.params.bundle_id);

      axios.post(url, formData, {}).then((res) => {

        self.$root.modal_component.show_api_response_modals(res);

        self.status_form = 0;
        self.name = '';
        self.code = '';

        self.get_categories();

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    delete_dialog(item) {
      // this.$root.modal_component.show_confirm_modal('اخطار', "آیا مایل به حذف این ردیف هستید؟", ['تایید'], this.confirm_delete_name);
      this.delete_modal = true

      this.status_form = item.id;

    },
    delete_item() {
if(this.selected_delete_item==0){
  this.$root.modal_component.show_danger_toast( "لطفا یک مقدار جایگزین انتخاب کنید");
return false
}

      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/product/delete_bundle_item";


      formData.append('id', this.status_form);
      formData.append('selected_delete_item', this.selected_delete_item);

      axios.post(url, formData, {}).then((res) => {
        self.$root.modal_component.show_api_response_modals(res);

        self.status_form = 0;

        self.get_categories();


      })
          .catch(function (error) {

            console.log(error);
          });
// this.get_categories();
      // this.$router.push({ path: '/posts/'});
    },


  }
}


</script>
