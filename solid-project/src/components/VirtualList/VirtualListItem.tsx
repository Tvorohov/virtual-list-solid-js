import type { Component } from "solid-js";
import type { DemoItem } from "~/lib/data";
import "./VirtualList.css";

type Props = {
  item: DemoItem;
};

const VirtualListItem: Component<Props> = (props) => {
  return (
    <div class="virtualListItem">
      <div>
        <strong>{props.item.name}</strong>
      </div>
      <div>${props.item.price.toFixed(2)}</div>
      <div class="itemMeta">{new Date(props.item.updatedAt).toLocaleDateString()}</div>
    </div>
  );
};

export default VirtualListItem;
