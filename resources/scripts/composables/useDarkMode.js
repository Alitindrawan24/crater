import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  function initDarkMode() {
    const saved = localStorage.getItem('crater-dark-mode')
    if (saved !== null) {
      isDark.value = saved === 'true'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyDarkMode()
  }

  function applyDarkMode() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleDarkMode() {
    isDark.value = !isDark.value
    localStorage.setItem('crater-dark-mode', isDark.value.toString())
    applyDarkMode()
  }

  onMounted(() => {
    initDarkMode()
  })

  watch(isDark, () => {
    applyDarkMode()
  })

  return {
    isDark,
    toggleDarkMode,
  }
}
