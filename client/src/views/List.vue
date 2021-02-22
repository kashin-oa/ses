<template>
  <h2>{{ title }}</h2>
  <div
    class="list__element"
    v-for="(el, i) in elements"
    :key="el.id"
    @click="$emit('element-click', el, i)"
  >
    {{el.name}}
  </div>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';

export interface IElement {
  id: number;
  name: string;
}

class Props {
  elements = prop<IElement[]>({ default: [] });
  title = prop<string>({});
}

@Options({
  emits: ['element-click']
})
export default class List extends Vue.with(Props) {

}

</script>

<style lang="less">
  .list__element {
    cursor: pointer;
    margin: 10px;
  }
</style>
