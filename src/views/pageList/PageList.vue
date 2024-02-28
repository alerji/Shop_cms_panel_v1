<template>
  <div>
    <CCard>
      <CCardHeader>

        لیست صفحات
        <CButton
            color="primary"
            variant="outline"
            square
            size="sm"
            @click="goAddNews()"
        >افزودن صفحه
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CDataTableFixed
            :items="items_active"
            :fields="fields"

            :items-per-page="20"
            hover
            sorter
            pagination
        >
          <template #row="{item,index}">
            <td>
              <p class="text-muted">{{ index + 1 }}</p>
            </td>
          </template>
          <template #title="{item,index}">
            <td>
              <p class="text-muted" v-if="item.title!=null">{{ item.title.title}}</p>
            </td>
          </template>


          <template #image="{item}">


            <td>
              <CImg width="50px" height="50px" v-bind:src="item.image"/>
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
                  @click="delete_dialog(item,index)"
              ><CIcon name="cil-trash" size="sm"/>
              </CButton>
            </td>
          </template>


        </CDataTableFixed>

      </CCardBody>

    </CCard>

  </div>

</template>

<script>
import axios from "axios";
import {bus} from "../../main";


export default {
  name: 'Login',
  components: {
    // Use the <ckeditor> component in this view.
    // ckeditor: CKEditor.component
  },
  data() {
    return {
      confirm_delete_name: new Date().getTime() + "_" + this.$vnode.tag,

      name: '',
      file: '',
      color: '',
      previewImage: '',
      description: '',
      test_sub: 'ssssssssssss',
      items_active: [],
      fields: [
        {key: 'row', label: '', _style: 'width:10%'},
        {key: 'title', label: 'عنوان', _style: 'width:10%'},
        {key: 'user', label: 'کاربر', _style: 'width:10%;'},
        {key: 'date', label: 'تاریخ', _style: 'width:10%;'},
        {key: 'views', label: 'نمایش', _style: 'width:10%;'},
        {key: 'image', label: 'تصویر', _style: 'width:10%;'},
        {key: 'operation', label: 'عملیات', _style: 'width:30%;'},

      ],
      items_deactive: [],
      items_deleted: [],
      details: [],
      collapseDuration: 0,
      status_form: 0
    }
  }, mounted() {
    this.get_news();
    bus.$on(this.confirm_delete_name, (data) => {
      // alert(data);
      if (data == 'true') {
        this.delete_item();

      } else {
        this.status_form = 0;
      }
    });
  }, watch: {},
  methods: {

    editDetails(item, index) {
      this.$router.push({path: "/dashboard/pages/edit/" + item.id});

    },
    get_news() {
      var self = this;
      // console.log("route id "+this.$route.params.cat_id);
var formData = new FormData();
      axios.post('/api/admin/page/get_pages',formData, {}).then(function (response) {

        var contents = response.data;


        self.items_active = contents.posts.map((item, row_id) => {
          return {...item, row_id}
        })

      })
          .catch(function (error) {
            console.log(error);
          });

    },
    goAddNews() {
      this.$router.push({path: '/dashboard/pages/add'});
    },
    delete_dialog(item) {
      this.$root.modal_component.show_confirm_modal('اخطار', "آیا مایل به حذف این ردیف هستید؟", ['تایید'], this.confirm_delete_name);


      this.status_form = item.id;

    },
    delete_item() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/page/delete_page";


      formData.append('id', this.status_form);

      axios.post(url, formData, {}).then((res) => {
        if (res.data.error == 1) {
          this.$root.modal_component.show_danger_modal('خطا', res.data.msg);

        } else {
          this.$root.modal_component.show_success_modal('تایید', res.data.msg);

        }
        self.status_form = 0;

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
