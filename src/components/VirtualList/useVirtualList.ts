import { createSignal, createMemo, onMount, onCleanup } from "solid-js";

type UseVirtualListOpts = {
  itemsLength: () => number;
  itemHeight: number;
  overscan?: number;
  height?: number;
  initialScroll?: number;
  onScroll?: (scrollTop: number) => void;
  forwardRef?: (el: HTMLDivElement | undefined) => void;
};

export function useVirtualList({
  itemsLength,
  itemHeight,
  overscan = 3,
  height = 0,
  initialScroll = 0,
  onScroll,
  forwardRef,
}: UseVirtualListOpts) {
  let containerRef: HTMLDivElement | undefined;

  const [scrollTop, setScrollTop] = createSignal(0);
  const [containerHeight, setContainerHeight] = createSignal<number>(height);

  let ro: ResizeObserver | undefined;
  onMount(() => {
    if (containerRef) {
      if (initialScroll) containerRef.scrollTop = initialScroll;
      setScrollTop(containerRef.scrollTop);
      if (!containerHeight()) setContainerHeight(containerRef.clientHeight);

      forwardRef?.(containerRef);

      const handleScroll = () => {
        const st = containerRef!.scrollTop;
        setScrollTop(st);
        onScroll?.(st);
      };
      containerRef.addEventListener("scroll", handleScroll);

      ro = new ResizeObserver((entries) => {
        if (!entries.length) return;
        setContainerHeight(entries[0].contentRect.height);
      });
      ro.observe(containerRef);

      onCleanup(() => {
        containerRef?.removeEventListener("scroll", handleScroll);
        ro?.disconnect();
        forwardRef?.(undefined);
      });
    }
  });

  const totalHeight = () => itemsLength() * itemHeight;

  const visibleCount = createMemo(() => {
    const ch = containerHeight() || height;
    const count = Math.ceil((ch || 0) / itemHeight) + overscan * 2;
    return Math.min(count, itemsLength());
  });

  const startIndex = createMemo(() => {
    const st = Math.floor(scrollTop() / itemHeight) - overscan;
    return Math.max(0, Math.min(st, Math.max(0, itemsLength() - visibleCount())));
  });

  const endIndex = createMemo(() => Math.min(itemsLength(), startIndex() + visibleCount()));

  const setContainerRef = (el: HTMLDivElement | undefined) => {
    containerRef = el;
  };

  const scrollTo = (y: number) => {
    if (containerRef) containerRef.scrollTop = y;
  };

  return { setContainerRef, totalHeight, startIndex, endIndex, itemHeight, scrollTo };
}
