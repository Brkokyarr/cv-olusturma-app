import type { SmokingStatus } from '../types/cv'

export function getSmokingLabel(status: SmokingStatus): string {
  return status === 'evet' ? 'Evet' : 'Hayır'
}
