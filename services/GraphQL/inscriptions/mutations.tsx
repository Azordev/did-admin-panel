import { gql } from '@apollo/client'

export const CREATE_INSCRIPTION = gql`
  mutation ($memberId: String!, $eventId: String!) {
    insert_inscriptions_one(object: { member_id: $memberId, event_id: $eventId }) {
      id
    }
  }
`

export const DELETE_INSCRIPTION = gql`
  mutation ($id: String!) {
    delete_inscriptions_by_pk(id: $id) {
      id
    }
  }
`
