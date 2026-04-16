<script setup lang="ts">
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
import { CheckCircleIcon, XCircleIcon, ClockIcon, UserPlusIcon } from '@heroicons/vue/24/outline'

const toast = useToast()

/* ------------------------------------------------------------------ */
/*  Registration requests table                                        */
/* ------------------------------------------------------------------ */

const requests = ref<RegistrationRequest[]>([])
const loading = ref(false)
const statusFilter = ref<string>('')
const error = ref<string | null>(null)

const requestColumns: TableColumn<RegistrationRequest>[] = [
  { key: 'username', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
  {
    key: 'created_at',
    label: 'Created At',
    format: (val) => new Date(val as string).toLocaleDateString(),
  },
]

async function fetchRequests() {
  loading.value = true
  error.value = null
  try {
    const res = await getUserRegistrationRequests(statusFilter.value || undefined)
    if (res.data) {
      requests.value = res.data.userRegistrationRequests
    }
    if (res.errors) {
      error.value = extractErrorMessage(res)
      toast.error(error.value)
    }
  } catch (err) {
    error.value = (err as Error).message
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(fetchRequests)

/* ------------------------------------------------------------------ */
/*  Approve (register) flow                                            */
/* ------------------------------------------------------------------ */

const modalOpen = ref(false)
const selectedRequest = ref<RegistrationRequest | null>(null)
const registerName = ref('')
const registerTwoFactor = ref(false)
const registering = ref(false)

function openApproveModal(row: RegistrationRequest) {
  if (row.status !== 'pending') return
  selectedRequest.value = row
  registerName.value = row.username
  registerTwoFactor.value = false
  modalOpen.value = true
}

async function handleApprove() {
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

    // Optimistic: update the row status locally
    const idx = requests.value.findIndex((r) => r.id === selectedRequest.value!.id)
    if (idx !== -1) {
      requests.value[idx] = { ...requests.value[idx], status: 'created' }
    }
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
      <div>
        <h2 class="text-xl font-bold text-textPrimary">Manage Users</h2>
        <p class="text-sm text-textSecondary mt-1">
          Review pending registration requests and manage user accounts.
        </p>
      </div>
    </div>

    <!-- Registration Requests -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-textPrimary uppercase tracking-wider">
          Registration Requests
        </h3>
        <select
          v-model="statusFilter"
          @change="fetchRequests"
          class="bg-input border border-border text-textPrimary text-xs rounded-lg px-3 py-1.5 outline-none focus:border-primary"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="created">Created</option>
        </select>
      </div>

      <!-- Error state -->
      <div
        v-if="error && !loading"
        class="rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger text-center"
      >
        {{ error }}
      </div>

      <BaseTable
        v-else
        :columns="requestColumns"
        :rows="requests"
        :loading="loading"
        empty-message="No registration requests found."
        @row-click="openApproveModal"
      >
        <template #cell-status="{ value }">
          <span
            class="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
            :class="{
              'bg-warning/10 text-warning': value === 'pending',
              'bg-success/10 text-success': value === 'created',
              'bg-danger/10 text-danger': value === 'rejected',
            }"
          >
            <ClockIcon v-if="value === 'pending'" class="w-3.5 h-3.5" />
            <CheckCircleIcon v-else-if="value === 'created'" class="w-3.5 h-3.5" />
            <XCircleIcon v-else class="w-3.5 h-3.5" />
            {{ (value as string)?.charAt(0).toUpperCase() + (value as string)?.slice(1) }}
          </span>
        </template>

        <template #cell-username="{ row }">
          <div class="flex items-center gap-2">
            <div
              class="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0"
            >
              {{ (row as RegistrationRequest).username?.charAt(0)?.toUpperCase() }}
            </div>
            <span>{{ (row as RegistrationRequest).username }}</span>
          </div>
        </template>
      </BaseTable>
    </div>

    <!-- Approve modal -->
    <BaseModal v-model:open="modalOpen" title="Create User Account">
      <template v-if="selectedRequest">
        <p class="text-sm text-textSecondary mb-4">
          Create an account for
          <strong class="text-textPrimary">{{ selectedRequest.email }}</strong
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
            <BaseButton variant="primary" :loading="registering" @click="handleApprove">
              Approve & Create
            </BaseButton>
            <BaseButton variant="outline" @click="modalOpen = false"> Cancel </BaseButton>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
