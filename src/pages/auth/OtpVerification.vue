<script setup lang="ts">
/**
 * OtpVerification page — verifies the 6-digit OTP code.
 * The user's email is passed via query param (?email=...).
 * On success, redirects to dashboard or change-password.
 */

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import OtpInput from '@/components/OtpInput.vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { verifyOtp, resendOtp, state } = useAuth()
const toast = useToast()

const otpCode = ref('')
const email = (route.query.email as string) || state.otpEmail

/** Verify the entered OTP code */
async function handleVerify() {
  if (otpCode.value.length < 6) return

  const result = await verifyOtp(email, otpCode.value)

  if (!result.success) {
    toast.error(result.message ?? 'OTP verification failed.')
    return
  }

  toast.success(result.message ?? 'OTP verified.')

  if (result.next === 'change-password') {
    router.push('/change-password')
  } else {
    router.push('/dashboard')
  }
}

/** Request a new OTP */
async function handleResend() {
  const result = await resendOtp(email)
  if (result.success) {
    toast.success(result.message ?? 'OTP resent.')
  } else {
    toast.error(result.message ?? 'Could not resend OTP.')
  }
}
</script>

<template>
  <AuthLayout>
    <BaseCard>
      <!-- Heading -->
      <h1 class="text-2xl font-bold text-textPrimary text-center mb-1">Verify Your Identity</h1>
      <p class="text-sm text-textSecondary text-center mb-8">
        Enter the 6-digit code sent to your email
      </p>

      <!-- OTP input -->
      <form @submit.prevent="handleVerify" class="space-y-6">
        <OtpInput v-model="otpCode" :length="6" @complete="handleVerify" />

        <BaseButton type="submit" variant="primary" fullWidth :loading="state.loading">
          Verify
        </BaseButton>
      </form>

      <!-- Resend link -->
      <div class="text-center mt-6">
        <p class="text-sm text-textSecondary">
          Didn't receive a code?
          <button
            @click="handleResend"
            class="text-primary hover:underline cursor-pointer"
            :disabled="state.loading"
          >
            Resend
          </button>
        </p>
      </div>

      <!-- Back to login -->
      <div class="text-center mt-4">
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
