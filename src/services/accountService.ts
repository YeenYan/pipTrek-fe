/**
 * Account Service
 *
 * Encapsulates every trading-account-related GraphQL operation.
 * Components never call the GraphQL client directly — they go through this service.
 */

import { mutation, query, type GraphQLResponse } from '@/utils/graphqlClient'

/* ------------------------------------------------------------------ */
/*  TypeScript interfaces matching the backend response shapes        */
/* ------------------------------------------------------------------ */

export interface Account {
  id: string
  name: string
  broker: string
  platform: string
  account_mode: string
  account_type: string
  leverage: number
  starting_balance: number
  target_amount: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface AccountInput {
  name: string
  broker: string
  platform: string
  account_mode: string
  account_type: string
  leverage: number
  starting_balance: number
  target_amount: number
  is_active?: boolean
}

export interface MyAccountsResponse {
  myAccounts: Account[]
}

export interface AccountResponse {
  account: Account
}

export interface CreateAccountResponse {
  createAccount: Account
}

export interface UpdateAccountResponse {
  updateAccount: Account
}

export interface DeleteAccountResponse {
  deleteAccount: {
    message: string
  }
}

export interface ToggleAccountActiveResponse {
  toggleAccountActive: Account
}

/* ------------------------------------------------------------------ */
/*  Account fields fragment (keeps queries DRY)                       */
/* ------------------------------------------------------------------ */

const ACCOUNT_FIELDS = `
  id
  name
  broker
  platform
  account_mode
  account_type
  leverage
  starting_balance
  target_amount
  is_active
  created_at
  updated_at
`

/* ------------------------------------------------------------------ */
/*  Service functions                                                  */
/* ------------------------------------------------------------------ */

/**
 * Fetch all trading accounts for the authenticated user.
 */
export function myAccounts(): Promise<GraphQLResponse<MyAccountsResponse>> {
  return query<MyAccountsResponse>(
    `query MyAccounts {
      myAccounts {
        ${ACCOUNT_FIELDS}
      }
    }`,
  )
}

/**
 * Fetch a single trading account by ID.
 */
export function account(id: string): Promise<GraphQLResponse<AccountResponse>> {
  return query<AccountResponse>(
    `query Account($id: ID!) {
      account(id: $id) {
        ${ACCOUNT_FIELDS}
      }
    }`,
    { id },
  )
}

/**
 * Create a new trading account.
 */
export function createAccount(
  input: AccountInput,
): Promise<GraphQLResponse<CreateAccountResponse>> {
  return mutation<CreateAccountResponse>(
    `mutation CreateAccount($input: CreateAccountInput!) {
      createAccount(input: $input) {
       account {
        ${ACCOUNT_FIELDS}
       }
      }
    }`,
    { input },
  )
}

/**
 * Update an existing trading account.
 */
export function updateAccount(
  id: string,
  input: AccountInput,
): Promise<GraphQLResponse<UpdateAccountResponse>> {
  return mutation<UpdateAccountResponse>(
    `mutation UpdateAccount($id: ID!, $input: UpdateAccountInput!) {
      updateAccount(id: $id, input: $input) {
       account {
        ${ACCOUNT_FIELDS}
       }
      }
    }`,
    { id, input },
  )
}

/**
 * Delete a trading account by ID.
 */
export function deleteAccount(id: string): Promise<GraphQLResponse<DeleteAccountResponse>> {
  return mutation<DeleteAccountResponse>(
    `mutation DeleteAccount($id: ID!) {
      deleteAccount(id: $id) {
        message
      }
    }`,
    { id },
  )
}

/**
 * Toggle the is_active status of a trading account.
 */
export function toggleAccountActive(
  id: string,
): Promise<GraphQLResponse<ToggleAccountActiveResponse>> {
  return mutation<ToggleAccountActiveResponse>(
    `mutation ToggleAccountActive($id: ID!) {
      toggleAccountActive(id: $id) {
        ${ACCOUNT_FIELDS}
      }
    }`,
    { id },
  )
}
