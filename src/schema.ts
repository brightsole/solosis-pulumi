import { gql } from 'apollo-server-lambda';

// TODO: query for items, and payload that has useful query info
export default () => gql`
  scalar DateTime

  type Item @key(fields: "id") {
    id: ID!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  input CreateItemInput {
    name: String!
  }

  input UpdateItemInput {
    id: String!
    name: String!
  }

  input DeleteItemInput {
    id: String!
  }

  type GenericPayload {
    success: Boolean!
    item: Item
  }

  type Query {
    item(id: ID!): GenericPayload
  }

  type Mutation {
    createItem(input: CreateItemInput!): GenericPayload
    updateItem(input: UpdateItemInput!): GenericPayload
    deleteItem(id: ID!): GenericPayload
  }
`;
