<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from './AuthLayout.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const password = ref('')
const passwordConfirmation = ref('')

// Placeholder — API integration later
function handleReset() {
  console.log('Reset password')
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
        <BaseInput v-model="password" type="password" placeholder="New password">
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

        <BaseInput v-model="passwordConfirmation" type="password" placeholder="Confirm password">
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

        <BaseButton type="submit" variant="primary" fullWidth>Reset Password</BaseButton>
      </form>

      <!-- Back to login -->
      <div class="text-center mt-6">
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
