export type Participant = {
  id: string;
  email?: string;
  name: string;
  food_to_bring: string;
}

export type RegisterForPotluckInput = {
  email: string;
  name?: string;
  food_to_bring?: string;
}

export type RegisterForPotluckResult = {
  potluck_participants: Participant[];
}

export type ListParticipantsResult = {
  potluck_participants: Participant[];
}
