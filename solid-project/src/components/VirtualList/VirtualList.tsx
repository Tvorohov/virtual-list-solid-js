import { For } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

import "./VirtualList.css";
import { useVirtualList } from "./useVirtualList";

type VirtualListProps<T> = {
  items: () => T[];
  itemHeight: number;
  height?: number;
  overscan?: number;
  children: (item: T, index: number) => JSX.Element;
  initialScroll?: number;
  onScroll?: (scrollTop: number) => void;
  forwardRef?: (el: HTMLDivElement | undefined) => void;
};

export default function VirtualList<T>({
  overscan = 3,
  height = 0,
  items,
  itemHeight,
  children,
  initialScroll = 0,
  onScroll,
  forwardRef: propsForwardRef,
}: VirtualListProps<T>) {
  const { setContainerRef, totalHeight, startIndex, endIndex } = useVirtualList({
    itemsLength: () => items().length,
    itemHeight,
    overscan,
    height,
    initialScroll,
    onScroll,
    forwardRef: propsForwardRef,
  });

  return (
    <div
      ref={setContainerRef as any}
      class={"virtualListContainer"}
      style={{ height: height ? `${height}px` : "100%" }}
    >
      <div style={{ height: `${totalHeight()}px`, position: "relative" }}>
        <For each={items().slice(startIndex(), endIndex())}>
          {(item, idx) => {
            const absoluteIndex = () => startIndex() + idx();
            const top = () => absoluteIndex() * itemHeight;
            return (
              <div
                style={
                  {
                    position: "absolute",
                    top: `${top()}px`,
                    height: `${itemHeight}px`,
                    width: "100%",
                    ["will-change"]: "transform",
                  } as any
                }
              >
                {children(item, absoluteIndex())}
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
