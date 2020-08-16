import algoliasearch from 'algoliasearch';

import { getIndexRecords } from 'firebase/db';

const client = algoliasearch('XP39PLM1ZJ', '12555952397ae139cb994bbd7fb6a987');
const index = client.initIndex('tea-garden');

export async function uploadIndexRecords() {
  index
    .setSettings({
      searchableAttributes: ['title'],
      ranking: [
        'asc(price)',
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom',
      ],
    })
    .catch(err => {
      console.error(err);
    });

  const records = await getIndexRecords();

  index.saveObjects(records).catch(err => {
    console.error(err);
  });
}
