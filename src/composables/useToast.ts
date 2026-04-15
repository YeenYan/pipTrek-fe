/**
 * useToast Composable
 *
 * Global toast notification system.
 * Components call show() to display a message; the ToastNotification
 * component renders them. Uses a module-level reactive array so state
 * is shared across all consumers.
 */

import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

/** Auto-incrementing id for each toast */
let nextId = 0

/** Shared reactive list of visible toasts */
const toasts = reactive<Toast[]>([])

export function useToast() {
  /**
   * Display a toast notification.
   * Automatically dismisses after the given duration (default 4 s).
   */
  function show(message: string, type: ToastType = 'info', duration = 4000) {
    const id = nextId++
    toasts.push({ id, type, message })
    setTimeout(() => dismiss(id), duration)
  }

  /** Remove a toast by id */
  function dismiss(id: number) {
    const idx = toasts.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.splice(idx, 1)
  }

  /** Shorthand helpers */
  const success = (msg: string) => show(msg, 'success')
  const error = (msg: string) => show(msg, 'error')
  const warning = (msg: string) => show(msg, 'warning')
  const info = (msg: string) => show(msg, 'info')

  return { toasts, show, dismiss, success, error, warning, info }
}
