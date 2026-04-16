<script setup lang="ts">
/**
 * AdminUserRequestsPage — admin view of user registration requests.
 * Fetches the list via userRegistrationService and allows the admin
 * to approve a request by creating the user (register mutation).
 */

import { ref, onMounted } from 'vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import type { TableColumn } from '@/components/ui/BaseTable.vue'
import {
  getUserRegistrationRequests,
  type RegistrationRequest,
} from '@/services/userRegistrationService'
import { register } from '@/services/authService'
import { extractErrorMessage } from '@/utils/graphqlClient'
import { useToast } from '@/composables/useToast'
import { UserPlusIcon } from '@heroicons/vue/24/outline'

const toast = useToast()

/* ------------------------------------------------------------------ */
/*  Table data                                                         */
/* ------------------------------------------------------------------ */

const requests = ref<RegistrationRequest[]>([])
const loading = ref(false)
const statusFilter = ref<string>('')

/** Define the table columns with optional formatters */
const columns: TableColumn<RegistrationRequest>[] = [
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  {
    key: 'status',
    label: 'Status',
    format: (val) => {
      const s = val as string
      return s.charAt(0).toUpperCase() + s.slice(1)
    },
  },
  {
    key: 'created_at',
    label: 'Requested',
    format: (val) => new Date(val as string).toLocaleDateString(),
  },
]

/** Fetch requests from the backend (optionally filtered by status) */
async function fetchRequests() {
  loading.value = true
  try {
    const res = await getUserRegistrationRequests(statusFilter.value || undefined)
    if (res.data) {
      requests.value = res.data.userRegistrationRequests
    }
    if (res.errors) {
      toast.error(extractErrorMessage(res))
    }
  } catch (err) {
    toast.error((err as Error).message)
  } finally {
    loading.value = false
  }
}

onMounted(fetchRequests)

/* ------------------------------------------------------------------ */
/*  Approve / register flow                                            */
/* ------------------------------------------------------------------ */

const modalOpen = ref(false)
const selectedRequest = ref<RegistrationRequest | null>(null)
const registerName = ref('')
const registerTwoFactor = ref(false)
const registering = ref(false)

/** Open the approval modal for a specific request row */
function handleRowClick(row: RegistrationRequest) {
  if (row.status !== 'pending') return
  selectedRequest.value = row
  registerName.value = row.username
  modalOpen.value = true
}

/** Register the user from the selected request */
async function handleRegister() {
  if (!selectedRequest.value) return

  registering.value = true
  try {
    const res = await register(
      registerName.value,
      selectedRequest.value.email,
      registerTwoFactor.value,
    )

    if (res.errors) {
      toast.error(extractErrorMessage(res))
      return
    }

    toast.success(res.data!.register.message)
    modalOpen.value = false
    // Refresh the list to reflect updated status
    await fetchRequests()
  } catch (err) {
    toast.error((err as Error).message)
  } finally {
    registering.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-textPrimary">Registration Requests</h2>

      <!-- Status filter -->
      <select
        v-model="statusFilter"
        @change="fetchRequests"
        class="bg-input border border-border text-textPrimary text-sm rounded-lg px-3 py-2 outline-none focus:border-primary"
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="created">Created</option>
      </select>
    </div>

    <!-- Requests table -->
    <BaseTable
      :columns="columns"
      :rows="requests"
      :loading="loading"
      empty-message="No registration requests found."
      @row-click="handleRowClick"
    />

    <!-- Approve / register modal -->
    <BaseModal v-model:open="modalOpen" title="Create User Account">
      <template v-if="selectedRequest">
        <p class="text-sm text-textSecondary mb-4">
          Create an account for <strong class="text-textPrimary">{{ selectedRequest.email }}</strong
          >. A temporary password will be emailed to the user.
        </p>

        <div class="space-y-4">
          <BaseInput v-model="registerName" type="text" placeholder="Full name">
            <template #icon>
              <UserPlusIcon class="w-5 h-5 text-textSecondary shrink-0" />
            </template>
          </BaseInput>

          <label class="flex items-center gap-2 text-sm text-textSecondary cursor-pointer">
            <input v-model="registerTwoFactor" type="checkbox" class="accent-primary" />
            Enable two-factor authentication
          </label>

          <div class="flex gap-3 pt-2">
            <BaseButton variant="primary" :loading="registering" @click="handleRegister">
              Create User
            </BaseButton>
            <BaseButton variant="outline" @click="modalOpen = false"> Cancel </BaseButton>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
