<script setup>
defineProps({
  showModal: Boolean, // 控制 modal 顯示
  errors: Object, // 來自父組件的錯誤訊息
})

const emit = defineEmits(['close'])

function closeModal() {
  emit('close') // 觸發關閉事件
}
</script>

<template>
  <div
    v-if="showModal"
    class="modal fade show d-block"
    tabindex="-1"
    aria-labelledby="validationModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary">
          <h5 class="modal-title text-black" id="validatorModalLabel">
            {{ $t('validation.title') }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>{{ $t('validation.content') }}</p>
        </div>
        <div class="modal-footer">
          <p class="pointer text-primary" @click="closeModal">
            {{ $t('validation.confirm') }}
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
