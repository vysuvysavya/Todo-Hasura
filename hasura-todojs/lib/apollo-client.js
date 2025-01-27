import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://rapid-goose-46.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret": '3LnheRTdLi25IJ8UOAsK2N2e39CfgPqLxvoFJy4nLZABjTti4o5cfDl1G1zX0kJh',
  },
  cache: new InMemoryCache(),
});

export default client;
