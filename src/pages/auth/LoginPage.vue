<script setup lang="ts">
/**
 * LoginPage — authenticates the user.
 * Handles normal login, first-login redirect, and OTP redirect.
 * All API calls go through the useAuth composable (never direct).
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/modules/auth/AuthLayout.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { useFormErrors } from '@/composables/useFormErrors'

const router = useRouter()
const { login, state } = useAuth()
const toast = useToast()
const { firstError, setErrors, setFieldError, clearAll } = useFormErrors()

const email = ref('')
const password = ref('')

/** Validate inputs before sending to server */
function validate(): boolean {
  clearAll()
  let valid = true
  if (!email.value.trim()) {
    setFieldError('email', 'Email is required.')
    valid = false
  }
  if (!password.value) {
    setFieldError('password', 'Password is required.')
    valid = false
  }
  return valid
}

/** Submit login and handle all response branches */
async function handleLogin() {
  if (!validate()) return

  const result = await login(email.value.trim(), password.value)

  if (!result.success) {
    toast.error(result.message ?? 'Login failed.')
    if (result.validation) setErrors(result.validation)
    return
  }

  toast.success(result.message ?? 'Login successful.')

  // Redirect based on auth flow
  if (result.next === 'otp') {
    router.push({ path: '/otp', query: { email: email.value.trim() } })
  } else if (result.next === 'change-password') {
    router.push('/change-password')
  } else {
    router.push('/dashboard')
  }
}
</script>

<template>
  <AuthLayout>
    <BaseCard>
      <!-- Logo -->
      <div class="flex justify-center mb-5">
        <div
          class="w-14 h-14 rounded-xl bg-surface border border-border flex items-center justify-center shadow-lg"
        >
          <svg
            class="w-8 h-8 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke-dasharray="44"
              stroke-dashoffset="8"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>

      <!-- Heading -->
      <h1 class="text-2xl font-bold text-textPrimary text-center mb-1">Welcome Back</h1>
      <p class="text-sm text-textSecondary text-center mb-8">
        Don't have an account yet?
        <router-link
          to="/request-registration"
          class="text-textPrimary font-medium hover:underline"
        >
          Request access
        </router-link>
      </p>

      <!-- Login form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
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

        <BaseInput
          v-model="password"
          type="password"
          placeholder="Password"
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

        <BaseButton type="submit" variant="primary" fullWidth :loading="state.loading">
          Login
        </BaseButton>
      </form>

      <!-- Forgot password link -->
      <div class="text-right mt-3">
        <router-link
          to="/forgot-password"
          class="text-sm text-textSecondary hover:text-textPrimary transition-colors"
        >
          Forgot password?
        </router-link>
      </div>
    </BaseCard>
  </AuthLayout>
</template>
