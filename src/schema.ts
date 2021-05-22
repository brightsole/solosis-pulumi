import { gql } from 'apollo-server-lambda';

// TODO: query for items, and payload that has useful query info
export default () => gql`
  scalar DateTime
  scalar JSONObject

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
    consumedCapacity: Float
    item: Item
  }

  type ListPayload {
    consumedCapacity: Float
    lastScannedId: ID
    items: [Item]
    count: Int
  }

  type Query {
    item(id: ID!): GenericPayload
    items(input: JSONObject): ListPayload
    getAll: ListPayload
  }

  type Mutation {
    createItem(input: CreateItemInput!): GenericPayload
    updateItem(input: UpdateItemInput!): GenericPayload
    deleteItem(id: ID!): GenericPayload
  }
`;
