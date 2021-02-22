<template>
  <g overflow="visible" :cursor="cursor">
    <circle
      :r="node.r"
      :cx="node.x"
      :cy="node.y"
      :stroke="node.stroke"
      :stroke-width="node.strokeWidth"
      :fill="node.fill"
      class="graph__node"
      :class="{ graph__node_selected: node.selected }"
    ></circle>
    <text
      :x="node.x - node.r * 0.5"
      :y="node.y + node.r * 0.5"
      pointer-events="none"
      >{{ node.id }}</text
    >
  </g>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import Node from './Node';
import D3Service from '@/components/d3.service';
import { INodeView } from '@/components/Graph/Interfaces';
import { IRect } from '@/components/geometry';

class Props {
  node: Node = prop<Node>({ required: true });
  onDragStart!: Function;
  onDragMove!: Function;
  onDragEnd!: Function;
  cursor!: string;
}

@Options({})
export default class NodeView extends Vue.with(Props) implements INodeView {
  elem!: Element;

  mounted(): void {
    this.elem = this.$el;
    this.node.view = this;
    D3Service.applyDraggableBehaviour(
      this.$el,
      this.onDragStart,
      this.onDragMove,
      this.onDragEndWrapper.bind(this)
    );
  }

  beforeUpdate(): void {
    // ...
  }

  updated(): void {
    // this.canEmit = true;
  }

  beforeDestroy(): void {
    this.node.view = null;
  }

  // protected onDrag(name: string, x: number, y: number, active: boolean): void {
  //     this.$emit(name, x, y, active);
  // }

  protected onDragEndWrapper(x: number, y: number, active: boolean, event: MouseEvent): void {
    this.onDragEnd(x, y, active);
    // d3 drag behaviour consumes and stops mouseup events
    this.$emit('node-mouse-up', event);
  }

  getRect(): IRect {
    // TODO: Попробовать getBBox()
    const size = this.node.r * 2;
    const x = (this.node.fx || this.node.x) - this.node.r;
    const y = (this.node.fy || this.node.y) - this.node.r;

    return {
      x,
      y,
      width: size,
      height: size
    };
  }
}
</script>

<style lang="less" scoped>
.graph__node {
  &_selected {
    stroke: #1f1ab2;
    fill: #7673d9;
  }

  &:hover {
    fill: #9392de;
  }
}
</style>
