<template>
    <g :cursor="cursor" :class="{ graph__selection_disabled: !enabled }"></g>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Node from './Node'
import Link from './Link'
import D3Service from '@/components/d3.service'
import { ISelection, GraphEntities } from '@/components/Graph/Interfaces'
import { Area, Rect, Point } from '@/components/geometry'

    @Component
export default class Selection extends Vue implements ISelection {
        @Prop() nodes!: Node[];
        @Prop() links!: Link[];
        @Prop() transform!: (p: Point) => Point;
        @Prop() enabled!: boolean;
        @Prop() cursor!: string;

        protected cache: GraphEntities[] | null = null;

        mounted (): void {
          D3Service.applyBrushBehaviour(
            this.$el,
            () => this.enabled,
            this.onBrushStartMove,
            this.onBrushEnd
          )
        }

        add (data: GraphEntities | GraphEntities[]): void {
          this.setSelected(data, true)
          this.cache = null
        }

        remove (data: GraphEntities | GraphEntities[]): void {
          this.setSelected(data, false)
          this.cache = null
        }

        clear (): void {
          this.setSelected(this.nodes, false)
          this.setSelected(this.links, false)
          this.cache = null
        }

        moveTo (x: number | null, y: number | null): void {
          const nodes = this.getNodes()
          nodes.forEach((node: Node) => {
            node.moveTo(x, y)
          })
        }

        moveOn (dx: number, dy: number): void {
          const nodes = this.getNodes()
          nodes.forEach((node: Node) => {
            node.moveOn(dx, dy)
          })
        }

        getNodes (): Node[] {
          this.cache = this.cache || this.nodes.filter((node: Node) => node.selected)
          return this.cache as Node[]
        }

        protected onBrushStartMove (): void {
          this.$emit('selectionStart')
        }

        protected onBrushEnd (event: MouseEvent, area: Area): void {
          const transformedArea = [
            this.transform(area[0]),
            this.transform(area[1])
          ] as Area

          const nodes = Selection.getSelectedFromArea<Node | Link>(this.nodes, transformedArea)
          const links = Selection.getSelectedFromArea<Node | Link>(this.links, transformedArea)

          this.$emit('selection', event, nodes.concat(links))
        }

        protected setSelected (data: GraphEntities | GraphEntities[], state: boolean): void {
          if (data instanceof Array) {
            data.forEach((item: GraphEntities) => {
              item.selected = state
            })
            return
          }

          data.selected = state
        }

        protected static getSelectedFromArea<T extends GraphEntities> (arr: T[], area: Area): T[] {
          return arr.filter((GraphEntities: T) => {
            const rect = GraphEntities.getRect()
            return Rect.isInArea(rect, area)
          })
        }
}
</script>

<style lang="less" scoped>
    .graph__selection_disabled {
        display: none;
    }
</style>
