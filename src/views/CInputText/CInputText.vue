<template>
  <CFormGroup
      class="material-input-wrapper"
          v-bind="{append, prepend, validFeedback, invalidFeedback,
        tooltipFeedback, description, wrapperClasses, class: computedClasses}"
  >

    <template #input>
      <input
              v-bind="$attrs"
              v-on="listeners"
              :id="safeId"
              required
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
    <template #label-after-input>
      <slot name="label">
        <label v-if="label" :for="safeId"  :class="'placeholder '">
          {{ label }}
        </label>
      </slot>
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

    },
    methods: {
      onInput(e) {

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

    },


  }
</script>
