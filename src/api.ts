import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const apolloClient = new ApolloClient({
    uri: 'https://node-beta-2.fuel.network/graphql',
    cache: new InMemoryCache(),
});

const LATEST_TRANSACTIONS_QUERY = `
      query LatestTransactions {
          transactions(last: 5) {
            nodes {
              id
              isScript
              isMint
              isCreate
              inputAssetIds
              inputContracts {
                id
              }
              status {
                __typename
                ... on SuccessStatus {
                  time
                }
              }
            }
          }
        }`;

export const getLatestTransactions = async () => {
    const response = await apolloClient.query({
        query: gql(LATEST_TRANSACTIONS_QUERY),
    });
    return response.data.transactions;
};

const LATEST_BLOCKS_QUERY = `query LatestBlocks {
  blocks(last: 5) {
    nodes {
      id
      header {
        height
        time
        transactionsCount
      }
    }
  }
}
`;

export const getLatestBlocks = async () => {
    const response = await apolloClient.query({
        query: gql(LATEST_BLOCKS_QUERY),
    });
    return response.data.blocks;
};