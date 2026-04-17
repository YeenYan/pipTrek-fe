<script setup lang="ts">
/**
 * BaseToggle — reusable toggle switch component.
 */
defineProps<{
  modelValue: boolean
  disabled?: boolean
  label?: string
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label
    class="inline-flex items-center gap-2 cursor-pointer"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
  >
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      class="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-bg disabled:cursor-not-allowed"
      :class="modelValue ? 'bg-primary' : 'bg-border'"
      @click="!disabled && $emit('update:modelValue', !modelValue)"
    >
      <span
        class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200"
        :class="modelValue ? 'translate-x-4' : 'translate-x-0'"
      />
    </button>
    <span v-if="label" class="text-xs text-textSecondary select-none">{{ label }}</span>
  </label>
</template>
