import React from 'react';

import Carousel from '../components/hp/carousel/Carousel';
import TabbedLists from '../components/hp/tabbed-lists/TabbedLists';
import CategoryTiles from '../components/hp/category-tiles/CategoryTiles';

export default function HomePage() {
  return (
    <>
      <Carousel />
      <TabbedLists />
      <CategoryTiles />
    </>
  );
}
