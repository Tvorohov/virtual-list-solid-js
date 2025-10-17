import { createEffect } from "solid-js";
import VirtualList from "~/components/VirtualList/VirtualList";
import SortControls from "~/components/Controls/SortControls";
import FilterControls from "~/components/Controls/FilterControls";
import VirtualListItem from "~/components/VirtualList/VirtualListItem";
import { generateDataset, type DemoItem } from "~/lib/data";
import { ListStateProvider, useListState } from "~/lib/listState";
import { useFiltersUrlSync } from "~/lib/urlFilters";

import "~/components/VirtualList/VirtualList.css";

const DATA = generateDataset(50000, 1337);

export default function Home() {
  return (
    <ListStateProvider data={() => DATA}>
      <HomeContent />
    </ListStateProvider>
  );
}

function HomeContent() {
  const { filters, setSort, setOrder, setQ, setMinPrice, setMaxPrice, filtered } = useListState();

  let listRef: HTMLDivElement | undefined;

  useFiltersUrlSync({ filters, setSort, setOrder, setQ, setMinPrice, setMaxPrice }, (scroll) => {
    if (scroll !== undefined && listRef) listRef.scrollTop = scroll;
  });

  return (
    <main class="page">
      <h2>Virtual List</h2>
      <div class="controlsRow">
        <SortControls />
        <FilterControls />
      </div>

      <div class="listWrapper">
        <VirtualList forwardRef={(ref) => (listRef = ref)} items={filtered} itemHeight={36} height={600}>
          {(item: DemoItem) => <VirtualListItem item={item} />}
        </VirtualList>
      </div>
    </main>
  );
}
