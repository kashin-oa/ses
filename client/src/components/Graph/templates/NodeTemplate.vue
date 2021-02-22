<template>
  <slot :id="node.id" :x="node.x" :y="node.y">
    <g>
      <circle
        :cx="node.x"
        :cy="node.y"
        :r="radius"
        stroke="black"
        stroke-width="3"
        fill="white"
        class="graph__node"
      ></circle>
        <text
          :x="node.x - radius * 0.5"
          :y="node.y + radius * 0.5"
          pointer-events="none"
        >
          {{node.id}}
        </text>
    </g>
  </slot>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
import Node from '@/components/Graph/Node';

class Props {
  node: Node = prop<Node>({ required: true });
}

export default class NodeTemplate extends Vue.with(Props) {
  radius: number = 15;
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
