<script setup lang="ts">
/**
 * ChangePassword page — shown after first-time login.
 * The user must set a new password before accessing the dashboard.
 * Uses the temporary token already stored by the login flow.
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { useFormErrors } from '@/composables/useFormErrors'
import { LockClosedIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const { changePassword, state } = useAuth()
const toast = useToast()
const { firstError, setErrors, setFieldError, clearAll } = useFormErrors()

const password = ref('')
const passwordConfirmation = ref('')

/** Client-side validation */
function validate(): boolean {
  clearAll()
  let valid = true
  if (!password.value || password.value.length < 8) {
    setFieldError('password', 'Password must be at least 8 characters.')
    valid = false
  }
  if (password.value !== passwordConfirmation.value) {
    setFieldError('password_confirmation', 'Passwords do not match.')
    valid = false
  }
  return valid
}

/** Submit the new password */
async function handleSubmit() {
  if (!validate()) return

  const result = await changePassword(password.value, passwordConfirmation.value)

  if (result.success) {
    toast.success(result.message ?? 'Password changed. Welcome!')
    router.push('/dashboard')
  } else {
    toast.error(result.message ?? 'Failed to change password.')
    if (result.validation) setErrors(result.validation)
  }
}
</script>

<template>
  <AuthLayout>
    <BaseCard>
      <!-- Heading -->
      <h1 class="text-2xl font-bold text-textPrimary text-center mb-1">Change Password</h1>
      <p class="text-sm text-textSecondary text-center mb-8">
        You must set a new password before continuing
      </p>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="password"
          type="password"
          placeholder="New password"
          :error="firstError('password')"
        >
          <template #icon>
            <LockClosedIcon class="w-5 h-5 text-textSecondary shrink-0" />
          </template>
        </BaseInput>

        <BaseInput
          v-model="passwordConfirmation"
          type="password"
          placeholder="Confirm password"
          :error="firstError('password_confirmation')"
        >
          <template #icon>
            <ShieldCheckIcon class="w-5 h-5 text-textSecondary shrink-0" />
          </template>
        </BaseInput>

        <BaseButton type="submit" variant="primary" fullWidth :loading="state.loading">
          Change Password
        </BaseButton>
      </form>
    </BaseCard>
  </AuthLayout>
</template>
