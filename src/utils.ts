import https from 'https'
import { TLSSocket } from 'tls'
import { SSLCheckResponse, PeerCertificate } from './types'

export const getDaysBetween = (validFrom: Date, validTo: Date): number => {
  return Math.round(Math.abs(+validFrom - +validTo) / 8.64e7)
}

const getDaysRemaining = (validFrom: Date, validTo: Date): number => {
  const daysRemaining = getDaysBetween(validFrom, validTo)
  if (new Date(validTo).getTime() < new Date().getTime()) {
    return -daysRemaining
  }
  return daysRemaining
}

export const detectCertificateType = (cert: PeerCertificate) => {
  if (cert && cert.subject && cert.subject.CN) {
    let certType

    if (cert.subject['businessCategory'] === 'Private Organization') {
      certType = 'EV'
    } else if (cert.subject.O) {
      certType = 'OV'
    } else if (cert.subject.CN) {
      certType = 'DV'
    } else {
      certType = 'Unknown'
    }
    return certType
  }
}

export const getSSLInfo = async (domain: string): Promise<SSLCheckResponse> => {
  const options = {
    agent: false,
    method: 'GET',
    port: 443,
    rejectUnauthorized: false,
    hostname: domain,
  }

  return new Promise((resolve, reject) => {
    try {
      const req = https.request(options, (res) => {
        const crt = (res.socket as TLSSocket).getPeerCertificate(),
          vFrom = crt.valid_from,
          vTo = crt.valid_to
        const validTo = new Date(vTo)
        resolve({
          domain,
          expiresInDays: getDaysRemaining(new Date(), validTo),
          validForMostDevices: (res.socket as TLSSocket).authorized,
          validFrom: new Date(vFrom).toISOString(),
          validTo: validTo.toISOString(),
          subject: crt.subject,
          // crt.issuer.OU can be string or array of strings convert it to single string for consistency
          issuer: {
            ...crt.issuer,
            OU: Array.isArray(crt.issuer.OU)
              ? crt.issuer.OU.join(', ')
              : crt.issuer.OU,
          },
          fingerprint: crt.fingerprint,
          fingerprint256: crt.fingerprint256,
          fingerprint512: crt.fingerprint512,
          serialNumber: crt.serialNumber,
          subjectAltName: crt.subjectaltname,
          certType: detectCertificateType(crt),
        })
      })
      req.on('error', reject)
      req.end()
    } catch (e) {
      reject(e)
    }
  })
}
