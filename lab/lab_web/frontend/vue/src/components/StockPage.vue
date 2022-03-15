<template>
  <div class="wrapper">
    <l-nav current-menu-item="stock"></l-nav>
    <div class="main-panel" id="main-panel">
      <l-header title="Склад" :buttons="buttons" />
      <div class="content">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-body">
                <l-table
                  v-if="materials.length"
                  :columns="['ID','Наименование', 'Единица измерения', 'Доступно', 'Лимит', 'Комментарий', 'Действия']"
                >
                  <tr v-for="material in materials" v-bind:key="material.id">
                    <td>{{material.material.id}}</td>
                    <td>{{material.material.material_name}}</td>
                    <td>1 {{material.material.unit}}</td>
                    <td>{{material.amount}} {{material.material.unit}}</td>
                    <td>{{material.material.limit}} {{material.material.unit}}</td>
                    <td>{{material.comment}}</td>
                    <td class="item-actions">
                      <h5 class="m-0">
                        <a
                          href="#"
                          @click="addMaterialRequested($event, material)"
                          title="Добавить на склад"
                        >
                          <i class="jam jam-plus"></i>
                        </a>
                        <a
                          @click="releaseMaterialRequested($event, material)"
                          href="#"
                          class="zub-release-material"
                          title="Cписать со склада"
                        >
                          <i class="jam jam-cutter text-danger"></i>
                        </a>
                      </h5>
                    </td>
                  </tr>
                </l-table>
                <div class="text-center text-muted p-4" v-if="!materials.length">
                  Нет материалов
                  <br />
                  <br />Добавьте материал, используя кнопку "Добавить"
                </div>
              </div>
            </div>
          </div>
          <l-footer />
        </div>
      </div>
    </div>
    <modal v-if="showModal" :show.sync="showModal">
      <template slot="header">
        <div class="d-flex justify-content-between align-items-center w-100">
          <h5 class="m-0" v-if="modalMode === 'add'">Добавить на склад</h5>
          <h5 class="m-0" v-else-if="modalMode === 'release'">Списать со склада</h5>
          <a href="#" @click="showModal = false; return false;" data-dismiss="modal">
            <h5 class="text-danger text-decoration-none font-weight-bold m-0">
              <i class="jam jam-close"></i>
            </h5>
          </a>
        </div>
      </template>
      <template slot="close-button"></template>
      <div class="form-group">
        <label class="control-label">Материал</label>
        <input
          type="text"
          readonly
          class="form-control"
          :value="materialOnStock.material.material_name"
        />
      </div>
      <div class="form-group">
        <label class="control-label">Дата</label>
        <l-date-picker v-model="materialOnStock.date" />
      </div>
      <div class="form-group">
        <label class="control-label">Количество</label>
        <input
          type="number"
          min="1"
          class="form-control"
          v-model="materialOnStock.amount"
          @input="materialOnStock.amount = parseInt($event.target.value)"
        />
      </div>
      <div class="form-group" v-if="modalMode === 'add'">
        <label class="control-label">Стоимость</label>
        <div class="input-group">
          <input
            class="form-control"
            type="number"
            :min="1"
            v-model="materialOnStock.cost"
            @input="materialOnStock.cost = parseInt($event.target.value)"
          />
          <div class="input-group-append">
            <span class="input-group-text">&#x20bd;</span>
          </div>
        </div>
      </div>
      <template slot="footer">
        <button
          class="btn btn-primary"
          @click="doAddToStock($event)"
          v-if="modalMode === 'add'"
        >Добавить</button>
        <button
          class="btn btn-primary"
          @click="doReleaseFromStock($event)"
          v-if="modalMode === 'release'"
        >Списать</button>
      </template>
    </modal>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import LNav from "./blocks/LNav";
import LHeader from "./blocks/LHeader";
import LTable from "./blocks/LTable";
import LFooter from "./blocks/LFooter";
import Materials from "../api/materials";
import Modal from "../now-ui/src/components/Modal";
import LDatePicker from "./blocks/LDatePicker";

export default {
  name: "StockPage",
  components: {
    LNav,
    LHeader,
    LTable,
    LFooter,
    Modal,
    LDatePicker
  },
  data() {
    return {
      buttons: [
        {
          text: "Добавить&nbsp;материал",
          click: event => {
            event.preventDefault();
            this.$router.push("/materials/add/");
            return false;
          }
        }
      ],
      materials: [],
      showModal: false,
      materialOnStock: null, 
      modalMode: "add",
    };
  },
  created() {
    this.loadMaterials();
  },
  methods: {
    loadMaterials() {
      Materials.OnStock.get().then(
        response => (this.materials = response.data)
      );
    },
    addMaterialRequested(event, material) {
      event.preventDefault();
      this.materialOnStock = { material: material.material };
      this.showModal = true;
      this.modalMode = "add";
      return false;
    },
    releaseMaterialRequested(event, material) {
      event.preventDefault();
      this.materialOnStock = { material: material.material };
      this.showModal = true;
      this.modalMode = "release";
      return false;
    },
    doAddToStock(event) {
      event.preventDefault();
      this.showModal = false;
      Materials.Adding.create(
        Object.assign({}, this.materialOnStock, {
          material: this.materialOnStock.material.id
        })
      ).then(this.loadMaterials);
      this.materialOnStock = {};
      return false;
    },
    doReleaseFromStock(event) {
      event.preventDefault();
      if (window.confirm("Вы уверены?")) {
        this.showModal = false;
        Materials.Adding.create(
          Object.assign({}, this.materialOnStock, {
            material: this.materialOnStock.material.id,
            amount: -1 * this.materialOnStock.amount,
            cost: 0
          })
        ).then(this.loadMaterials);
        this.materialOnStock = {};
      }
      return false;
    }
  }
};
</script>

<style>
input:read-only {
  cursor: default !important;
}
.item-actions a:hover,
.item-actions a:focus,
.item-actions a:active {
  text-decoration: none !important;
}
</style>
