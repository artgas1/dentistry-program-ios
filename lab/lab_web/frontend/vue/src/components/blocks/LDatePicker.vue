<template>
  <datepicker
    ref="dpicker"
    :format="format"
    :language="language"
    :typeable="typeable"
    :input-class="`form-control ${inputClass?inputClass:''}`"
    :calendar-class="`shadow-lg border-0 ${calendarClass?calendarClass:''}`"
    :full-month-name="true"
    :value="i_value"
    @input="value => this.emitChange(value)"
    @selected="value => this.emitChange(value)"
    @cleared="emitChange(null)"
  />
</template>

<style>
.vdp-datepicker__calendar {
  bottom: 100% !important;
}
.vdp-datepicker__calendar .cell.selected {
  background: #00bcd4;
  color: #fff;
  border-radius: 0;
  font-weight: 600;
}
.vdp-datepicker input {
  background: white !important;
  cursor: pointer !important;
}
.vdp-datepicker__calendar header span.prev,
.vdp-datepicker__calendar header span.next {
  color: #00bcd4 !important;
  height: 40px;
  line-height: 40px;
  font-size: 24px;
  text-indent: 0 !important;
}
.vdp-datepicker__calendar header span.prev::after,
.vdp-datepicker__calendar header span.next::after {
  display: none !important;
}
</style>

<script>
import Datepicker from "vuejs-datepicker";
import { ru } from "vuejs-datepicker/dist/locale";
import DateUtils from "vuejs-datepicker/src/utils/DateUtils";
let props = Datepicker.props;
props.language.default = () => ru;
props.format.default = "dd.MM.yyyy";
props.typeable.default = true;
export default {
  name: "LDatePicker",
  components: {
    Datepicker
  },
  props: Object.assign(Datepicker.props, {
    value: {
      type: [Date, String],
      default: new Date().toString()
    }
  }),
  data() {
    return {
      ru: ru,
      i_value: null
    };
  },
  created() {
    if (this.value instanceof Date) {
      this.emitChange(this.value);
    }
    this.i_value = this.value;
    this.$on("value", value => {
      this.i_value = value;
      this.emitChange(value);
    });
  },
  mounted() {
    let picker = this.$refs.dpicker,
      prevSpans = picker.$el.querySelectorAll("span.prev"),
      nextSpans = picker.$el.querySelectorAll("span.next");
    prevSpans.forEach(prevSpan => {
      prevSpan.innerHTML = "";
      prevSpan.className = "jam jam-arrow-left prev";
    });
    nextSpans.forEach(nextSpan => {
      nextSpan.innerHTML = "";
      nextSpan.className = "jam jam-arrow-right next";
    });
  },
  methods: {
    emitChange(value) {
      if (value == null) {
        this.$emit("input", value);
        return;
      }
      this.$emit(
        "input",
        DateUtils.formatDate(value, this.format, this.language)
      );
    }
  }
};
</script>