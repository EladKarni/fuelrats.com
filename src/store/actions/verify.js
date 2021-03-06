import actionTypes from '../actionTypes'
import { frApiRequest } from './services'

export const verifyEmailToken = (token) => {
  return frApiRequest(
    actionTypes.verify.email,
    {
      url: `/verifications/${token}`,
    },
  )
}


export const verifyResetToken = (token) => {
  return frApiRequest(
    actionTypes.verify.reset,
    {
      url: `/resets/${token}`,
    },
  )
}
