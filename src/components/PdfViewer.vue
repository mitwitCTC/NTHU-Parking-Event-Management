<template>
  <div>
    <div v-for="(page, index) in pages" :key="index" class="pdf-page">
      <canvas :ref="setCanvasRef(index)"></canvas>
    </div>
  </div>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist'
import { nextTick } from 'vue' // Vue 3 的 nextTick

// 設定 worker 的路徑
pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdfjs/pdf.worker.min.js`

export default {
  props: {
    pdfUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pages: [], // 儲存頁面數量
      canvasRefs: {}, // 儲存 canvas 的參考（以鍵值對方式儲存）
    }
  },
  mounted() {
    this.loadPdf()
  },
  methods: {
    async loadPdf() {
      try {
        const loadingTask = pdfjsLib.getDocument(this.pdfUrl)
        const pdf = await loadingTask.promise
        const totalPages = pdf.numPages

        // 遍歷頁面
        for (let i = 1; i <= totalPages; i++) {
          this.pages.push(i) // 更新頁面數量
          await nextTick() // 等待 DOM 更新完成
          const canvas = this.canvasRefs[i - 1]
          if (canvas) {
            const page = await pdf.getPage(i)
            await this.renderPage(page, canvas)
          }
        }
      } catch (error) {
        console.error('Error loading PDF:', error)
      }
    },
    async renderPage(page, canvas) {
      const context = canvas.getContext('2d')
      const viewport = page.getViewport({ scale: 1.3 }) // 調整 PDF 縮放比例
      canvas.width = viewport.width
      canvas.height = viewport.height

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      }

      await page.render(renderContext).promise
    },
    setCanvasRef(index) {
      return el => {
        if (el) this.canvasRefs[index] = el
      }
    },
  },
}
</script>

<style scoped>
.pdf-page {
  margin: 16px auto;
  display: block;
  text-align: center;
}
canvas {
  max-width: 100%;
  border: 1px solid #ccc;
  display: block;
  margin: 0 auto;
}
</style>
