export type Set = {
  id: string;
  name: string;
  description: string | null;
  cards: {
    id: number;
    definition: string | null;
    term: string;
    setId: string;
    termUrl: string | null;
    termKey: string | null;
    definitionUrl: string | null;
    definitionKey: string | null;
  }[];
};
