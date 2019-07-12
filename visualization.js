document.addEventListener("DOMContentLoaded", () => {
    d3.json("/cantons.json")
        .then(cantons => {
            d3.csv("/durchsetzungsinitiative.csv")
                .then(yesVotes => {

                    const width = 800;
                    const height = 800;

                    const svgContainer = d3.select('#viz');

                    const svg = svgContainer.append('svg')
                        .attr('width', width)
                        .attr('height', height);

                    const projection = d3.geoAlbers()
                        .center([0, 46.7])
                        .rotate([-9, 0, 0])
                        .parallels([40, 50])
                        .scale(12500);

                    const tooltip = svgContainer.append('div')
                        .style('opacity', 0)
                        .style('position', 'fixed')
                        .style('background', 'rgba(255, 255, 255, 0.9)')
                        .style('padding', '0.7rem')
                        .style('pointer-events', 'none')
                        .style('box-shadow', '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)');

                    const pathGenerator = d3.geoPath().projection(projection);

                    const colorScale = d3.scaleThreshold()
                        .domain([30, 35, 40, 45, 50, 55, 60, 65, 70, 100])
                        .range(['#e50000', '#f35535', '#fd8362', '#ffae93', '#ffd5c3', '#c3d1c3', '#98b398', '#6e966f', '#437948', '#0f5d23']);

                    const switzerland = svg.selectAll("path")
                        .data(cantons.features)
                        .enter()
                        .append("path")
                        .attr("d", d => pathGenerator(d))
                        .attr("stroke", "white")
                        .attr('fill', function (d) {
                            const yes = yesVotes.find(yesVote => yesVote.id == d.properties.id);
                            return colorScale(yes.ja_anteil);
                        })
                        .on('mouseenter', function (d) {
                            tooltip
                                .style('opacity', 1)
                                .html(function () {
                                    const yes = yesVotes.find(yesVote => yesVote.id == d.properties.id);
                                    return "<b>" + d.properties.name + "</b>" + "<br/>" + "Ja-Stimmenanteil&nbsp;in&nbsp;%&nbsp;" + yes.ja_anteil
                                })
                        })
                        .on('mousemove', function () {
                            tooltip
                                .style('left', d3.event.pageX + 'px')
                                .style('top', d3.event.pageY + 'px')
                        })
                        .on('mouseleave', function () {
                            tooltip
                                .style('opacity', 0)
                        })
                })
        })
});
