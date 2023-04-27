import { extractTextFromFile, chunkText } from '../../../utils';

import { weaviate } from '../index';

const filepath = 'src/data/glossary-seed-policy-pdf.pdf';
const filetype = 'application/pdf';

async function upload(): Promise<void> {
  console.log(`extracting [${filetype}][${filepath}]`);
  const text = await extractTextFromFile({ filepath, filetype });
  const chunks = chunkText({ text });
  await weaviate.createTextChunkEmbeddings(chunks, 'seed-transfer-policy', 'policy');
};

upload().catch(console.error);