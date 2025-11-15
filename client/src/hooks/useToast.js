import { useCallback } from 'react'

export function useToast() {
  const toast = useCallback(({ title, description, duration = 3000 }) => {
    const id = `toast-${Date.now()}`

    const toastContainer = document.getElementById('toast-container')
    if (!toastContainer) {
      const newContainer = document.createElement('div')
      newContainer.id = 'toast-container'
      newContainer.className =
        'fixed top-4 right-4 z-[9999] flex flex-col gap-2'
      document.body.appendChild(newContainer)
    }

    const toastElement = document.createElement('div')
    toastElement.id = id
    toastElement.className =
      'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm shadow-lg rounded-lg px-4 py-3 max-w-sm w-full animate-fadeIn'
    toastElement.innerHTML = `
      <strong class="block font-semibold mb-1">${title}</strong>
      <span class="text-gray-700 dark:text-gray-300">${description}</span>
    `

    document.getElementById('toast-container').appendChild(toastElement)

    setTimeout(() => {
      toastElement.classList.add('opacity-0', 'transition-opacity')
      setTimeout(() => toastElement.remove(), 500)
    }, duration)
  }, [])

  return { toast }
}
