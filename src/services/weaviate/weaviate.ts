import weaviate, { WeaviateClient, ApiKey, ObjectsBatcher } from 'weaviate-ts-client';

import { ClassSchema } from './types';

export class Weaviate {

  private client: WeaviateClient;

  constructor(
    options: {
      scheme: string,
      host: string,
      apiKey: string,
      openAIApiKey: string
    }
  ) {
    this.client = weaviate.client({
        scheme: options.scheme,
        host: options.host,
        apiKey: new ApiKey(options.apiKey),
        headers: { 'X-OpenAI-Api-Key': options.openAIApiKey} 
      });
  }

  public async createTextChunkEmbeddings(chunks: string[], documentName: string, documentCategory: string): Promise<void> {
    console.log(`[Weaviate Client] creating embedding for [${chunks.length}] chunks.`);

    // Prepare a batcher
    let batcher: ObjectsBatcher = this.client.batch.objectsBatcher();
    let counter: number = 0;
    let batchSize: number = 100;

    interface Document {
      documentName: string,
      chunk: string,
      chunkIndex: number,
      category: string
    }
  
    const documentChunks: Document[] = chunks.map((chunk, index) => {
      return {
        documentName: documentName,
        chunk: chunk,
        chunkIndex: index,
        category: documentCategory
      }
    });

    documentChunks.forEach((document: Document) => {
        
      const obj = {
        class: 'Document',
        properties: {
          documentName: document.documentName,
          chunk: document.chunk,
          chunkIndex: document.chunkIndex,
          category: document.category
        }
      }

        // add the object to the batch queue
        batcher = batcher.withObject(obj);

        // When the batch counter reaches batchSize, push the objects to Weaviate
        if (counter++ == batchSize) {
          // flush the batch queue
          batcher
          .do()
          .then((res: any) => {
            console.log(`[Weaviate Client] created embedding for [${chunks.length}] chunks.`);
          })
          .catch((err: Error) => {
            console.error(err)
          });

          // restart the batch queue
          counter = 0;
          batcher = this.client.batch.objectsBatcher();
        }
      });

      // Flush the remaining objects
      batcher
      .do()
      .then((res: any[]) => {
        console.log(`[Weaviate Client] flushing remainder. created embedding for [${chunks.length}] chunks.`);
      })
      .catch((err: Error) => {
        console.error(err)
      });
    
  }

  public async generativeSearch(): Promise<any> {
    console.log(`[Weaviate Client] generative search requested.`);

    const result = this.client.graphql
      .get()
      .withClassName('Question')
      .withFields('question answer category')
      .withNearText({ concepts: ['biology'] })
      .withLimit(2)
      .do();
    console.log(`[Weaviate Client] generative search request succeeded.`, result);
  }

  public async createSchema(classSchema: ClassSchema): Promise<void> {
    console.log(`[Weaviate Client] creating class schema.`);
    const response = await this.client
      .schema
      .classCreator()
      .withClass(classSchema)
      .do();
    console.log(`[Weaviate Client] class schema created.`, response);
  }

};

export default Weaviate;

