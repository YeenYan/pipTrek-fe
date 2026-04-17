<script setup lang="ts">
/**
 * UserRegistrationRequestPage — public form for requesting an account.
 * Submits via the userRegistrationService (requestUserRegistration mutation).
 * Shows inline validation errors and toast notifications.
 */

import { ref } from 'vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { requestUserRegistration } from '@/services/userRegistrationService'
import { extractErrorMessage, extractValidationErrors } from '@/utils/graphqlClient'
import { useToast } from '@/composables/useToast'
import { useFormErrors } from '@/composables/useFormErrors'
import { UserIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'

const toast = useToast()
const { firstError, setErrors, setFieldError, clearAll } = useFormErrors()

const username = ref('')
const email = ref('')
const loading = ref(false)

/** Client-side validation before sending to server */
function validate(): boolean {
  clearAll()
  let valid = true
  if (!username.value.trim() || username.value.trim().length < 3) {
    setFieldError('username', 'Username must be at least 3 characters.')
    valid = false
  }
  if (!email.value.trim()) {
    setFieldError('email', 'Email is required.')
    valid = false
  }
  return valid
}

/** Submit the registration request */
async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  try {
    const res = await requestUserRegistration(username.value.trim(), email.value.trim())

    if (res.errors) {
      const validation = extractValidationErrors(res)
      if (Object.keys(validation).length) {
        setErrors(validation)
      }
      toast.error(extractErrorMessage(res))
      return
    }

    toast.success(res.data!.requestUserRegistration.message)
    // Clear form on success
    username.value = ''
    email.value = ''
    clearAll()
  } catch (err) {
    toast.error((err as Error).message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <BaseCard>
      <!-- Heading -->
      <h1 class="text-2xl font-bold text-textPrimary text-center mb-1">Request Access</h1>
      <p class="text-sm text-textSecondary text-center mb-8">
        Submit your details and an administrator will review your request
      </p>

      <!-- Registration request form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="username"
          type="text"
          placeholder="Username (min 3 characters)"
          :error="firstError('username')"
        >
          <template #icon>
            <UserIcon class="w-5 h-5 text-textSecondary shrink-0" />
          </template>
        </BaseInput>

        <BaseInput
          v-model="email"
          type="email"
          placeholder="Email address"
          :error="firstError('email')"
        >
          <template #icon>
            <EnvelopeIcon class="w-5 h-5 text-textSecondary shrink-0" />
          </template>
        </BaseInput>

        <BaseButton type="submit" variant="primary" fullWidth :loading="loading">
          Submit Request
        </BaseButton>
      </form>

      <!-- Back to login -->
      <div class="text-center mt-6">
        <router-link
          to="/login"
          class="text-sm text-textSecondary hover:text-textPrimary transition-colors"
        >
          &larr; Already have an account? Login
        </router-link>
      </div>
    </BaseCard>
  </AuthLayout>
</template>
