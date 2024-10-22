<template>
  <div>
    <CRow>
      <CCol col="8">
        <CCard>
          <CCardHeader>
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
                    <p class="text-muted">{{item.section_id}}</p>

                  </td>

                </template>
                <template #نام="{item}">

                  <td>
                    <p class="text-muted">{{item.name}}</p>

                  </td>

                </template>



                <template #operation="{item,index}">
                  <td class="py-2">
                    <CButton
                        color="primary"
                        variant="outline"
                        square
                        size="sm"
                        @click="editDetails(item,index)"
                    ><CIcon name="cil-pencil" size="sm"/>
                    </CButton>

                    <CButton
                        color="danger"
                        variant="outline"
                        square
                        size="sm"
                        @click="delete_item_dialog(item,index)"
                    ><CIcon name="cil-trash" size="sm"/>
                    </CButton>
                  </td>
                </template>



              </CDataTableFixed>

            </CCardBody>

          </CCardHeader>
        </CCard>
      </CCol>
      <CCol col="4">
        <CCard>
          <CCardHeader>
            <strong>افزودن بنر</strong>

          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12">
                <CInput
                    v-model="name"

                    label="عنوان"
                    placeholder="عنوان"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol col="12">

              </CCol>
              <CCol col="12">
                <CTextarea
                    v-model="text"
                    label="محتوا"
                />
              </CCol>
              <CCol col="12">
                <CSelect
                    :options="[{label:'فعال',value:1},{label:'غیرفعال',value:0}]"

                    :value.sync="selected_status"
                    label="انتخاب وضعیت"
                />
              </CCol>
              <CCol col="12">
                <date-picker

                    v-model="expire_date"
                    label="تاریخ انقضا"
                />
              </CCol>

            </CRow>


          </CCardBody>
          <CCardFooter>
            <CButton v-if="status_form ==0 "
                     @click="login()"
                     type="submit" ref="submit_form" size="sm" color="primary">
              <CIcon name="cil-check-circle"/>
              افزودن
            </CButton>


            <CButton v-if="status_form !=0 "
                     @click="login()"
                     type="submit" ref="submit_form" size="sm" color="warning">
              <CIcon name="cil-check-circle"/>
              ویرایش
            </CButton>
            <CButton v-if="status_form !=0 "
                     @click="clear_edit()"
                     type="submit" ref="submit_form" size="sm" color="warning">
              <CIcon name="cil-check-circle"/>
              انصراف
            </CButton>


          </CCardFooter>
        </CCard>
      </CCol>


    </CRow>

  </div>

</template>

<script>
import axios from "axios";
import {bus} from '../../main';

export default {
  name: 'Login',
  components: {

  },
  data() {
    return {
      items: [],
      fields: [
        {key: 'id', label: '#', _classes: 'text-center'},
        {key: 'name', label: 'عنوان'},
        {key: 'operation', label: 'عملیات'},
      ],
      selected_status:1,
      expire_date:'',
      name:'',
      text:'',
      confirm_delete_name: new Date().getTime() + "_" + this.$vnode.tag,
      status_form: 0
    }
  }, mounted() {
    this.get_categories();
    bus.$on(this.confirm_delete_name, (data) => {
      // alert(data);
      if (data == 'true') {
        this.delete_item();

      } else {
        this.status_form = 0;
      }
    });
  }, watch: {

  },
  methods: {

    editDetails(item) {
      this.name = item.name;
      this.text = item.data;
      this.selected_status = item.status;
      this.expire_date = item.expire_date;

      this.status_form = item.id;

    },
    clear_edit() {
      this.name = '';
      this.link = '';
      this.status_form = 0;
    },
    delete_item_dialog(item) {
      this.contextMenuIsVisible = false;

      this.$root.modal_component.show_confirm_modal('اخطار', "آیا مایل به حذف این ردیف هستید؟", ['تایید'], this.confirm_delete_name);

      this.status_form = item.id;

    },
    delete_item() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/site/delete_banner";


      formData.append('row_id', this.status_form);

      axios.post(url, formData, {}).then((res) => {
        if (res.data.error == 1) {
          this.$root.modal_component.show_danger_modal('خطا', res.data.msg);

        } else {
          this.$root.modal_component.show_success_modal('تایید', res.data.msg);

        }
        self.status_form = 0;

        self.get_categories();


      })
          .catch(function (error) {

            console.log(error);
          });
    },
    get_categories() {
      var self = this;
      var formData = new FormData();
      axios.post('/api/admin/site/get_banners', formData, {}).then(function (response) {

        var content_cats = response.data;

        self.items = content_cats.data

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    login() {


      let self = this;
      const formData = new FormData()
      let url;
      if (this.status_form == 0) {
        url = "/api/admin/site/add_banner";

      } else {
        url = "/api/admin/site/update_banner";
        formData.append('row_id', this.status_form);
      }


      // formData.append('image', this.file)
      formData.append('name', this.name);
      formData.append('data', this.text);
      formData.append('status', this.selected_status);
      formData.append('expire_date', this.expire_date);
      // formData.append('description', this.description)
      axios.post(url, formData, {}).then((res) => {


        // if(this.status_form==0){
        //     url = "/api/admin/category";
        this.$root.modal_component.show_api_response_modals(res);

        self.name = '';
        self.link = '';
        self.description = '';
        self.previewImage = '';
        self.status_form = 0;
        self.get_categories();

      })

          .catch(function (error) {

            console.log(error);
          });

    }
  }
}


</script>
