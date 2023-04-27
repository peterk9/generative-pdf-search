import { weaviate } from '../index';

async function createSchema(): Promise<void> {
  console.log(`[Scripts] creating weviate schema`);
  
  await weaviate.createSchema({
    class: 'Document',
    description: 'A pdf document that was chunked into smaller text',
    vectorizer: 'text2vec-openai',
    properties: [
      {
        dataType: ['text'],
        description: 'The name of the original document',
        name: 'documentName'
      },
      {
        dataType: ['text'],
        description: 'A text chunk from the original document',
        name: 'chunk'
      },
      {
        dataType: ['number'],
        description: 'the index of a the chunk',
        name: 'chunkIndex'
      },
      {
        dataType: ['text'],
        description: 'the purpose of the document',
        name: 'category'
      }
    ]
  });
  
  console.log(`[Scripts] weviate schema created`);
};

createSchema().catch(console.error);