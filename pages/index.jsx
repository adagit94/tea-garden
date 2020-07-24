import React from 'react';

import Carousel from 'components/index/carousel/Carousel';
import TabbedLists from 'components/index/tabbed-lists/TabbedLists';
import CategoryTiles from 'components/index/category-tiles/CategoryTiles';

export default function HomePage() {
  return (
    <>
      <Carousel />
      <TabbedLists />
      <CategoryTiles />
    </>
  );
}
