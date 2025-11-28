export type Locale = 'en' | 'ru' | 'kk'

export const PropertyPurpose = {
  IndividualHousing: 'individual_housing',
  Farm: 'farm',
  SubsidiaryFarming: 'subsidiary_farming',
  Horticulture: 'horticulture',
  Commercial: 'commercial',
  LowRiseResidential: 'low_rise_residential',
  Dacha: 'dacha',
  Other: 'other',
} as const

export type PropertyPurpose = (typeof PropertyPurpose)[keyof typeof PropertyPurpose]

export const PledgeStatus = {
  InPledge: 'in_pledge',
  NotInPledge: 'not_in_pledge',
  NotSpecified: 'not_specified',
} as const

export type PledgeStatus = (typeof PledgeStatus)[keyof typeof PledgeStatus]

export const Divisibility = {
  Divisible: 'divisible',
  Indivisible: 'indivisible',
  NotSpecified: 'not_specified',
} as const

export type Divisibility = (typeof Divisibility)[keyof typeof Divisibility]
