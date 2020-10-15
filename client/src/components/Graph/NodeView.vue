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
        <text :x="node.x - node.r * 0.5"
              :y="node.y + node.r * 0.5"
              pointer-events="none"
        >{{node.id}}</text>
    </g>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { Component, Prop } from 'vue-property-decorator';
    import Node from './Node';
    import D3Service from '@/components/d3.service';
    import { INodeView } from '@/components/Graph/Interfaces';
    import { IRect } from '@/components/geometry';

    @Component
    export default class NodeView extends Vue implements INodeView {
        @Prop() node!: Node;
        @Prop() onDragStart!: Function;
        @Prop() onDragMove!: Function;
        @Prop() onDragEnd!: Function;
        @Prop() cursor!: string;
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
            this.$emit('nodeMouseUp', event);
        }

        getRect(): IRect {
            // TODO: Попробовать getBBox()
            const size = this.node.r * 2;
            const x = (this.node.fx || this.node.x) - this.node.r;
            const y = (this.node.fy || this.node.y) - this.node.r;

            return {
                x, y,
                width: size,
                height: size
            };
        }
    }
</script>

<style lang="less" scoped>
    .graph__node {
        &_selected {
            stroke: #1F1AB2;
            fill: #7673D9;
        }

        &:hover {
            fill: #9392de;
        }
    }
</style>
