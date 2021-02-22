<template>
  <div class="about">
    <h1>This is an about page</h1>
    <List
      title="List title"
      :elements="elements"
      @element-click="onElementClick"
    ></List>
    <button @click="onModeButtonClick">Mode: {{ modes[mode] }}</button>
  </div>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import List, { IElement } from '@/views/List.vue';

class Props {
  msg = prop<string>({ default: 'default_msg' });
  arr = prop<number[]>({ default: [] });
}

@Options({
  components: {
    List
  }
})
export default class About extends Vue.with(Props) {
  private elements: IElement[] = [{
    id: 1,
    name: 'element 1'
  }, {
    id: 2,
    name: 'element 2'
  }, {
    id: 3,
    name: 'element 3'
  }];

  private modes: string[] = ['add', 'delete', 'change'];
  private mode: number = 1;

  protected onModeButtonClick(): void {
    const isModeExist = !!this.modes[this.mode + 1];
    this.mode = isModeExist ? this.mode + 1 : 0;
  }

  protected onElementClick(element: IElement, index: number): void {
    if (this.modes[this.mode] === 'add') {
      this.addElement();
    } else if (this.modes[this.mode] === 'delete') {
      this.deleteElement(index);
    } else {
      this.changeElement(element, index);
    }
  }

  protected addElement(): void {
    const id = this.elements.length + 1;
    this.elements.push({
      id,
      name: `element ${id}`
    });
  }

  protected deleteElement(index: number): void {
    this.elements.splice(index, 1);
  }

  protected changeElement(element: IElement, index: number): void {
    // const num = element.name.match(/\d+/);
    const num = this.elements[index - 1].name.match(/\d+/);

    if (num) {
      this.elements[index].name = `element ${Number(num) + 1}`;
    }
  }
}
</script>
