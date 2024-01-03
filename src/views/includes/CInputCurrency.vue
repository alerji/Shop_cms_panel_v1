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
      <input
              v-bind="$attrs"
              v-on="listeners"
              :id="safeId"
              :type="type"
              :class="inputClasses"
              :readonly="readonly || plaintext"
              :value="state"
              @input="onInput($event)"
              @change="onChange($event)"
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
    components: {CFormGroup},
    mixins,
    props,
    data() {
      return {

        state: this.value,
        syncTimeout: null
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
        if(this.state=="."){
          this.state="0."
        }else if(this.state!='0.'){
          this.state = this.commaOnly(this.state).replace(/,/g, '');
          this.state = this.get_my_currency(this.state)

        }
        // console.log(this.state);

      }
    },
    methods: {
      get_my_currency(number) {
        var fixed = parseInt(localStorage.getItem('currency_digits'));
        if(this.whitout_decimal) {
          fixed=7;
        }
        if(number.split('.').length>2){
          number = number.split('.')[0]+"."+number.split('.')[1]
        }
        if (number.toString().includes(".") && number.split('.')[1].length>fixed) {

          var final_number = parseFloat(number);
          number = final_number.toFixed(fixed);

          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        } else {
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

        }
      },
      onInput(e) {
        var fixed = parseInt(localStorage.getItem('currency_digits'));
        if(this.whitout_decimal) {
          fixed=7;
        }
        e.target.value = e.target.value.replace(/,/g, '')
        if (e.target.value.includes(".") && e.target.value.split('.')[1].length>fixed) {

          var final_number = parseFloat(e.target.value);

          e.target.value = final_number.toFixed(fixed);
        }
        this.state = e.target.value
        this.$emit('input', this.state, e)
        if (this.lazy === true) {
          return
        }

        clearTimeout(this.syncTimeout)
        this.syncTimeout = setTimeout(() => {
          this.$emit('update:value', this.state, e)
        }, this.lazy !== false ? this.lazy : 0)
      },
      onChange(e)
      {
        this.$emit('change', this.state, e)
        this.$emit('update:value', this.state, e)
      },
      commaOnly(input)
      {
        if(input==""){
          return "";
        }
        var value = input;
        var values = value.split("");

        var update = "";

        // var expression=/(^\d+$)|(^\d+\.\d+$)|[,\.]/;
        var finalExpression = /^[0-9.]+$/;
        values.forEach((val) => {

          // if (expression.test(values[val])==true && values[val]!=''){
          //     transition+=''+values[val].replace('.',',');
          if (finalExpression.test(val) == true) {
            update += '' + val;
          }
          // }
        });

        return update;
      }
    },


  }
</script>
