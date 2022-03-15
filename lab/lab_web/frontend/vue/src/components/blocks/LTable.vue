<template>
  <div class="table-responsive p-0 m-0">
    <table class="table table-shopping  p-0 m-0" style="table-layout: auto;">
      <thead class="text-primary font-weight-bold">
        <tr>
          <th v-for="column in columns" v-bind:key="column" style="max-width: 12.5%;">
            <p class="font-weight-bold">{{column}}</p>
          </th>
        </tr>
      </thead>
      <tbody>
        <slot></slot>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "LTable",
  props: {
    columns: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style scoped>
table th,
table td {
  text-align: center;
}
</style>