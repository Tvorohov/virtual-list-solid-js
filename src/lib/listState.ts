import { createContext, useContext, createMemo, type JSX } from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";

import { stableSort } from "./utils";
import type { DemoItem } from "./data";

export type SortKey = "name" | "price" | "updatedAt";
export type SortOrder = "asc" | "desc";

export type ListFilters = {
  sort: SortKey;
  order: SortOrder;
  q: string;
  minPrice?: number;
  maxPrice?: number;
};

export type ListState = {
  filters: ListFilters;
  setFilters: SetStoreFunction<ListFilters>;
  setSort: (value: SortKey) => void;
  setOrder: (value: SortOrder) => void;
  setQ: (value: string) => void;
  setMinPrice: (value: number | undefined) => void;
  setMaxPrice: (value: number | undefined) => void;
  filtered: () => DemoItem[];
};

const ListStateContext = createContext<ListState>();

export function createListState(dataAccessor: () => readonly DemoItem[]): ListState {
  const [filters, setFilters] = createStore<ListFilters>({
    sort: "name",
    order: "asc",
    q: "",
    minPrice: undefined,
    maxPrice: undefined,
  });

  const filtered = createMemo(() => {
    const source = dataAccessor();
    const search = filters.q.trim().toLowerCase();
    const min = filters.minPrice;
    const max = filters.maxPrice;

    const narrowed = source.filter((item) => {
      if (search && !item.name.toLowerCase().includes(search)) return false;
      if (min !== undefined && item.price < min) return false;
      if (max !== undefined && item.price > max) return false;
      return true;
    });

    const comparator = (a: DemoItem, b: DemoItem) => {
      let result = 0;
      if (filters.sort === "name") result = a.name.localeCompare(b.name);
      else if (filters.sort === "price") result = a.price - b.price;
      else result = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      return filters.order === "asc" ? result : -result;
    };

    return stableSort(narrowed, comparator);
  });

  return {
    filters,
    setFilters,
    setSort: (value) => setFilters("sort", value),
    setOrder: (value) => setFilters("order", value),
    setQ: (value) => setFilters("q", value),
    setMinPrice: (value) => setFilters("minPrice", value),
    setMaxPrice: (value) => setFilters("maxPrice", value),
    filtered,
  };
}

type ListStateProviderProps = {
  data: () => readonly DemoItem[];
  children: JSX.Element;
};

export function ListStateProvider(props: ListStateProviderProps) {
  const state = createListState(props.data);
  return <ListStateContext.Provider value={state}>{props.children}</ListStateContext.Provider>;
}

export function useListState() {
  const ctx = useContext(ListStateContext);
  if (!ctx) throw new Error("useListState must be used within a ListStateProvider");
  return ctx;
}
