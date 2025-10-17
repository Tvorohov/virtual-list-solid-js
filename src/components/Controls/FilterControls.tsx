import { createSignal, createEffect, onCleanup } from "solid-js";
import type { Component } from "solid-js";

import { useListState } from "~/lib/listState";
import { debounce } from "~/lib/utils";
import "./Controls.css";

const FilterControls: Component = () => {
  const { filters, setQ, setMinPrice, setMaxPrice } = useListState();

  const [localQ, setLocalQ] = createSignal(filters.q);

  const notify = debounce((v: string) => setQ(v), 250);

  createEffect(() => setLocalQ(filters.q));

  onCleanup(() => notify.cancel && notify.cancel());

  return (
    <div class="filterControls">
      <label class="controlLabel">
        Search:
        <input
          class="controlInput"
          value={localQ()}
          onInput={(e) => {
            const v = (e.target as HTMLInputElement).value;
            setLocalQ(v);
            notify(v);
          }}
          placeholder="name..."
        />
      </label>
      <label class="controlLabel">
        Min price:
        <input
          class="controlInput"
          type="number"
          value={filters.minPrice ?? ""}
          onInput={(e) =>
            setMinPrice((e.target as HTMLInputElement).value ? Number((e.target as HTMLInputElement).value) : undefined)
          }
        />
      </label>
      <label class="controlLabel">
        Max price:
        <input
          class="controlInput"
          type="number"
          value={filters.maxPrice ?? ""}
          onInput={(e) =>
            setMaxPrice((e.target as HTMLInputElement).value ? Number((e.target as HTMLInputElement).value) : undefined)
          }
        />
      </label>
    </div>
  );
};

export default FilterControls;
