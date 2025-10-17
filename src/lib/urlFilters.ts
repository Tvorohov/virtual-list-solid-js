import { createEffect, onCleanup, onMount } from "solid-js";

import type { ListState } from "./listState";

export type ParsedFilters = {
  sort: ListState["filters"]["sort"];
  order: ListState["filters"]["order"];
  q: string;
  minPrice?: number;
  maxPrice?: number;
  scroll?: number;
};

export type FiltersSyncState = Pick<
  ListState,
  "filters" | "setSort" | "setOrder" | "setQ" | "setMinPrice" | "setMaxPrice"
>;

export function parseFiltersFromUrl(): ParsedFilters {
  const search = typeof window !== "undefined" && window.location ? window.location.search : "";
  const qp = new URLSearchParams(search);
  return {
    sort: (qp.get("sort") || "name") as ParsedFilters["sort"],
    order: (qp.get("order") || "asc") as ParsedFilters["order"],
    q: qp.get("q") || "",
    minPrice: qp.get("min") ? Number(qp.get("min")) : undefined,
    maxPrice: qp.get("max") ? Number(qp.get("max")) : undefined,
    scroll: qp.get("scroll") ? Number(qp.get("scroll")) : undefined,
  };
}

export function useFiltersUrlSync(state: FiltersSyncState, restoreScroll?: (scroll: number | undefined) => void) {
  onMount(() => {
    if (typeof window === "undefined") return;

    const init = parseFiltersFromUrl();
    state.setSort(init.sort);
    state.setOrder(init.order);
    state.setQ(init.q);
    state.setMinPrice(init.minPrice);
    state.setMaxPrice(init.maxPrice);
    restoreScroll?.(init.scroll);

    const handlePop = () => {
      const next = parseFiltersFromUrl();
      state.setSort(next.sort);
      state.setOrder(next.order);
      state.setQ(next.q);
      state.setMinPrice(next.minPrice);
      state.setMaxPrice(next.maxPrice);
      restoreScroll?.(next.scroll);
    };
    window.addEventListener("popstate", handlePop);
    onCleanup(() => window.removeEventListener("popstate", handlePop));
  });

  createEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    params.set("sort", state.filters.sort);
    params.set("order", state.filters.order);
    if (state.filters.q) params.set("q", state.filters.q);
    if (state.filters.minPrice !== undefined) params.set("min", String(state.filters.minPrice));
    if (state.filters.maxPrice !== undefined) params.set("max", String(state.filters.maxPrice));
    const url = `${location.pathname}?${params.toString()}`;
    history.replaceState(history.state, "", url);
  });
}
