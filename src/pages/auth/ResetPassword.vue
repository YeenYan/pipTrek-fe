<script setup lang="ts">
/**
 * ResetPassword page — sets a new password using the token from email.
 * The token is extracted from the URL query parameter (?token=...).
 */

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { useFormErrors } from '@/composables/useFormErrors'
import { LockClosedIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'

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
