<template>
  <div>
<CRow>
  <CCol col="8">
    <CCard>
      <CCardHeader>
        <strong>لیست مدیران</strong>

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
        <template #row="{item,index}">

          <td>
            <p class="text-muted">{{ index+1 }}</p>

          </td>

        </template>
        <template #نام="{item}">

          <td>
            <p class="text-muted">{{ item.name }}</p>

          </td>

        </template>
        <template #role_group="{item}">

          <td>
            <p class="text-muted">{{ item.role_group.role_group.name }}</p>

          </td>

        </template>

        <template #ایمیل="{item}">

          <td>
            <p class="text-muted">{{ item.email }}</p>

          </td>

        </template>
        <template #موبایل="{item}">

          <td>
            <p class="text-muted">{{ item.phone }}</p>

          </td>

        </template>
        <template #تاریخ="{item}">

          <td>
            <p class="text-muted">{{ item.register_date }}</p>

          </td>

        </template>
        <template #خبرها="{item}">

          <td>
            <p class="text-muted">{{ item.post_count }}</p>

          </td>

        </template>


        <template #تصویر="{item}">


          <td>
            <CImg width="50px" height="50px" v-bind:src="item.image"/>
          </td>

        </template>

        <template #عملیات="{item,index}">
          <td class="py-2">
            <CButton
                color="warning"
                variant="outline"
                square
                size="sm"
                class="mr-1"
                @click="editDetails(item)"
            ><CIcon name="cil-pencil" size="sm"/>
            </CButton>
            <CButton
                color="danger"
                variant="outline"
                square
                class="mr-1"

                size="sm"
                @click="delete_user(item,index)"
            ><CIcon name="cil-trash" size="sm"/>
            </CButton>
          </td>
        </template>


      </CDataTableFixed>
    </CCardBody>
    </CCard>

  </CCol>
  <CCol col="4">
    <CCard>
      <CCardHeader>
        <strong>ثبت کاربر</strong>

      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol col="12">
            <CInput
                v-model="name"

                label="نام و نام خانوادگی"
                placeholder="نام"
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol col="12">
            <CInput
                v-model="mobile"

                label="تلفن همراه"
                placeholder="تلفن همراه"
            />

          </CCol>
        </CRow>
        <CRow>
          <CCol col="12">
            <CInput
                v-model="email"

                label="ایمیل"
                placeholder="ایمیل"

            />

          </CCol>
        </CRow>
        <CRow>
          <CCol col="12">
            <CInput
                v-model="password"

                label="رمز عبور"
                placeholder="رمز عبور"

            />

          </CCol>
        </CRow>
        <CRow>
          <CCol col="12">
            <CSelect
              label="گروه دسترسی"
              :options="role_groups"
              :value.sync="selected_group"
              />


          </CCol>
        </CRow>


      </CCardBody>
      <CCardFooter>
        <CButton v-if="status_form==0"
            @click="insert_data()"
             size="sm" color="primary">
          ثبت کاربر
        </CButton>
        <CButton v-if="status_form!=0"
            @click="insert_data()"
                 class="mr-1"
             size="sm" color="warning">
          ویرایش کاربر
        </CButton>
        <CButton v-if="status_form!=0"
            @click="cancel_form()"
                 class="mr-1"

             size="sm" color="danger">
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

var items = [];



export default {
  name: 'Login',
  data() {
    return {
      confirm_delete_name:new Date().getTime()+"_"+this.$vnode.tag,

      name: '',
      file: '',
      email: '',
      mobile: '',
      password: '',
      selected_group: 0,
      previewImage: '',
      description: '',
      items: [],
      role_groups: [],
      fields:[
        {key: 'row', label: '#', _style: 'width:10%'},
        {key: 'نام', _style: 'width:10%'},
        {key: 'ایمیل', _style: 'width:10%'},
        {key: 'موبایل', _style: 'width:10%;'},
        {key: 'role_group', label: 'گروه دسترسی', _style: 'width:10%;'},
        {key: 'عملیات', _style: 'width:10%;'},

      ],
      details: [],
      collapseDuration: 0,
      status_form: 0
    }
  },
  components: {},
  mounted() {

    bus.$on(this.confirm_delete_name, (data) => {
      if (data == 'true') {
        this.delete_admin();

      } else {
        this.status_form = 0;
      }
    });
    this.get_groups();
    this.get_admins();

  }, watch: {
    '$route.params.cat_id': function (id) {
      this.get_categories();
    },

  },
  methods: {
    editDetails(item){
      this.name=item.name
          this.email = item.email
          this.mobile = item.phone
          this.password = item.password
          this.selected_group = item.role_group.group_id
      this.status_form = item.id
          // this.previewImage = item
          // this.description = item
    },
    cancel_form(){
      this.name=''
          this.email=''
          this.mobile=''
          this.password =''
          this.selected_group = 0
      this.status_form = 0

    },
    insert_data() {


      let self = this;
      const formData = new FormData()
      let url;
      if (this.status_form == 0) {
        url = "/api/admin/user/insert_admin";
      } else {
        url = "/api/admin/user/update_admin";
        formData.append('id',this.status_form)
      }

      formData.append('image', this.file);
      formData.append('name', this.name);
      formData.append('mobile', this.mobile);
      formData.append('email', this.email);
      formData.append('password', this.password);
      formData.append('role_group', this.selected_group);

      axios.post(url, formData, {}).then((res) => {


        self.name = '';
        self.mobile = '';
        self.email = '';
        self.description = '';
        self.password = '';
        self.selected_group = 0;
        self.role_checkbox_items = [];
        self.previewImage = '';
        self.get_admins()
      }).catch(function (error) {

            console.log(error);
          });

    },

    get_groups() {
      var self = this;

      var formData = new FormData();

      axios.post('/api/admin/user/get_permission_group', formData, {}).then(function (response) {

        var content_cats = response.data.groups;
        self.role_groups = self.sort_array([{label:'انتخاب کنید',value:0}],content_cats,'id','name')

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    get_admins() {
      var self = this;
      console.log("route id " + this.$route.params.cat_id);
      var formData = new FormData();
      axios.post('/api/admin/user/get_admin', formData, {}).then(function (response) {

        var content_cats = response.data;

        self.items = content_cats.map((item, row_id) => {
          return {...item, row_id}
        });

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    delete_user(item) {
      this.$root.modal_component.show_confirm_modal('اخطار', "آیا مایل به حذف این کاربر هستید؟", ['تایید'], this.confirm_delete_name);

      this.status_form = item.id;

    },

    delete_admin() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/user/delete_admin";


      formData.append('id', this.status_form);

      axios.post(url, formData, {}).then((res) => {

        self.status_form = 0;

        self.get_admins();


      })
          .catch(function (error) {

            console.log(error);
          });
    },
  }
}


</script>
