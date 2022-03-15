<template>
  <!-- Navbar -->
  <div>
    <nav class="navbar navbar-expand-lg navbar-transparent bg-primary navbar-absolute">
      <div class="container-fluid">
        <div class="navbar-wrapper">
          <div class="navbar-toggle">
            <button
              type="button"
              class="navbar-toggler"
              @click="toggled = !toggled"
              :class="{'toggled': toggled}"
            >
              <span class="navbar-toggler-bar bar1"></span>
              <span class="navbar-toggler-bar bar2"></span>
              <span class="navbar-toggler-bar bar3"></span>
            </button>
          </div>
          <a class="navbar-brand" href="#pablo">{{ title }}</a>
        </div>
      </div>
    </nav>
    <!-- End Navbar -->
    <div class="panel-header panel-header-md">
      <div class="container-fluid">
        <div class="container-fluid">
          <div class="d-block d-md-flex align-items-center">
            <h2 class="text-white font-weight-100 mb-0">{{ title }}</h2>
            <div class="mt-3 mt-md-0 ml-md-auto d-block d-md-flex align-items-center">
              <button
                v-for="button in buttons"
                v-bind:key="button.text"
                class="btn btn-primary ml-md-3 w-100 w-md-auto shadow-sm font-weight-bold text-uppercase text-decoration-none"
                @click="button.click"
              >
                <span v-html="button.text"></span>
              </button>
            </div>
          </div>
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LHeader",
  props: {
    title: {
      type: String
    },
    buttons: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      toggled: false
    };
  },
  watch: {
    toggled() {
      if (this.toggled) {
        document.querySelector(".wrapper").classList.add("nav-open");
      } else {
        document.querySelector(".wrapper").classList.remove("nav-open");
      }
    }
  }
};
</script>

<style>
.panel-header.panel-header-md {
  min-height: 260px;
  height: auto;
}
</style>