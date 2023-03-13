import { builder } from '../builder'
import { getSSLInfo } from '../utils'

builder.objectType('Certificate', {
  fields: (t) => ({
    country: t.exposeString('C', { description: 'Country', nullable: true }),
    state: t.exposeString('ST', { description: 'State', nullable: true }),
    locality: t.exposeString('L', { description: 'Locality', nullable: true }),
    organization: t.exposeString('O', {
      description: 'Organization',
      nullable: true,
    }),
    organizationUnit: t.exposeString('OU', {
      description: 'Organizational Unit',
      nullable: true,
    }),
    commonName: t.exposeString('CN', {
      description: 'Common Name',
      nullable: true,
    }),
    businessCategory: t.exposeString('businessCategory', {
      description: 'Business Category',
      nullable: true,
    }),
  }),
})

builder.objectType('SSLCheckResponse', {
  fields: (t) => ({
    domain: t.exposeString('domain', { description: 'Domain name' }),
    valid: t.exposeBoolean('validForMostDevices', {
      description: 'Is SSL certificate valid',
    }),
    validFrom: t.exposeString('validFrom', {
      description: 'SSL certificate valid from',
    }),
    validTo: t.exposeString('validTo', {
      description: 'SSL certificate valid to',
    }),
    expiresInDays: t.exposeInt('expiresInDays', {
      description: 'Days left for SSL certificate to expire',
    }),
    issuer: t.field({
      type: 'Certificate',
      description: 'SSL certificate issuer',
      nullable: true,
      resolve: (parent) => {
        return parent.issuer
      },
    }),
    subject: t.field({
      type: 'Certificate',
      description: 'SSL certificate subject',
      nullable: true,
      resolve: (parent) => {
        return parent.subject
      },
    }),
    serialNumber: t.exposeString('serialNumber', {
      description: 'SSL certificate serial number',
      nullable: true,
    }),
    fingerprint: t.exposeString('fingerprint', {
      description: 'SSL certificate fingerprint',
      nullable: true,
    }),
    fingerprint256: t.exposeString('fingerprint256', {
      description: 'SSL certificate fingerprint256',
      nullable: true,
    }),
    fingerprint512: t.exposeString('fingerprint512', {
      description: 'SSL certificate fingerprint512',
      nullable: true,
    }),
    subjectAltName: t.exposeString('subjectAltName', {
      description: 'SSL certificate subjectaltname',
      nullable: true,
    }),
    certType: t.exposeString('certType', {
      description: 'SSL certificate certType',
      nullable: true,
    }),
  }),
})

builder.queryFields((t) => ({
  sslCheck: t.field({
    type: 'SSLCheckResponse',
    description: 'Check SSL certificate',
    args: {
      domain: t.arg.string({ required: true }),
    },
    resolve: async (_, { domain }) => {
      const {
        validFrom,
        validTo,
        expiresInDays,
        issuer,
        subject,
        serialNumber,
        fingerprint,
        fingerprint256,
        fingerprint512,
        validForMostDevices,
        subjectAltName,
        certType,
      } = await getSSLInfo(domain)
      return {
        domain,
        valid: validForMostDevices,
        validFrom,
        validTo,
        expiresInDays,
        issuer,
        subject,
        validForMostDevices,
        serialNumber: serialNumber,
        fingerprint,
        fingerprint256,
        fingerprint512,
        subjectAltName,
        certType,
      }
    },
  }),
}))
