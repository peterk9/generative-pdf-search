import { Weaviate } from './weaviate';

import { config } from '../../config';

export const weaviate = new Weaviate(config.weviate);