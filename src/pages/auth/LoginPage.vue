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
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

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
        <div class="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg">
          <span class="text-2xl font-bold text-white">P</span>
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
            <EnvelopeIcon class="w-5 h-5 text-textSecondary shrink-0" />
          </template>
        </BaseInput>

        <BaseInput
          v-model="password"
          type="password"
          placeholder="Password"
          :error="firstError('password')"
        >
          <template #icon>
            <LockClosedIcon class="w-5 h-5 text-textSecondary shrink-0" />
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
