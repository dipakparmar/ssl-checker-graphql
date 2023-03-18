import { createSSLCheckerGraphQLServer } from '@dipakparmar/ssl-checker-graphql'
const server = createSSLCheckerGraphQLServer({
  landingPage: false,
  graphqlEndpoint: '/graphql',
  graphiql: true,
})

export default server
