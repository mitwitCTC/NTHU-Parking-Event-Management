<script setup>
const validateForm = (formData, rules) => {
  let isValid = true
  let errors = {}

  // 遍歷所有規則，進行驗證
  Object.keys(rules).forEach(field => {
    const rule = rules[field]
    const value = formData[field]

    // 確保 value 是字串，並避免 null 或 undefined
    const stringValue = value ? String(value).trim() : ''

    // 若該欄位有必填規則
    if (rule.required && (stringValue === '' || stringValue === undefined)) {
      if (typeof value === 'number' && value === 0) {
        // 特殊處理數字類型，0 為有效值
      } else {
        isValid = false
        errors[field] = `${field} 是必填的`
      }
    }

    // 信箱格式檢查
    if (
      rule.email &&
      stringValue &&
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(stringValue)
    ) {
      isValid = false
      errors[field] = `${field} 格式不正確`
    }

    // 電話格式檢查
    if (
      rule.phone_number &&
      stringValue &&
      !/(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}/.test(stringValue)
    ) {
      isValid = false
      errors[field] = `${field} 格式不正確`
    }

    // 車牌需包含"-"
    if (
      rule.plate &&
      stringValue &&
      !(
        stringValue === '腳踏車' ||
        /^[A-Za-z0-9]+-[A-Za-z0-9]+$/.test(stringValue)
      )
    ) {
      isValid = false
      errors[field] = `${field} 必須包含且僅包含一個 "-"，不得有其他符號`
    }
  })

  return { isValid, errors }
}

defineExpose({
  validateForm,
})
</script>
<template>
  <div></div>
</template>
