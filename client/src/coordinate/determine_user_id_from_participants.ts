import { Participant } from "../app/types"

const sha256hash = async (str: string): Promise<string> => {
  const hash_array = Array.from(
    new Uint8Array(
      await window.crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(str)
      )
    ) // convert buffer to byte array
  )
  const hash_hex = hash_array
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("") // convert bytes to hex string
  return hash_hex
}

export async function determind_user_id_from_participants(
  user_email: string,
  participants: Participant[]
): Promise<string> {
  const hash_hex = await sha256hash(user_email)

  for (const participant of participants) {
    if (participant.id === hash_hex) {
      return participant.id
    }
  }
  return ""
}
