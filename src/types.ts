export type Thing = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Input = {
  input: Partial<Thing>;
};

export type IdObject = {
  id: string;
};

export type Context = {
  dataSources: any;
  hashKey?: string;
};

export type GenericThingPayload = {
  success: boolean;
  item?: Thing;
};
