import { createYoga, YogaInitialContext } from 'graphql-yoga'
import { createServer } from 'node:http'

import { schema } from './schema'
import { Context, CreateServerProps } from './types'

const createSSLCheckerGraphQLServer = (params?: CreateServerProps) => {
  const cors = params?.cors
  const graphqlEndpoint = params?.graphqlEndpoint || '/graphql'
  const graphiql = params?.graphiql || false
  const landingPage = params?.landingPage || false

  const context = (context: YogaInitialContext): Context => {
    // return
    return {
      ...context,
    }
  }

  return createServer(
    createYoga({
      landingPage,
      cors,
      graphiql,
      graphqlEndpoint,
      context,
      schema,
    }),
  )
}

export { createSSLCheckerGraphQLServer, schema }
