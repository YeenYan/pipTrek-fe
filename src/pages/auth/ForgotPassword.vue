<script setup lang="ts">
/**
 * ForgotPassword page — sends a password reset email.
 * Uses the authService via useAuth composable.
 * Shows a success/error toast; the response is always the same
 * to prevent email enumeration.
 */

import { ref } from 'vue'
import AuthLayout from '@/modules/auth/AuthLayout.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { useFormErrors } from '@/composables/useFormErrors'

const { forgotPassword, state } = useAuth()
const toast = useToast()
const { firstError, setFieldError, clearAll } = useFormErrors()

const email = ref('')

/** Client-side validation */
function validate(): boolean {
  clearAll()
  if (!email.value.trim()) {
    setFieldError('email', 'Email is required.')
    return false
  }
  return true
}

/** Submit forgot password request */
async function handleSubmit() {
  if (!validate()) return

  const result = await forgotPassword(email.value.trim())

  if (result.success) {
    toast.success(result.message ?? 'Reset link sent.')
  } else {
    toast.error(result.message ?? 'Something went wrong.')
  }
}
</script>

<template>
  <AuthLayout>
    <BaseCard>
      <!-- Heading -->
      <h1 class="text-2xl font-bold text-textPrimary text-center mb-1">Forgot Password</h1>
      <p class="text-sm text-textSecondary text-center mb-8">
        Enter your email and we'll send you a reset link
      </p>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="email"
          type="email"
          placeholder="email address"
          :error="firstError('email')"
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
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </template>
        </BaseInput>

        <BaseButton type="submit" variant="primary" fullWidth :loading="state.loading">
          Send Reset Link
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
