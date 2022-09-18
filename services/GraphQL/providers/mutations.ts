import { gql } from '@apollo/client'

export const CREATE_PROVIDER = gql`
  mutation (
    $commercialName: String
    $address: String
    $salesPhone: String
    $b2bPhone: String
    $salesEmail: String
    $b2bEmail: String
    $legalName: String
    $details: String
    $logoUrl: String
    $userId: uuid
  ) {
    provider: insert_providers_one(
      object: {
        commercial_name: $commercialName
        address: $address
        sales_phone: $salesPhone
        b2b_phone: $b2bPhone
        sales_email: $salesEmail
        b2b_email: $b2bEmail
        legal_name: $legalName
        details: $details
        logo_url: $logoUrl
        user_id: $userId
        is_active: true
      }
    ) {
      isActive: is_active
      id
    }
  }
`

export const UPDATE_PROVIDER = gql`
  mutation (
    $id: uuid!
    $commercialName: String
    $salesEmail: String
    $salesPhone: String
    $address: String
    $logoUrl: String
    $catalogUrl: String
  ) {
    provider: update_providers_by_pk(
      pk_columns: { id: $id }
      _set: {
        commercial_name: $commercialName
        sales_email: $salesEmail
        sales_phone: $salesPhone
        address: $address
        logo_url: $logoUrl
        catalog_url: $catalogUrl
      }
    ) {
      is_active
    }
  }
`

export const TOGGLE_PROVIDER = gql`
  mutation ($id: uuid!, $isActive: Boolean) {
    provider: update_providers_by_pk(pk_columns: { id: $id }, _set: { is_active: $isActive }) {
      isActive: is_active
    }
  }
`
