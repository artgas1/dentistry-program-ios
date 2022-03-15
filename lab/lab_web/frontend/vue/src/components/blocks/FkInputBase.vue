<template>
  <div></div>
</template>
<script>
export default {
  props: [
    "className",
    "name",
    "type",
    "value",
    "label",
    "required",
    "placeholder"
  ],
  computed: {
    cssId: function() {
      return "input_" + this.name;
    },
    cssClass: function() {
      return "form-control" + (this.className ? " " + this.className : "");
    },
    isRequired: function() {
      return this.required === undefined ? false : !!this.required;
    }
  }
};
</script>
