<template>
  <div>
    <button
      class="btn btn-primary w-100"
      @click="modalShown = true"
      v-if="buttonShown && allShownItems.length"
    >{{title}}</button>
    <modal v-if="modalShown" :show.sync="modalShown" :show-close="true">
      <template slot="header">
        <div class="d-flex justify-content-between align-items-center w-100">
          <h5 class="m-0">{{title}}</h5>
          <a
            href="#"
            @click="event => {event.preventDefault(); modalShown = false; return false;}"
            data-dismiss="modal"
          >
            <h5 class="text-danger text-decoration-none font-weight-bold m-0">
              <i class="jam jam-close"></i>
            </h5>
          </a>
        </div>
      </template>
      <template slot="close-button"></template>
      <input
        type="text"
        class="form-control"
        :placeholder="searchInputPlaceholder"
        v-model="searchQuery"
      />
      <ul class="nav nav-pills nav-pills-primary mt-3" role="tablist">
        <li class="nav-item" v-if="searchQuery">
          <a
            href="#"
            @click="event => {event.preventDefault(); allItemsShown = false; return false;}"
            class="nav-link py-1 px-2"
            v-bind:class="{'active': !allItemsShown}"
          >Результаты поиска</a>
        </li>
        <li class="nav-item">
          <a
            href="#"
            @click="event => {event.preventDefault(); allItemsShown = true; return false;}"
            class="nav-link py-1 px-2"
            v-bind:class="{'active': allItemsShown}"
          >Все</a>
        </li>
      </ul>
      <div class="mt-3">
        <div class="suggestions" v-if="multiple">
          <a
            href="#"
            @click="event => {event.preventDefault(); item.$checked = !item.$checked; return false;}"
            v-for="item in shownItems"
            v-bind:key="item.idx"
            class="d-flex align-items-center p-2 border-bottom text-decoration-none suggestion"
          >
            <input
              type="checkbox"
              :checked="item.$checked"
              @change="item.$checked = $event.target.checked"
              @click="event => event.stopPropagation()"
              class="mr-3"
            />
            <slot name="addItemRow" v-bind:item="item"></slot>
          </a>
        </div>
        <div class="suggestions" v-else>
          <a
            data-dismiss="modal"
            href="#"
            @click="event => {event.preventDefault(); choose(item); return false}"
            v-for="item in shownItems"
            v-bind:key="item.idx"
            class="d-flex p-2 border-bottom text-decoration-none suggestion"
          >
            <slot name="addItemRow" v-bind:item="item"></slot>
          </a>
        </div>
      </div>
      <nav v-if="pagesCount > 1">
        <ul class="pagination">
          <li class="page-item disabled">
            <a
              class="page-link"
              href="#"
              tabindex="-1"
              :disabled="currentPage < 2"
              @click="event => {event.preventDefault(); currentPage -= 1; return false; }"
            >Назад</a>
          </li>
          <li class="page-item" v-for="page in pageNums()" v-bind:key="page">
            <a
              class="page-link"
              href="#"
              @click="event => {event.preventDefault(); currentPage = page; return false;}"
            >
              {{page}}
              <span class="sr-only" v-if="page == currentPage">(current)</span>
            </a>
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="#"
              :disabled="currentPage == pagesCount"
              @click="event => {event.preventDefault(); currentPage += 1; return false }"
            >Далее</a>
          </li>
        </ul>
      </nav>
      <p
        v-if="(allItemsShown || searchQuery) && !shownItems.length"
        class="text-center p-4 text-muted"
      >Ничего не найдено</p>
      <template slot="footer" v-if="multiple">
        <button
          class="btn btn-primary"
          @click="choose(allItems.filter(x => x.$checked))"
        >Выбрать отмеченнные</button>
      </template>
    </modal>
  </div>
</template>

<script>
import Modal from "../../now-ui/src/components/Modal";
export default {
  name: "LChooser",
  components: { Modal },
  props: {
    allItemsList: {
      type: Array,
      required: false,
      default: null
    },
    allItemsLoader: {
      type: Function,
      required: false,
      default: null
    },
    title: {
      type: String,
      default: "Добавить элемент"
    },
    buttonShown: {
      type: Boolean,
      default: true
    },
    searchInputPlaceholder: {
      type: String,
      default: "Введите запрос"
    },
    searchFilter: {
      type: Function,
      default: () => true
    },
    filter: {
      type: Function,
      default: () => true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data: () => ({
    searchQuery: "",
    allItemsShown: true,
    currentPage: 1,
    modalShown: false,
    allItems: []
  }),
  computed: {
    searchResults() {
      return this.allItems.filter(item =>
        this.searchFilter(item, this.searchQuery)
      );
    },
    allShownItems() {
      return (this.allItemsShown ? this.allItems : this.searchResults).filter(
        this.filter
      );
    },
    shownItems() {
      return this.allShownItems.slice(
        this.pageSize * (this.currentPage - 1),
        this.pageSize * this.currentPage
      );
    },
    pagesCount() {
      return Math.floor(this.allShownItems.length / this.pageSize) + 1;
    }
  },
  watch: {
    searchQuery() {
      this.allItemsShown = !this.searchQuery.length;
    }
  },
  methods: {
    pageNums() {
      let nums = [];
      for (let i = 1; i <= this.pagesCount; ++i) {
        nums.push(i);
      }
      return nums;
    },
    initItems() {
      if (this.allItemsLoader instanceof Function) {
        this.allItemsLoader().then(items => {
          this.allItems = items.map(x => {
            x.$checked = false;
            return x;
          });
        });
      } else {
        this.allItems = this.allItemsList.map(x => {
          x.$checked = false;
          return x;
        });
      }
    },
    choose(value) {
      this.$emit("choose", value);
      this.modalShown = false;
      this.searchQuery = "";
      this.initItems();
    }
  },
  created() {
    this.initItems();
  }
};
</script>

<style>
.suggestion:last-child {
  border-bottom: none !important;
}
.suggestion:hover {
  background: rgba(0, 0, 0, 0.05);
}
.suggestion {
  transition-duration: 0.15s;
}
</style>