<template>
  <div class="wrapper">
    <l-nav current-menu-item="finance"></l-nav>
    <div class="main-panel" id="main-panel">
      <l-header title="Финансы" />
      <div class="content">
        <div class="row">
          <div v-for="book in books" v-bind:key="book.title" class="col-12 col-md-6">
            <router-link :to="book.link" class="text-decoration-none">
              <div class="card bg-primary text-white text-center shadow-lg py-5">
                <h4 class="card-title mt-0">{{book.title}}</h4>
                <span :class="book.iconClass"></span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LNav from "./blocks/LNav";
import LHeader from "./blocks/LHeader";
export default {
  name: "FinancePage",
  components: {
    LNav,
    LHeader
  },
  data() {
    return {
      books: [
        {
          title: "Клиники",
          link: "/finance/clinics/",
          iconClass: "jam jam-cog"
        },
        {
          title: "Врачи",
          link: "/finance/doctors/",
          iconClass: "jam jam-cog"
        }
      ]
    };
  }
};
</script>

<style>
</style>