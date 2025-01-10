<script setup>
const validateUnifiedNumber = unifiedNumber => {
  if (!/^\d{8}$/.test(unifiedNumber)) {
    return false
  }

  const weights = [1, 2, 1, 2, 1, 2, 4, 1]
  let sum = 0

  for (let i = 0; i < 8; i++) {
    let product = parseInt(unifiedNumber[i]) * weights[i]
    sum += Math.floor(product / 10) + (product % 10)
  }

  if (sum % 10 === 0) {
    return true
  }

  if (unifiedNumber[6] === '7' && (sum + 1) % 10 === 0) {
    return true
  }

  return false
}
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

    // 載具驗證
    if (
      rule.CarrierID1 &&
      stringValue &&
      !/^\/[0-9A-Z.+-]{7}$/.test(stringValue)
    ) {
      isValid = false
      errors[field] = `${field} 不是有效的共通性手機載具`
    }

    // 統一編號驗證
    if (rule.vat_number && stringValue && !validateUnifiedNumber(stringValue)) {
      isValid = false
      errors[field] = `${field} 不是有效的統一編號`
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
