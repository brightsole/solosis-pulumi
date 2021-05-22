export type Item = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Input = {
  input: Partial<Item>;
};

export type IdObject = {
  id: string;
};

export type GenericItemPayload = {
  success: boolean;
  item?: Item;
};
