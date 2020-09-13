import algoliasearch from 'algoliasearch';

export default function uploadIndexRecords(req, res) {
  const index = algoliasearch(
    'XP39PLM1ZJ',
    process.env.ALGOLIA_ADMIN_API_KEY
  ).initIndex('tea-garden');

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

  index.saveObjects(req.body).catch(err => {
    console.error(err);
  });
}
