/**
 * useFormErrors Composable
 *
 * Manages per-field validation error messages for forms.
 * Works with the validation object returned by the GraphQL backend
 * (extensions.validation) and supports manual client-side rules.
 */

import { reactive, computed } from 'vue'

export function useFormErrors() {
  /** Map of field name → array of error messages */
  const errors = reactive<Record<string, string[]>>({})

  /**
   * Set errors from the backend validation map.
   * Replaces any previous errors.
   */
  function setErrors(validationMap: Record<string, string[]>) {
    clearAll()
    for (const [field, messages] of Object.entries(validationMap)) {
      errors[field] = messages
    }
  }

  /**
   * Set a single field error manually (client-side validation).
   */
  function setFieldError(field: string, message: string) {
    errors[field] = [message]
  }

  /**
   * Clear errors for a specific field.
   */
  function clearField(field: string) {
    delete errors[field]
  }

  /**
   * Clear all field errors.
   */
  function clearAll() {
    for (const key of Object.keys(errors)) {
      delete errors[key]
    }
  }

  /**
   * Get the first error message for a given field, or empty string.
   */
  function firstError(field: string): string {
    return errors[field]?.[0] ?? ''
  }

  /**
   * Whether any validation errors currently exist.
   */
  const hasErrors = computed(() => Object.keys(errors).length > 0)

  return { errors, setErrors, setFieldError, clearField, clearAll, firstError, hasErrors }
}
