import { ApolloError } from '@apollo/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import client from '@/services/GraphQL/client'
import { DELETE_MEMBER_INSCRIPTION } from '@/services/GraphQL/inscriptions/mutations'
import {
  CREATE_MEMBER,
  CREATE_USER_MEMBER,
  DELETE_MEMBER,
  DELETE_SUBSCRIPTION,
  DELETE_USER,
  TOGGLE_USER,
  UPDATE_MEMBER,
} from '@/services/GraphQL/users/mutations'
import { MEMBER_USERS, USER_BY_MEMBER_CODE } from '@/services/GraphQL/users/queries'
import { User } from '@/services/GraphQL/users/types'

interface GetParams {
  limit?: number
  offset?: number
  query?: string
}

export const getMemberByMemberCode = async (memberCode: string) => {
  const { data } = await client.query<{ users: User[] }>({
    query: USER_BY_MEMBER_CODE,
    variables: {
      memberCode,
    },
  })

  if (data.users.length) {
    return { user: data.users[0] }
  }

  return { error: 'Usuario no encontrado' }
}

export const getMembers = async (
  params?: GetParams,
): Promise<{ users: User[] | undefined; error: ApolloError | undefined }> => {
  const { data, error } = await client.query<{ users: User[] }>({
    query: MEMBER_USERS,
    variables: {
      offset: params?.offset || 0,
      limit: params?.limit || 24,
      query: params?.query || '%',
    },
  })

  return { users: data.users, error }
}

export const toggleMember = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query
    const isActive = !(req.query['is-active'] === 'true' || false)
    await client.mutate({
      mutation: TOGGLE_USER,
      variables: { id, isActive },
    })
    res.status(200).json({ msg: 'Member toggled  successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
}

export const createMember = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { body } = req
    const { data, errors: userErrors } = await client.mutate({
      mutation: CREATE_USER_MEMBER,
      variables: {
        memberCode: body.memberCode,
        password: body.password,
        position: body.position,
        type: body.type,
        isActive: body.isActive,
      },
    })

    if (userErrors) {
      return res.status(500).json(userErrors)
    }

    const newMember = {
      firstNames: body.namePartner,
      lastNames: body.lastnamePartner,
      startDate: body.startDate,
      email: body.email,
      userId: data?.user?.id,
    }

    const { data: dataMember, errors: memberErrors } = await client.mutate({
      mutation: CREATE_MEMBER,
      variables: newMember,
    })

    if (memberErrors) {
      return res.status(500).json(memberErrors)
    }

    const memberId = dataMember.member.id
    return res.json({
      msg: 'Member created successfully',
      data: { ...newMember, memberId },
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

export const updateMember = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userId = req.query?.id
    const { body } = req

    const { data, errors: userErrors } = await client.mutate({
      mutation: UPDATE_MEMBER,
      variables: {
        ...body,
        userId,
      },
    })

    if (userErrors) {
      return res.status(500).json(userErrors)
    }
    return res.json({
      msg: 'Member updated successfully',
      data,
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

export const deleteMember = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query
    await client.mutate({
      mutation: DELETE_MEMBER_INSCRIPTION,
      variables: { id },
    })
    await client.mutate({
      mutation: DELETE_SUBSCRIPTION,
      variables: { id },
    })
    const { data } = await client.mutate({
      mutation: DELETE_MEMBER,
      variables: { id },
    })

    await client.mutate({
      mutation: DELETE_USER,
      variables: { id: data?.member?.userId },
    })

    res.status(200).json({ msg: 'Member deleted successfully' })
  } catch (error) {
    res.status(500).json(error)
  }
}
