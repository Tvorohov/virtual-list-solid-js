import type { Component } from "solid-js";

import "./Controls.css";
import { useListState, type SortKey, type SortOrder } from "~/lib/listState";

const SortControls: Component = () => {
  const { filters, setSort, setOrder } = useListState();
  return (
    <div class="sortControls">
      <label class="controlLabel">
        Sort:
        <select
          class="controlInput"
          value={filters.sort}
          onInput={(e) => setSort((e.target as HTMLSelectElement).value as SortKey)}
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="updatedAt">Updated</option>
        </select>
      </label>
      <label class="controlLabel">
        Order:
        <select
          class="controlInput"
          value={filters.order}
          onInput={(e) => setOrder((e.target as HTMLSelectElement).value as SortOrder)}
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </label>
    </div>
  );
};

export default SortControls;
