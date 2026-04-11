<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from './AuthLayout.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import OtpInput from '@/components/OtpInput.vue'

const otpCode = ref('')

// Placeholder — API integration later
function handleVerify() {
  console.log('Verify OTP:', otpCode.value)
}

// Placeholder resend
function handleResend() {
  console.log('Resend OTP')
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

        <BaseButton type="submit" variant="primary" fullWidth>Verify</BaseButton>
      </form>

      <!-- Resend link -->
      <div class="text-center mt-6">
        <p class="text-sm text-textSecondary">
          Didn't receive a code?
          <button @click="handleResend" class="text-primary hover:underline cursor-pointer">
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
          ← Back to Login
        </router-link>
      </div>
    </BaseCard>
  </AuthLayout>
</template>
