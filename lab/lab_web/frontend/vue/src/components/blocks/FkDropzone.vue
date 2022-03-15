<template>
  <div class="form-group border-sm">
    <label v-if="cssId && label" :for="cssId">{{ label }}</label>
    <div
      v-if="!files.length || multiple && filesCount < maxFiles"
      class="border border-light d-flex m-0 p-4 rounded row text-center file-input-area"
      @dragover="onDivDrop"
      @drop="onDivDrop"
      @click="onDivClick"
    >
      <h3 class="text-primary col-12 m-0">Перетащите файл сюда</h3>
      <p class="col-12 m-0 text-muted">или нажмите, чтобы выбрать файл с диска</p>
      <input
        type="file"
        :name="name"
        :id="cssId"
        ref="fileInput"
        class="file-input"
        @change="onInputChange"
        :multiple="multiple"
        :accept="allowedMimeTypes.join(', ')"
      />
    </div>
    <div v-if="files.length">
      <table :class="tableClass">
        <tbody>
          <tr
            v-for="file in files.filter(f => f.name && f.status !== FILE_STATUS_CANCELLED)"
            v-bind:key="file.idx"
          >
            <td>
              <p
                class="text-primary text-bender font-weight-700 m-0 lh-100"
              >{{ formatFileNameExt(file.name) }}</p>
              <p class="text-muted small m-0" v-if="file.size">{{ formatFileSize(file.size) }}</p>
            </td>
            <td class="text-right">
              <p
                v-if="file.status == FILE_STATUS_UPLOAD_ERROR"
                class="m-0 text-danger"
              >Ошибка при загрузке</p>
              <p
                v-if="file.status == FILE_STATUS_TOO_LARGE"
                class="m-0 text-danger"
              >Файл слишком большой</p>
              <p
                v-if="file.status == FILE_STATUS_DISALLOWED_MIME"
                class="m-0 text-danger"
              >Недопустимый тип файла</p>
              <p v-if="file.status == FILE_STATUS_PREPARING" class="m-0">Подготовка</p>
              <p
                v-if="file.status == FILE_STATUS_UPLOADING"
                class="m-0"
              >Загрузка {{ file.progress }}%</p>
              <p v-if="file.status == FILE_STATUS_UPLOADED" class="m-0 text-success">Загружен</p>
            </td>
            <td class="text-right">
              <a href="#" @click="removeFile($event, file.idx)" title="Удалить">
                <span class="h4 text-primary jam jam-close"></span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="lh-100 text-muted mt-2">
      <span class="small">Допустимые форматы: {{mimeTypes.join(", ")}}</span>
      <br />
      <span v-if="maxFileSize" class="small">Максимальный размер файла: {{maxFileSize}} МБ</span>
      <br />
      <span v-if="multiple && maxFiles" class="small">Максимальное количество файлов - {{maxFiles}}.</span>
    </div>
  </div>
</template>
<style lang="css" scoped>
.file-input {
  width: 0;
  height: 0;
  visibility: hidden;
}
.file-input-area:hover {
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
}
table tbody tr td {
  vertical-align: middle;
  border: none;
  padding: 0;
}
.jam {
  vertical-align: baseline;
  vertical-align: -webkit-baseline-middle;
}
</style>
<script>
import callAPI from "../../api/api";
import FkInputBase from "./FkInputBase";
import {formatFileSize, formatFileNameExt} from "../../utils";
const fullMimeTypes = {
  doc: "application/msword",
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/octet-stream"
  ],
  pdf: "application/pdf",
  zip: "application/zip",
  ppt: "application/vnd.ms-powerpoint",
  pptx:
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  jpg: "image/jpeg",
  png: "image/png",
  mp3: ["audio/mpeg", "audio/mp3"],
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};
const FILE_STATUS_UPLOAD_ERROR = -3;
const FILE_STATUS_TOO_LARGE = -2;
const FILE_STATUS_DISALLOWED_MIME = -1;
const FILE_STATUS_PREPARING = 0;
const FILE_STATUS_UPLOADING = 1;
const FILE_STATUS_UPLOADED = 2;
const FILE_STATUS_CANCELLED = 3;
function preventEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}
export default {
  name: "FkDropzone",
  extends: FkInputBase,
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    mimeTypes: {
      type: Array,
      default: () => [
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
        "png",
        "jpg",
        "zip",
        "mp3",
        "pdf"
      ]
    },
    maxFileSize: {
      type: Number,
      default: 10
    },
    maxFiles: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      files: [],
      filesCount: 0,
      FILE_STATUS_UPLOAD_ERROR,
      FILE_STATUS_TOO_LARGE,
      FILE_STATUS_DISALLOWED_MIME,
      FILE_STATUS_PREPARING,
      FILE_STATUS_UPLOADING,
      FILE_STATUS_UPLOADED,
      FILE_STATUS_CANCELLED,
      valueProcessed: false
    };
  },
  computed: {
    allowedMimeTypes() {
      var allowed = [];
      this.mimeTypes
        .filter(type => type in fullMimeTypes)
        .map(type => {
          var fullTypes = fullMimeTypes[type];
          (fullTypes instanceof Array ? fullTypes : [fullTypes]).map(t =>
            allowed.push(t)
          );
        });
      return allowed;
    },
    tableClass() {
      return `table${
        this.multiple && this.filesCount && this.filesCount < this.maxFiles
          ? " mt-4"
          : ""
      }`;
    }
  },
  watch: {
    value() {
      this.processValue();
    }
  },
  methods: {
    formatFileSize(fileSize){
      return formatFileSize(fileSize);
    },
    formatFileNameExt(fileName){
      return formatFileNameExt(fileName);
    },
    processValue() {
      if (this.valueProcessed || !this.value) {
        return;
      }
      let value = this.value;
      if (value instanceof Array) {
        if (value.length) {
          value.forEach(file =>
            this.addFile(
              Object.assign(file, {
                status: FILE_STATUS_UPLOADED,
                progress: 100
              })
            )
          );
        } else {
          return;
        }
      } else if (typeof value === "object" && value !== null) {
        this.addFile(
          Object.assign(value, {
            status: FILE_STATUS_UPLOADED,
            progress: 100
          })
        );
      }
      this.valueProcessed = true;
      this.emitChangeEvent();
    },
    emitChangeEvent() {
      let value = this.files
        .filter(f => f.id && f.status === FILE_STATUS_UPLOADED)
        .map(f => f.id);
      if (!(this.value instanceof Array)) {
        value = value.length ? value[0] : null;
      }
      this.$emit("input", value);
      this.$emit(
        "change",
        this.name,
        value
      );
    },
    addFile(file) {
      if(file instanceof Number){
        return; 
      }
      file.idx = this.files.length;
      this.files.push(file);
      this.filesCount++;
      return file.idx;
    },
    updateFile(idx, newData) {
      this.files.splice(idx, 1, Object.assign(this.files[idx], newData));
      return false;
    },
    updateFileStatus(idx, status) {
      return this.updateFile(idx, { status });
    },
    removeFile(event, idx) {
      preventEvent(event);
      if (this.multiple) {
        this.updateFile(idx, { status: FILE_STATUS_CANCELLED });
      } else {
        this.files.splice(idx, 1);
      }
      this.filesCount--;
      this.emitChangeEvent();
      return false;
    },
    handleFiles(fileList) {
      for (var i = 0; i < fileList.length; ++i) {
        if (this.filesCount == this.maxFiles) {
          this.$eventBus.$emit("ui-message", {
            type: "warning",
            text: "Превышено максимальное количество файлов"
          });
          break;
        }
        let file = fileList[i],
          status = FILE_STATUS_PREPARING;
        if (this.allowedMimeTypes.indexOf(file.type) == -1) {
          status = FILE_STATUS_DISALLOWED_MIME;
          /*this.$eventBus.$emit("ui-message", {
            type: "warning",
            text: `Недопустимый формат файла: ${file.type}`
          });*/
        } else if (this.maxFileSize * 1024 * 1024 < file.size) {
          status = FILE_STATUS_TOO_LARGE;
          /*this.$eventBus.$emit("ui-message", {
            type: "warning",
            text: `Превышен максимальный размер файла (${this.formatFileSize(
              file.size
            )} \
            при максимально допустимом в ${this.formatFileSize(
              this.maxFileSize * 1024 * 1024
            )})`
          });*/
        }
        let idx = this.addFile(
          Object.assign(file, {
            id: null,
            status: status,
            progress: 0
          })
        );
        if (status == FILE_STATUS_PREPARING) {
          file = this.files[idx];
          var formData = new FormData();
          formData.append("file", file);
          callAPI("/api/files/", "POST", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            },
            onUploadProgress: event => this.onUploadProgress(idx, event)
          })
            .then(response => this.onUploaded(idx, response))
            .catch(error => this.onUploadError(idx, error));
        }
      }
    },
    onDivClick(event) {
      preventEvent(event);
      this.$refs.fileInput.dispatchEvent(new MouseEvent("click"));
      return false;
    },
    onDivDrop(event) {
      preventEvent(event);
      if (event.type != "drop") {
        return false;
      }
      this.handleFiles(event.dataTransfer.files);
      return false;
    },
    onInputChange(event) {
      preventEvent(event);
      this.handleFiles(event.target.files);
    },
    onUploadProgress(idx, event) {
      const percentProgress = Math.round((event.loaded * 100) / event.total);
      this.updateFile(idx, {
        status: FILE_STATUS_UPLOADING,
        progress: percentProgress
      });
    },
    onUploaded(idx, response) {
      this.updateFile(idx, {
        status: FILE_STATUS_UPLOADED,
        id: response.data.id
      });
      this.emitChangeEvent();
    },
    onUploadError(idx, error) {
      if (error.response) {
        if (error.response.status === 400) {
          this.updateFileStatus(idx, FILE_STATUS_DISALLOWED_MIME);
          return;
        } else if (error.response.status == 413) {
          this.updateFileStatus(idx, FILE_STATUS_TOO_LARGE);
          return;
        }
      }
      this.updateFileStatus(idx, FILE_STATUS_UPLOAD_ERROR);
    }
  },
  created() {
    this.processValue();
  }
};
</script>
