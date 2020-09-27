import Link from 'next/link';
import React, { useRef, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  connectSearchBox,
  connectHits,
} from 'react-instantsearch-dom';

import styles from './Search.module.scss';

const client = algoliasearch('XP39PLM1ZJ', 'c6133af1b2f7b9711644f60a88f81d4c');
const searchClient = {
  search(requests) {
    if (requests.every(({ params }) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          processingTimeMS: 0,
        })),
      });
    }

    return client.search(requests);
  },
};

function CustomSearchBox({ currentRefinement, refine, clearSearchRef }) {
  useEffect(() => {
    clearSearchRef.current = () => refine('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form className='ml-2' inline>
      <Form.Group controlId='nav-search-field'>
        <Form.Label srOnly>Vyhledávač</Form.Label>
        <Form.Control
          className='border-secondary bg-header text-white'
          value={currentRefinement}
          onChange={e => refine(e.currentTarget.value)}
          type='search'
          placeholder='Hledat'
          autoComplete='off'
        />
      </Form.Group>
    </Form>
  );
}

function CustomHits({ hits, clearSearch }) {
  return (
    <ListGroup onSelect={clearSearch} className={`px-3 ${styles.results}`}>
      {hits.map(hit => (
        <Link
          key={hit.objectID}
          href='/[...param]'
          as={`/${hit.url.category}/${hit.url.subcategory}/${hit.url.product}`}
          passHref
        >
          <ListGroup.Item
            as='a'
            className='d-flex justify-content-between align-items-center'
          >
            <div>
              <img
                className='border border-header rounded'
                src={hit.image}
                alt={hit.title}
                width='50'
                height='50'
              />{' '}
              <b>{hit.title}</b> {hit.weight}g
            </div>
            <div>{hit.price} Kč</div>
          </ListGroup.Item>
        </Link>
      ))}
    </ListGroup>
  );
}

const SearchBox = connectSearchBox(CustomSearchBox);
const Hits = connectHits(CustomHits);

export default function Search() {
  const clearSearchRef = useRef(null);

  return (
    <InstantSearch searchClient={searchClient} indexName='tea-garden'>
      <SearchBox clearSearchRef={clearSearchRef} />
      <Hits clearSearch={clearSearchRef.current} />
    </InstantSearch>
  );
}
