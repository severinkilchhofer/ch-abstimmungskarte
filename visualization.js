document.addEventListener("DOMContentLoaded", () => {
    d3.json("/cantons.json")
        .then(cantons => {
            d3.csv("/durchsetzungsinitiative.csv")
                .then(yesVotes => {

                    const width = 800;
                    const height = 800;

                    const container = d3.select('#viz');

                    const svg = container.append('svg')
                        .attr('width', width)
                        .attr('height', height);

                    const projection = d3.geoAlbers()
                        .center([0, 46.7])
                        .rotate([-9, 0, 0])
                        .parallels([40, 50])
                        .scale(12500);

                    const tooltip = container.append('div')
                        .style('opacity', 0)
                        .style('position', 'fixed')
                        .style('background', 'rgba(255, 255, 255, 0.9)')
                        .style('padding', '0.7rem')
                        .style('pointer-events', 'none')
                        .style('box-shadow', '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)');

                    const pathGenerator = d3.geoPath().projection(projection);

                    const colorScale = d3.scaleThreshold()
                        .domain([30, 35, 40, 45, 50, 55, 60, 65, 70, 100])
                        .range(['#cb2300', '#dd5934', '#ec8361', '#f7ac90', '#fcd3c1', '#c6d5ce', '#9ebcae', '#76a28f', '#4e8a71', '#1f7154']);

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
