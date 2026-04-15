<script setup lang="ts">
/**
 * ResetPassword page — sets a new password using the token from email.
 * The token is extracted from the URL query parameter (?token=...).
 */

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '@/modules/auth/AuthLayout.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { useFormErrors } from '@/composables/useFormErrors'

const route = useRoute()
const router = useRouter()
const { resetPassword, state } = useAuth()
const toast = useToast()
const { firstError, setErrors, setFieldError, clearAll } = useFormErrors()

const password = ref('')
const passwordConfirmation = ref('')

/** The reset token from the email link */
const token = (route.query.token as string) ?? ''

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
async function handleReset() {
  if (!validate()) return

  const result = await resetPassword(token, password.value, passwordConfirmation.value)

  if (result.success) {
    toast.success(result.message ?? 'Password reset successfully.')
    router.push('/login')
  } else {
    toast.error(result.message ?? 'Failed to reset password.')
    if (result.validation) setErrors(result.validation)
  }
}
</script>

<template>
  <AuthLayout>
    <BaseCard>
      <!-- Heading -->
      <h1 class="text-2xl font-bold text-textPrimary text-center mb-1">Reset Password</h1>
      <p class="text-sm text-textSecondary text-center mb-8">
        Enter your new password (min 8 characters)
      </p>

      <!-- Form -->
      <form @submit.prevent="handleReset" class="space-y-4">
        <BaseInput
          v-model="password"
          type="password"
          placeholder="New password"
          :error="firstError('password')"
        >
          <template #icon>
            <svg
              class="w-5 h-5 text-textSecondary shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </template>
        </BaseInput>

        <BaseInput
          v-model="passwordConfirmation"
          type="password"
          placeholder="Confirm password"
          :error="firstError('password_confirmation')"
        >
          <template #icon>
            <svg
              class="w-5 h-5 text-textSecondary shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </template>
        </BaseInput>

        <BaseButton type="submit" variant="primary" fullWidth :loading="state.loading">
          Reset Password
        </BaseButton>
      </form>

      <!-- Back to login -->
      <div class="text-center mt-6">
        <router-link
          to="/login"
          class="text-sm text-textSecondary hover:text-textPrimary transition-colors"
        >
          &larr; Back to Login
        </router-link>
      </div>
    </BaseCard>
  </AuthLayout>
</template>
