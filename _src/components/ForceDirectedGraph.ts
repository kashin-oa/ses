import * as d3 from 'd3'

export type d3Node = d3.SimulationNodeDatum;
export type d3Link<Node> = d3.SimulationLinkDatum<Node>

export default class ForceDirectedGraph
    <
        Node extends d3Node = d3Node,
        Link extends d3Link<Node> = d3Link<Node>
    > {
    simulation!: d3.Simulation<Node, d3Link<Node>>;

    constructor (
        public nodes: Array<Node>,
        public links: Array<Link>
    ) {
      this.simulation = d3
        .forceSimulation(nodes)
        .force('charge', d3.forceCollide(15))
        .force('links',
          d3.forceLink(links)
            .strength(0)
        )
    }

    updateNodes (nodes: Array<Node>): void {
      this.simulation.nodes(nodes)
    }

    updateLinks (links: Array<Link>): void {
      this.simulation.force('link',
        d3.forceLink(links)
          .strength(0)
      )
    }

    restart (): void {
      this.simulation.alphaTarget(0.3).restart()
    }
}
