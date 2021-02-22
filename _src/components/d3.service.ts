import * as d3 from 'd3'
import ForceDirectedGraph, { d3Node, d3Link } from './ForceDirectedGraph'

type d3Selection = d3.Selection<SVGGElement, unknown, null, undefined>;

export default class D3Service {
    protected element!: d3.Selection<Element, unknown, null, undefined>;
    protected scale = 1;
    protected transform: [number, number] = [0, 0];

    setElement (element: Element): void {
      this.element = d3.select(element)
    }

    protected transformCoord (coord: number, transformIndex: number): number {
      return (coord - this.transform[transformIndex]) / this.scale
    }

    transformCoordinates(x: number, y: number): [number, number];
    transformCoordinates(x: [number, number], y: any): [number, number];
    transformCoordinates (x: any, y: any): any {
      if (x instanceof Array) {
        return [
          this.transformCoord(x[0], 0),
          this.transformCoord(x[1], 1)
        ]
      }

      return [
        this.transformCoord(x, 0),
        this.transformCoord(y, 1)
      ]
    }

    applyZoomableBehaviour (zoomableElement: Element, onZoomEnd: Function): void {
      const zoomable = d3.select(zoomableElement)

      const zoomed = (): void => {
        zoomable.attr('transform', d3.event.transform)
        this.transform = [d3.event.transform.x, d3.event.transform.y]
        this.scale = d3.event.transform.k
      }

      const onEnd = (): void => {
        if (d3.event.sourceEvent) {
          onZoomEnd(d3.event.sourceEvent)
        }
      }

      const zoom = d3.zoom()
      // allows  panning on left or middle mouse buttons
        .filter(() => d3.event.button === 0 || d3.event.button === 1)
        .on('zoom', zoomed)
        .on('end', onEnd)

      this.element.call(zoom)
        .on('dblclick.zoom', null)
    }

    static applyBrushBehaviour (element: Element,
      isEnabled: () => boolean,
      onBrushStartMoveCallback: Function,
      onBrushEndCallback: Function): void {
      const d3Elem = d3.select(element) as unknown as d3Selection
      let moveStarted = false

      function onBrush (): void {
        if (d3.event.selection && !moveStarted) {
          onBrushStartMoveCallback()
          moveStarted = true
        }
      }

      function onBrushEnd (): void {
        if (d3.event.selection) {
          onBrushEndCallback(d3.event.sourceEvent, d3.event.selection)
          // eslint-disable-next-line
                brush.move(d3Elem, null);
          moveStarted = false
        }
      }

      const brush = d3.brush()
      // default filter disables brush when ctrl key is pressed
      // we allow selection on left mouse button only
        .filter(() => d3.event.button === 0 && isEnabled())
      // disabling brush fix size when shift key is pressed
        .keyModifiers(false)
        .on('brush', onBrush)
        .on('end', onBrushEnd)

      d3Elem
        .call(brush)
        .call((elem: d3Selection) => {
          // disable native d3 crosshair cursor on brush
          // for setting our cursor type depending on graph mode
          elem.select('rect').attr('cursor', null)
        })
    }

    static applyDraggableBehaviour (element: Element,
      onStart: Function,
      onMove: Function,
      onEnd: Function): void {
      const d3Elem = d3.select(element)

      function onDragStart (): void {
        if (onStart) {
          onStart(d3.event.dx, d3.event.dy, !!d3.event.active)
        }
      }

      function onDragMove (): void {
        if (onMove) {
          onMove(d3.event.dx, d3.event.dy, !!d3.event.active)
        }
      }

      function onDragEnd (): void {
        if (onEnd) {
          onEnd(null, null, !!d3.event.active, d3.event.sourceEvent)
        }
      }

      d3Elem.call(
        d3.drag()
          .on('start', onDragStart)
          .on('drag', onDragMove)
          .on('end', onDragEnd)
      )
    }

    static getForceDirectedGraph
        <Node extends d3Node, Link extends d3Link<Node>>
    (nodes: Array<Node>, links: Array<Link>): ForceDirectedGraph<Node, Link> {
          return new ForceDirectedGraph<Node, Link>(nodes, links)
        }
}
