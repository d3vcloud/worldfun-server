export interface Participant {
  userId: any
  fullName: string
  email: string
  avatar: string
}

export interface ServerToClientsEvents {
  // connected-users
  sendParticipants: (participants: Array<Participant>) => void
  // new-user
  newParticipantJoined: (participant: Participant) => void
  // user-left
  participantLeft: (participant: Participant) => void
}
