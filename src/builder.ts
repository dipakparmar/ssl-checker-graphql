import { SSLCheckResponse } from './types'
import SchemaBuilder from '@pothos/core'
import { Context, Certificate } from './types'
import { GraphQLJSONObject } from 'graphql-scalars'

const builder = new SchemaBuilder<{
  Scalars: {
    JSON: {
      Output: unknown
      Input: JSON
    }
  }
  Objects: {
    SSLCheckResponse: SSLCheckResponse
    Certificate: Certificate
  }
  Context: Context
}>({})

builder.addScalarType('JSON', GraphQLJSONObject, {})
builder.queryType({})

export { builder }
