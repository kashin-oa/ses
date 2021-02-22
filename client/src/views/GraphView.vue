<template>
  <Graph
    class="graph"
    ref="graph"
    v-on="mouseListeners"
  >
    <!-- <template v-slot:NodeTemplate="{node}">
      <g>
        <rect
          width="20"
          height="20"
          :x="node.x - 10"
          :y="node.y - 10"
          fill="white"
          stroke="black"
        ></rect>
        <text :x="node.x" :y="node.y">
          {{node.id}}
        </text>
      </g>
    </template> -->
  </Graph>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Graph from '@/components/Graph/Graph.vue';
import History from '@/components/History';
import { IStrategy } from '@/components/Strategy/ControlStrategy';
// import DefaultStrategy from '@/components/Strategy/DefaultStrategy';
// import LinkStrategy from '@/components/Strategy/LinkStrategy';
import AdditionStrategy from '@/components/Strategy/AdditionStrategy';
import MouseController from '@/components/Controller/MouseController';
import { IListeners } from '@/components/Controller/Controller';

@Options({
  components: { Graph }
})
export default class GraphView extends Vue {
  protected history: History = new History();
  protected strategy!: IStrategy;
  protected mouseController!: MouseController;
  protected mouseListeners: IListeners = {};

  $refs!: {
    graph: Graph
  }

  mounted(): void {
    // this.strategy = new DefaultStrategy(this.$refs.graph, this.history);
    this.strategy = new AdditionStrategy(this.$refs.graph, this.history);
    // this.strategy = new LinkStrategy(this.$refs.graph, this.history);
    this.strategy.init();
    this.mouseController = new MouseController(this.strategy);
    this.mouseController.setOrigin(this.$refs.graph.$el);
    this.mouseListeners = this.mouseController.getListeners();
  }

  graphClick(event: MouseEvent): void {
    this.$refs.graph.addNode(event.offsetX, event.offsetY);
  }
}
</script>

<style lang="less" scoped>
  .container {
    display: flex;
  }

  .graph {
    border: 1px solid black;
  }
</style>
