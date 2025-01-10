// 處理網優載具資料
export function generateUXB2BCode(phone_number) {
  // 將電話號碼轉換為十六進制
  const hexPhone = phone_number
    .split('') // 將字串分割為陣列
    .map(char => char.charCodeAt(0).toString(16)) // 每個字元轉換為十六進制
    .join('') // 合併為字串

  // 將固定前綴與十六進制電話號碼結合
  const result = `997592${hexPhone}`
  return result
}
