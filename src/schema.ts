import { gql } from 'apollo-server-lambda';

export default () => gql`
  scalar DateTime
  scalar JSONObject

  type Thing @key(fields: "id") {
    id: ID!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  input CreateThingInput {
    name: String!
  }

  input UpdateThingInput {
    id: String!
    name: String!
  }

  input DeleteThingInput {
    id: String!
  }

  type ThingPayload {
    consumedCapacity: Float
    item: Thing
  }

  type ThingListPayload {
    consumedCapacity: Float
    lastScannedId: ID
    items: [Thing]
    count: Int
  }

  type Query {
    item(id: ID!): ThingPayload
    items(input: JSONObject): ThingListPayload
    getAll: ThingListPayload
  }

  type Mutation {
    createThing(input: CreateThingInput!): ThingPayload
    updateThing(input: UpdateThingInput!): ThingPayload
    deleteThing(id: ID!): ThingPayload
  }
`;
