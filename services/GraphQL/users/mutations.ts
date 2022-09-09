import { gql } from '@apollo/client'

export const CREATE_ADMIN = gql`
  mutation ($memberCode: String!, $password: String, $avatarUrl: String) {
    user: insert_users_one(
      object: { member_code: $memberCode, password: $password, type: "ADMIN", is_active: true, avatar_url: $avatarUrl }
    ) {
      id
      updatedAt: updated_at
    }
  }
`

// This creates also the member
export const CREATE_USER_MEMBER = gql`
  mutation ($memberCode: String!, $password: String, $avatarUrl: String, $type: String, $position: String) {
    user: insert_users_one(
      object: {
        member_code: $memberCode
        password: $password
        type: $type
        is_active: true
        avatar_url: $avatarUrl
        position: $position
      }
    ) {
      id
      updatedAt: updated_at
    }
  }
`

export const CREATE_PROVIDER_USER = gql`
  mutation ($memberCode: String!, $password: String, $avatarUrl: String) {
    user: insert_users_one(
      object: {
        member_code: $memberCode
        password: $password
        type: "PROVIDER"
        is_active: true
        avatar_url: $avatarUrl
        position: "PROVIDER"
      }
    ) {
      id
      updatedAt: updated_at
    }
  }
`

export const UPDATE_USER = gql`
  mutation (
    $id: uuid!
    $memberCode: String
    $password: String
    $isActive: Boolean
    $avatarUrl: String
    $position: String
    $type: String
  ) {
    user: update_users_by_pk(
      pk_columns: { id: $id }
      _set: {
        member_code: $memberCode
        password: $password
        is_active: $isActive
        avatar_url: $avatarUrl
        position: $position
        type: $type
      }
    ) {
      id
      isActive: is_active
    }
  }
`

export const UPDATE_MEMBER = gql`
  mutation (
    $id: uuid!
    $firstNames: String
    $lastNames: String
    $email: String
    $contactInformation: String
    $degree: String
  ) {
    member: update_members(
      where: { user_id: { _eq: $id } }
      _set: {
        first_names: $firstNames
        last_names: $lastNames
        email: $email
        contact_information: $contactInformation
        degree: $degree
      }
    ) {
      affected_rows
    }
  }
`

export const DEACTIVATE_USER = gql`
  mutation ($id: uuid!) {
    user: update_users_by_pk(pk_columns: { id: $id }, _set: { is_active: false }) {
      is_active
    }
  }
`
