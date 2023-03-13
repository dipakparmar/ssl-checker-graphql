import type { CORSOptions, YogaInitialContext } from 'graphql-yoga'
import { Certificate, PeerCertificate } from 'tls'

export type Context = YogaInitialContext

export type CreateServerProps = {
  cors?: CORSOptions
  graphiql?: boolean
  graphqlEndpoint?: string
  landingPage?: boolean
}

export type SSLCheckInput = {
  domain: string
}

export type SSLCheckResponse = {
  validForMostDevices: boolean
  domain: string
  validFrom: string
  validTo: string
  expiresInDays: number
  issuer: NewCertificate
  subject: NewCertificate
  serialNumber: string
  fingerprint: string
  fingerprint256: string
  fingerprint512: string
  subjectAltName?: string
  certType?: string
}

export type NewCertificate = Certificate & {
  businessCategory?: string
}
interface NewPeerCertificate extends PeerCertificate {
  // extend subject and issuer with businessCategory
  subject: NewCertificate
  issuer: NewCertificate
}

export type { NewPeerCertificate as PeerCertificate }

export type { NewCertificate as Certificate }
