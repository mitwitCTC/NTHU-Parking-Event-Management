<script setup>
defineProps({
  showCaptchaModal: Boolean, // 控制 modal 顯示
  errors: Object, // 來自父組件的錯誤訊息
})

const emit = defineEmits(['close'])

function closeModal() {
  emit('close') // 觸發關閉事件
}
</script>

<template>
  <div
    v-if="showCaptchaModal"
    class="modal fade show d-block"
    tabindex="-1"
    aria-labelledby="captchaModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary">
          <h5 class="modal-title text-black" id="captchaModalLabel">
            {{ $t('captchaModal.title') }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>{{ $t('captchaModal.content') }}</p>
        </div>
        <div class="modal-footer">
          <p class="pointer text-primary" @click="closeModal">
            {{ $t('captchaModal.confirm') }}
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
