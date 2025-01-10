import { ref, onMounted } from 'vue'

export function useDonationOrganization() {
  const donationOrganizationList = ref([])

  async function getDonationOrganizationList() {
    donationOrganizationList.value = [
      {
        id: 1,
        name: '南迴基金會',
      },
      {
        id: 2,
        name: '家庭扶助基金會',
      },
      {
        id: 3,
        name: '勵馨基金會',
      },
      {
        id: 4,
        name: '綠色和平',
      },
      {
        id: 5,
        name: '兒福聯盟',
      },
    ]
  }

  // 畫面載入時自動執行
  onMounted(() => {
    getDonationOrganizationList()
  })

  return {
    donationOrganizationList,
    getDonationOrganizationList,
  }
}
