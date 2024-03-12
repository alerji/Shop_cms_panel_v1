<template>
    <div>
<CCard>
  <CCardHeader>

    لیست نوشته ها
    <CButton
        color="primary"
        variant="outline"
        square
        size="sm"
        @click="goAddNews()"
    >افزودن نوشته
    </CButton>
  </CCardHeader>
  <CCardBody>
    <CTabs>
      <CTab title="منتشر شده" active>
        <CDataTableFixed
            :items="items_active"
            :fields="fields"
            striped
column-filter
            :items-per-page="20"
            hover
            sorter
            pagination
        >
          <template #row="{item,index}">

            <td>
              <p class="text-muted">{{index+1}}</p>

            </td>

          </template>



          <template #image="{item}">
            <td>
              <CImg width="50px" height="50px" v-bind:src="item.image"  />
            </td>
          </template>
          <template #date="{item}">
            <td>
              <p class="text-muted">{{get_date(item.date)}}</p>
            </td>
          </template>

          <template #operation="{item,index}">
            <td class="py-2">
              <CButton
                  color="primary"
                  variant="outline"
                  square
                  class="mr-1"
                  size="sm"
                  @click="editDetails(item)"
              ><CIcon name="cil-pencil" size="sm"/>
              </CButton>

              <CButton
                  color="danger"
                  variant="outline"
                  square
                  class="mr-1"

                  size="sm"
                  @click="delete_dialog(item)"
              ><CIcon name="cil-trash" size="sm"/>
              </CButton>
            </td>
          </template>



        </CDataTableFixed>

      </CTab>

      <CTab title="منتشر نشده" >
        <CDataTableFixed
            :items="items_deactive"
            :fields="fields"

            :items-per-page="20"
            hover
            sorter
            pagination
        >
          <template #row="{item}">

            <td>
              <p class="text-muted">{{item.post_id}}</p>

            </td>

          </template>
          <template #عنوان="{item}">

            <td>
              <p class="text-muted">{{item.title}}</p>

            </td>

          </template>

          <template #توضیحات="{item}">

            <td>
              <p class="text-muted">{{item.summary.substring(0,20)+"..."}}</p>

            </td>

          </template>
          <template #کاربر="{item}">

            <td>
              <p class="text-muted">{{item.user}}</p>

            </td>

          </template>
          <template #تاریخ="{item}">

            <td>
              <p class="text-muted">{{item.date}}</p>

            </td>

          </template>
          <template #نمایش="{item}">

            <td>
              <p class="text-muted">{{item.view_count}}</p>

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
                  color="primary"
                  variant="outline"
                  square
                  size="sm"
                  @click="editDetails(item)"
              ><CIcon name="cil-pencil" size="sm"/>
              </CButton>
              <CButton
                  color="danger"
                  variant="outline"
                  square
                  size="sm"
                  @click="delete_dialog(item)"
              ><CIcon name="cil-trash" size="sm"/>
              </CButton>
            </td>
          </template>



        </CDataTableFixed>

      </CTab>
      <CTab title="حذف شده" >
        <CDataTableFixed
            :items="items_deleted"
            :fields="fields"

            :items-per-page="20"
            hover
            sorter
            pagination
        >
          <template #row="{item}">

            <td>
              <p class="text-muted">{{item.post_id}}</p>

            </td>

          </template>
          <template #عنوان="{item}">

            <td>
              <p class="text-muted">{{item.title}}</p>

            </td>

          </template>

          <template #توضیحات="{item}">

            <td>
              <p class="text-muted">{{item.summary.substring(0,20)+"..."}}</p>
            </td>

          </template>
          <template #کاربر="{item}">

            <td>
              <p class="text-muted">{{item.user}}</p>

            </td>

          </template>
          <template #تاریخ="{item}">

            <td>
              <p class="text-muted">{{item.date}}</p>

            </td>

          </template>
          <template #نمایش="{item}">

            <td>
              <p class="text-muted">{{item.view_count}}</p>

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
                  color="primary"
                  variant="outline"
                  square
                  class="mr-1"
                  size="sm"
                  @click="editDetails(item)"
              ><CIcon name="cil-pencil" size="sm"/>
              </CButton>

            </td>
          </template>



        </CDataTableFixed>

      </CTab>
    </CTabs>
  </CCardBody>

</CCard>

    </div>

</template>

<script>
    import axios from "axios";
    import {bus} from "../../../main";



    export default {
        name: 'Login',
        components: {
            // Use the <ckeditor> component in this view.
           // ckeditor: CKEditor.component
        },
        data() {
            return {
              confirm_delete_name:new Date().getTime()+"_"+this.$vnode.tag,

              name: '',
                file: '',
                color: '',
                previewImage: '',
                description: '',
                test_sub:'asd',
                items_active:[],
                fields:[
                  {key: 'row',label:'#', _style: 'width:5%'},
                  {key: 'image',label:'تصویر', _style: 'width:10%;'},

                  {key: 'title',label:'عنوان', _style: 'width:20%'},
                  {key: 'user',label:'کاربر', _style: 'width:10%;'},
                  {key: 'date',label:'تاریخ', _style: 'width:10%;'},
                  {key: 'views',label:'نمایش', _style: 'width:5%;'},
                  {key: 'operation',label:'عملیات', _style: 'width:10%;'},

                ],
                items_deactive:[],
                items_deleted:[],
                details: [],
                collapseDuration: 0,
                status_form: 0
            }
        }, mounted() {
            this.get_news();
            bus.$on(this.confirm_delete_name, (data) => {
                // alert(data);
                if (data=='true'){
                    this.delete_item();

                }else{
                    this.status_form = 0;
                }
            });
        }, watch: {

        },
        methods: {

            editDetails(item) {
              console.log("item edit is",item)
              this.$router.push({path:"/dashboard/news/edit-news/"+item.id});
            },
          get_news() {
                var self = this;
                // console.log("route id "+this.$route.params.cat_id);

                axios.get('/api/admin/blog/get_posts', {}).then(function (response) {

                    var contents = response.data;


                    self.items_active = contents.posts_active.map((item, row_id) => {
                        return {...item, row_id}
                    })
                    self.items_deactive = contents.posts_deactive.map((item, row_id) => {
                        return {...item, row_id}
                    })
                    self.items_deleted = contents.posts_deleted.map((item, row_id) => {
                        return {...item, row_id}
                    })

                })
                    .catch(function (error) {
                        console.log(error);
                    });

            },
            goRegister() {
                this.$router.push({path: 'register'});
            }, goAddNews() {

                this.$router.push({path: '/dashboard/news/add-news'});
            },
            delete_dialog(item) {
                this.$root.modal_component.show_confirm_modal('اخطار',"آیا مایل به حذف این ردیف هستید؟",['تایید'],this.confirm_delete_name);


                this.status_form = item.id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },
            delete_item(){


                let self = this;
                const formData = new FormData()
                let url;
                url = "/api/admin/blog/delete_post";


                formData.append('id', this.status_form);

                axios.post(url, formData, {
                }).then((res) => {
                    if(res.data.error==1){
                        this.$root.modal_component.show_danger_modal('خطا',res.data.msg);

                    }else{
                        this.$root.modal_component.show_success_modal('تایید',res.data.msg);

                    }
                    self.status_form=0;

                    self.get_news();


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
