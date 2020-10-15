<template>
    <svg :width="width"
         :height="height"
    >
        <g
            @click="$emit('graphClick', $event)"
            @mousedown.capture="$emit('graphMouseDown', $event)"
            @contextmenu="$emit('graphContextmenu', $event)"
            cursor="move"
        >
            <rect width="100%" height="100%" fill="transparent"></rect>
            <Selection ref="selection"
                       :nodes="nodesArr"
                       :links="linksArr"
                       :transform="d3Service.transformCoordinates.bind(d3Service)"
                       :enabled="selectionEnabled"
                       :cursor="cursors.selection"
                       @selectionStart="onSelectionStart"
                       @selection="onSelection"/>
        </g>
        <g ref="zoomable">
            <g>
                <line v-for="link in linksArr"
                      :key="link.id"
                      :x1="link.source.x"
                      :x2="link.target.x"
                      :y1="link.source.y"
                      :y2="link.target.y"
                      @click="$emit('linkClick', link)"
                      @click.right.prevent="$emit('linkRightClick', link)"
                      stroke="black"
                      stroke-width="2"
                ></line>
            </g>
            <g>
                <NodeView
                    v-for="node in nodesArr"
                    :key="node.id"
                    :node="node"
                    :onDragStart="onDragStart.bind(this)"
                    :onDragMove="onDragMove.bind(this)"
                    :onDragEnd="onDragEnd.bind(this)"
                    :cursor="cursors.node"
                    @mousedown.native="$emit('nodeMouseDown', $event, node)"
                    @nodeMouseUp="$emit('nodeMouseUp', $event, node)"
                    @dblclick.native="$emit('nodeDblClick', $event, node)"
                    @click.left.native="$emit('nodeLeftClick', $event, node)"
                    @click.right.native="$emit('nodeRightClick', $event, node)"
                ></NodeView>
            </g>
        </g>
    </svg>
</template>

<script lang="ts">
    import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
    import D3Service from '@/components/d3.service';
    import ForceDirectedGraph from '@/components/ForceDirectedGraph';
    import Node from '@/components/Graph/Node';
    import Link from '@/components/Graph/Link';
    import NodeView from '@/components/Graph/NodeView.vue';
    import { GraphMode, IGraph, ISelection } from '@/components/Graph/Interfaces';
    import Selection from './Selection.vue';
    import CursorType, { IElementsCursors } from '@/components/Graph/CursorType';

    interface INodesMap {
        [id: number]: Node;
    }

    interface ILinksMap {
        [id: number]: Link;
    }

    @Component({
        components: { NodeView, Selection }
    })
    export default class Graph extends Vue implements IGraph {
        @Prop({ default: () => [] }) nodes!: Array<Node>;
        @Prop({ default: () => [] }) links!: Array<Link>;
        @Prop({ default: 800 }) width!: number;
        @Prop({ default: 600 }) height!: number;

        @Ref() readonly selection!: Selection & ISelection;
        $refs!: Vue['$refs'] & {
            selection: ISelection;
        }

        protected d3Service: D3Service = new D3Service();
        protected d3Graph!: ForceDirectedGraph<Node, Link>;
        protected uniqueId: number = 0;
        protected nodesMap: INodesMap = {};
        protected nodesArr: Array<Node> = [];
        protected linksMap: ILinksMap = {};
        protected linksArr: Array<Link> = [];
        protected selectionEnabled: boolean = true;
        protected cursors: IElementsCursors = CursorType.moving;
        protected mode: GraphMode = GraphMode.moving;

        created(): void {
            this.nodesArr = [...this.nodes];
            this.linksArr = [...this.links];

            this.d3Graph = D3Service.getForceDirectedGraph<Node, Link>(this.nodes, this.links);
        }

        mounted(): void {
            this.d3Service.setElement(this.$el);
            this.d3Service.applyZoomableBehaviour(
                this.$refs.zoomable as Element,
                this.onZoomEnd.bind(this)
            );
        }

        /**
         * Adds node by specified coordinates
         * @param x
         * @param y
         */
        addNode(x: number, y: number): Node {
            const [newX, newY] = this.d3Service.transformCoordinates(x, y);
            const node = new Node(this.uniqueId, newX, newY);
            this.nodesMap[this.uniqueId++] = node;
            this.nodesArr.push(node);
            this.d3Graph.updateNodes(this.nodesArr);
            return node;
        }

        pushNode(node: Node): void {
            this.nodesMap[node.id] = node;
            this.nodesArr.push(node);
            this.d3Graph.updateNodes(this.nodesArr);
        }

        /**
         * Removes node by it id. Also removes all node's links.
         * @param node
         */
        removeNode(node: Node): void {
            if (!this.nodesMap[node.id]) {
                return;
            }

            node.links.forEach((link: Link) => this.removeLink(link));

            delete this.nodesMap[node.id];
            this.nodesArr = this.nodesArr.filter((curNode: Node) => curNode.id !== node.id);
            this.d3Graph.updateNodes(this.nodesArr);
        }

        /**
         * Adds link by two nodes indexes - source and target.
         * @param source
         * @param target
         */
        addLink(source: Node, target: Node): Link {
            const existedLink = this.getExistedLink(source, target);

            if (existedLink) {
                this.removeLink(existedLink);
            }

            const link = new Link(this.uniqueId, target, source);

            this.linksMap[this.uniqueId++] = link;
            this.linksArr.push(link);
            source.setLink(link);
            target.setLink(link);
            this.d3Graph.updateLinks(this.linksArr);

            return link;
        }

        removeLink(link: Link): void {
            if (!this.linksMap[link.id]) {
                return;
            }

            link.clearTermination();
            delete this.linksMap[link.id];
            this.linksArr = this.linksArr.filter((curLink: Link) => curLink.id !== link.id);
        }

        pushLink(link: Link): void {
            this.linksMap[link.id] = link;
            link.source.setLink(link);
            link.target.setLink(link);
            this.linksArr.push(link);
            this.d3Graph.updateLinks(this.linksArr);
        }

        protected getExistedLink(nodeA: Node, nodeB: Node): Link | void {
            for (const sourceLink of nodeA.links) {
                if (sourceLink.source === nodeB || sourceLink.target === nodeB) {
                    return sourceLink;
                }
            }
        }

        getSelection(): ISelection {
            return this.$refs.selection;
        }

        setMode(mode: GraphMode): void {
            this.selectionEnabled = mode === GraphMode.selection;
            this.cursors = CursorType[mode];
            this.mode = mode;
        }

        protected onSelectionStart(): void {
            this.cursors = CursorType.onSelection;
        }

        protected onSelection(event: Event, data: unknown): void {
            this.$emit('selection', event, data);
            this.cursors = CursorType[this.mode];
        }

        protected onDragStart(dx: number, dy: number, active: boolean): void {
            if (!active) {
                this.d3Graph.restart();
            }

            this.$refs.selection.moveOn(dx, dy);
            this.cursors = CursorType.onDrag;
        }

        protected onDragMove(dx: number, dy: number): void {
            this.$refs.selection.moveOn(dx, dy);
        }

        protected onDragEnd(x: number, y: number, active: boolean): void {
            if (!active) {
                this.d3Graph.restart();
            }

            this.$refs.selection.moveTo(x, y);
            this.cursors = CursorType[this.mode];
        }

        protected onZoomEnd(event: MouseEvent): void {
            // d3 zoom behaviour consumes and stops mouseup events
            this.$emit('graphMouseUp', event);
        }
    }
</script>

<style scoped>

</style>