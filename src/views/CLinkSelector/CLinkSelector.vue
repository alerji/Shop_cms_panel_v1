<template>
  <CFormGroup
          v-bind="{append, prepend, validFeedback, invalidFeedback,
        tooltipFeedback, description, wrapperClasses, class: computedClasses}"
  >
    <template #label>
      <slot name="label">
        <label v-if="label" :for="safeId" :class="labelClasses">
          {{ label }}
        </label>
      </slot>
    </template>
    <template #input>
      <treeselect
          v-model="state"
          :async="true"
          :load-options="load_links"
          placeholder="جستجو لینک"
          :normalizer="normalizer_links"
      />
    </template>

    <template
            v-for="slot in $options.slots"
            #[slot]
    >
      <slot :name="slot"></slot>
    </template>
  </CFormGroup>
</template>

<script>
  import CFormGroup from '@coreui/vue/src/components/form/CFormGroup'
  import {inputProps as props} from '@coreui/vue/src/components/form/form-props'
  import * as allFormMixins from '@coreui/vue/src/components/form/form-mixins'

  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  import {ASYNC_SEARCH} from '@riophae/vue-treeselect'
  import axios from "axios";

  const simulateAsyncOperation = fn => {
    setTimeout(fn, 200)
  }
  props.whitout_decimal=Boolean;

  const mixins = Object.values(allFormMixins)

  export default {
    name: 'CInput',
    slots: [
      'prepend',
      'prepend-content',
      'append-content',
      'append',
      'label-after-input',
      'valid-feedback',
      'invalid-feedback',
      'description'
    ],
    inheritAttrs: false,
    components: {CFormGroup,
      Treeselect},
    mixins,
    props,
    data() {
      return {

        state: this.value,
        syncTimeout: null,
        load_links({action, searchQuery, callback}) {

          if (action === ASYNC_SEARCH) {
            simulateAsyncOperation(() => {
              let options;
              axios.post('/api/admin/site/search_links', {
                search: searchQuery,

              }).then(function (response) {
                options = response.data;
                callback(null, options);
                // localStorage.setItem("api_token", response.data.access_token);
                // self.$router.push({ path: 'notes' });
              })
                  .catch(function (error) {
                    console.log(error);
                  });


            })
          }
        },
        normalizer_links(node) {
          return {
            id: "/"+node.prefix+"/"+node.slug,
            label:node.name+" "+ node.title,
          }
        },
      }
    },
    mounted() {

    },
    computed: {

      listeners() {
        const {input, change, ...listeners} = this.$listeners // eslint-disable-line no-unused-vars
        return listeners
      }

    },
    watch:{
      'state':function (){

        this.$emit('input', this.state)
      }
    },
    methods: {
      onInput(e) {

        this.state = e.target.value
        this.$emit('input', this.state, e)
        if (this.lazy === true) {
          return
        }
        this.syncTimeout = setTimeout(() => {
          this.$emit('update:value', this.state, e)
        }, this.lazy !== false ? this.lazy : 0)
      },
      onChange(e)
      {
        this.$emit('change', this.state, e)
        this.$emit('update:value', this.state, e)
      },

    },


  }
</script>
