<script lang="ts">
    import { CreateElement, RenderContext, VNode } from 'vue';

    // function onClick(event: unknown): void {
    //     console.log(event);
    // }

    export default {
        functional: true,
        render(createElement: CreateElement, ctx: RenderContext<any>): VNode {
            // const child = ctx.children[0];
            // if (child.data) {
            //     child.data.on = ctx.listeners;
            // }
            return createElement(
                'div',
                ctx.children
            );
        }
    }
</script>
