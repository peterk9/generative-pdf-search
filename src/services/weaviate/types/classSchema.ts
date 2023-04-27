export interface ClassSchema {
  class: string,
  vectorizer: 'text2vec-openai',
  description: string,
  properties: {
    dataType: string[],
    description: string,
    name: string,
  }[];
};