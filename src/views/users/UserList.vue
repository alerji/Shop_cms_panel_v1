<template>
  <div>

      <CButton
          color="primary"
          variant="outline"
          square
          size="sm"
          @click="goAddUser()"
      >افزودن کاربر
      </CButton>
          <CCardBody>

          <CDataTable
              :items="items"
              :fields="fields"

              :items-per-page="20"
              hover
              sorter
              pagination
          >
              <template #ردیف="{item}">

                  <td>
                      <p class="text-muted">{{item.user_id}}</p>

                  </td>

              </template>
              <template #نام="{item}">

                  <td>
                      <p class="text-muted">{{item.name}}</p>

                  </td>

              </template>

              <template #ایمیل="{item}">

                  <td>
                      <p class="text-muted">{{item.email}}</p>

                  </td>

              </template>
              <template #موبایل="{item}">

                  <td>
                      <p class="text-muted">{{item.phone}}</p>

                  </td>

              </template>
              <template #تاریخ="{item}">

                  <td>
                      <p class="text-muted">{{item.register_date}}</p>

                  </td>

              </template>
              <template #خبرها="{item}">

                  <td>
                      <p class="text-muted">{{item.post_count}}</p>

                  </td>

              </template>


              <template #تصویر="{item}">


                  <td>
                    <CImg width="50px" height="50px" v-bind:src="item.image"  />
                  </td>

              </template>

              <template #عملیات="{item,index}">
                  <td class="py-2">
                      <CButton
                          color="warning"
                          variant="outline"
                          square
                          size="sm"
                          @click="editDetails(item)"
                      >ویرایش کاربر
                      </CButton>
                      <CButton
                          color="danger"
                          variant="outline"
                          square
                          size="sm"
                          @click="delete_user(item,index)"
                      >حذف کاربر
                      </CButton>
                  </td>
              </template>



          </CDataTable>
          </CCardBody>


  </div>

</template>

<script>
    import axios from "axios";
import  { bus } from '../../main';
    var items = [

    ];

    const fields = [
        { key: 'ردیف', _style:'width:10%' },
        { key: 'نام', _style:'width:10%' },
        { key: 'ایمیل', _style:'width:10%' },
        { key: 'موبایل', _style:'width:10%;' },
        { key: 'تاریخ', _style:'width:10%;' },
        { key: 'خبرها', _style:'width:10%;' },
        { key: 'تصویر', _style:'width:10%;' },
        { key: 'عملیات', _style:'width:30%;' },

    ];


    export default {
        name: 'Login',
        data() {
            return {
                name: '',
                file: '',
                color: '',
                previewImage: '',
                description: '',
                items: items.map((item, id) => { return {...item, id}}),
                fields,
                details: [],
                collapseDuration: 0,
                status_form:0
            }
        },components: {
        },mounted() {
            // console.log(this.$root.modal2);
            // console.log(this.$root.modal2);
            // this.$refs.modal2.show_confirm_modal('اخطار',"آیا مایل به حذف این کاربر هستید؟",['تایید'],'delete_confirm');

            // console.log(this.router.$refs.root_view);
            // console.log(this.router.$refs.modal2);

            bus.$on('delete_confirm', (data) => {
                // alert(data);
                if (data == 'true') {
                    this.delete_admin();

                } else {
                    this.status_form = 0;
                }            });
this.get_admins();

        },watch: {
            '$route.params.cat_id': function (id) {
                this.get_categories();
            },

        },
        methods: {
            get_style(color) {
                return {
                    myStyle: {
                        backgroundColor: color
                    }
                }
            },
            editDetails(item) {

                this.$router.push({ path: '/dashboard/users/edit-user/'+this.items[item.id].user_id});

                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                // this.name = this.items[item.id].name;
                // this.color = this.items[item.id].color;
                // this.description = this.items[item.id].description;
                // this.previewImage = this.items[item.id].image;
                // this.status_form = this.items[item.id].cat_id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },
            delete_user(item) {
                this.$root.modal_component.show_confirm_modal('اخطار',"آیا مایل به حذف این کاربر هستید؟",['تایید'],'delete_confirm');
                // this.$refs.modal2.show_confirm_modal('اخطار',"آیا مایل به حذف این کاربر هستید؟",['تایید'],'delete_confirm');
                // console.log(this.$el.modal2.title2);
                // console.log(this.modals2.title2);
                // console.log(this.$root.modal2.title2);
                // console.log(this.$root.modal_component.title2);
                // console.log(this.modal2.title2);

                // this.$set(this.items[item.id], '_toggled', !item._toggled)

                this.status_form = this.items[item.id].user_id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },get_admins(){
               var self = this;
                console.log("route id "+this.$route.params.cat_id);

                axios.get(  '/api/admin/users', {

                }).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.items =  content_cats.admins.map((item, id) => { return {...item, id}}),
                        fields;
                   // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
            .catch(function (error) {
                    self.message = 'Incorrect E-mail or password';
                    self.showMessage = true;
                    console.log(error);
                });

            },
            goRegister(){
                this.$router.push({ path: 'register' });
            },goAddUser(){

                this.$router.push({ path: '/dashboard/users/add-user'});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },delete_admin(){


                let self = this;
                const formData = new FormData()
                let url;
                    url = "/api/admin/admins/delete";


                formData.append('admin_id', this.status_form);

                axios.post(url, formData, {
                }).then((res) => {
                    console.log(res);
if(res.data.error==1){
    this.$root.modal_component.show_danger_modal('خطا',res.data.msg);

}else{
    this.$root.modal_component.show_success_modal('تایید',res.data.msg);

}
                        self.status_form=0;

                        self.get_admins();


                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },
        }
    }


</script>
