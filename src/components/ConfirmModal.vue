<script setup>
defineProps({
  showConfirmModal: Boolean, // 控制 modal 顯示
})

const emit = defineEmits(['close', 'apply'])

function closeModal() {
  emit('close') // 觸發關閉事件
}
function apply() {
  emit('apply')
}
</script>
<template>
  <div
    v-if="showConfirmModal"
    class="modal fade show d-block"
    id="confirmModal"
    tabindex="-1"
    aria-labelledby="confirmModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary">
          <h5 class="modal-title text-black" id="confirmModalLabel">
            {{
              $t(
                'pages.applyFacultyStudentParking.uploadDocuments.confirm_title',
              )
            }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          {{
            $t(
              'pages.applyFacultyStudentParking.uploadDocuments.confirm_message',
            )
          }}
        </div>
        <div class="modal-footer">
          <p class="pointer text-primary fw-bold" @click="closeModal">
            {{ $t('pages.applyFacultyStudentParking.uploadDocuments.cancel') }}
          </p>
          <p
            class="pointer text-primary fw-bold"
            data-bs-dismiss="modal"
            @click="apply"
          >
            {{ $t('pages.applyFacultyStudentParking.uploadDocuments.confirm') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.pointer {
  cursor: pointer;
}
</style>
