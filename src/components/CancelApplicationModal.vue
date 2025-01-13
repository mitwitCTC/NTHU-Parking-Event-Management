<script setup>
defineProps({
    showCancelApplicationModal: Boolean, // 控制 modal 顯示
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
    <div v-if="showCancelApplicationModal" class="modal fade show d-block" id="cancelApplicationModal" tabindex="-1"
        aria-labelledby="cancelApplicationModalLabel">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-secondary">
                    <h5 class="modal-title text-black w-100 text-center" id="cancelApplicationModalLabel">
                        {{ $t('cancel_application_modal.title') }}
                    </h5>
                    <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                </div>
                <div class="img-container">
                    <img src="/images/modal/Paomedia-Small-N-Flat-Sign-warning.svg" alt="warning" />
                </div>
                <div class="modal-body">
                    {{ $t('cancel_application_modal.message') }}
                </div>
                <div class="modal-footer">
                    <p class="pointer text-primary fw-bold" @click="closeModal">
                        {{ $t('cancel_application_modal.cancel') }}
                    </p>
                    <p class="pointer text-primary fw-bold" data-bs-dismiss="modal" @click="apply">
                        {{ $t('cancel_application_modal.confirm') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pointer {
    cursor: pointer;
}

.img-container {
    z-index: 1;
    width: 50px;
    height: 50px;
    margin-top: -30px;
    margin-left: 10px;

    img {
        width: 100%;
        height: 100%;
        vertical-align: bottom;
        object-fit: contain;
    }
}
</style>
