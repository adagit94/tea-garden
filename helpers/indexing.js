import { getIndexRecords } from 'firebase/db';

export async function indexProducts() {
  const records = await getIndexRecords();

  window.fetch('/api/search-indexing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(records),
  });
}
