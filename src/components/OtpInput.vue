<script setup lang="ts">
import { ref } from 'vue'

// OTP input — one box per digit, auto-focus and backspace support
const props = defineProps<{
  length?: number
}>()

const emit = defineEmits<{
  complete: [code: string]
  'update:modelValue': [value: string]
}>()

const digitCount = props.length ?? 6
const digits = ref<string[]>(Array(digitCount).fill(''))
const inputs = ref<HTMLInputElement[]>([])

// Handle digit entry and auto-focus next
function handleInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '')
  digits.value[index] = value.charAt(0) || ''

  if (value && index < digitCount - 1) {
    inputs.value[index + 1]?.focus()
  }

  emitValue()
}

// Backspace moves to previous input
function handleKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputs.value[index - 1]?.focus()
  }
}

// Support pasting full OTP code
function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const paste = event.clipboardData?.getData('text').replace(/\D/g, '') || ''

  paste.split('').forEach((char, i) => {
    if (i < digitCount) digits.value[i] = char
  })

  const nextIndex = Math.min(paste.length, digitCount - 1)
  inputs.value[nextIndex]?.focus()
  emitValue()
}

// Emit combined value and complete event
function emitValue() {
  const code = digits.value.join('')
  emit('update:modelValue', code)
  if (code.length === digitCount) emit('complete', code)
}
</script>

<template>
  <div class="flex gap-3 justify-center" @paste="handlePaste">
    <input
      v-for="(_, index) in digitCount"
      :key="index"
      :ref="
        (el) => {
          if (el) inputs[index] = el as HTMLInputElement
        }
      "
      type="text"
      inputmode="numeric"
      maxlength="1"
      :value="digits[index]"
      @input="handleInput(index, $event)"
      @keydown="handleKeydown(index, $event)"
      class="w-12 h-14 text-center text-xl font-semibold bg-input border border-border rounded-lg text-textPrimary outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
    />
  </div>
</template>
