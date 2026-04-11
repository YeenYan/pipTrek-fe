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
        <span class="text-textPrimary font-medium cursor-pointer hover:underline">Sign up</span>
      </p>

      <!-- Login form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <BaseInput v-model="email" type="email" placeholder="email address">
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

        <BaseInput v-model="password" type="password" placeholder="Password">
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

        <BaseButton type="submit" variant="primary" fullWidth>Login</BaseButton>
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

<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from './AuthLayout.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const email = ref('')
const password = ref('')

// Placeholder — API integration later
function handleLogin() {
  console.log('Login:', email.value)
}
</script>
