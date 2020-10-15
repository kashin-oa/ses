<template>
  <div class="container">
    <Graph
      class="graph"
      ref="graph"
      v-on="mouseListeners"
    />
  </div>
</template>

<script lang="ts">
  // @ is an alias to /src
  import Vue from 'vue';
  import { Component, Ref } from 'vue-property-decorator';
  import Graph from '@/components/Graph/Graph.vue';
  import { IGraph } from '@/components/Graph/Interfaces';
  import { IStrategy } from '@/components/Strategy/ControlStrategy';
  import DefaultStrategy from '@/components/Strategy/DefaultStrategy';
  import LinkStrategy from '@/components/Strategy/LinkStrategy';
  import History from '@/components/History';
  import MouseController from '@/components/Controller/MouseController';
  import { IListeners } from '@/components/Controller/Controller';

  @Component({
  components: {
    Graph
  }
})
export default class Home extends Vue {
  protected history: History = new History();
  protected strategy!: IStrategy;
  protected mouseController!: MouseController;
  protected mouseListeners: IListeners = {};

  @Ref() readonly graph!: Graph;
  $refs!: Vue['$refs'] & {
    graph: IGraph & Vue; // InstanceType<typeof Graph>
  };

  mounted(): void {
    // this.strategy = new DefaultStrategy(this.$refs.graph, this.history);
    this.strategy = new LinkStrategy(this.$refs.graph, this.history);
    this.strategy.init();
    this.mouseController = new MouseController(this.strategy);
    this.mouseController.setOrigin(this.$refs.graph.$el)
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
