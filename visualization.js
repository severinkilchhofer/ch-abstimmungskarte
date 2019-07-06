document.addEventListener("DOMContentLoaded", () => {
    d3.json("/cantons.json")
        .then(cantons => {
            d3.csv("/referendum.csv")
                .then(yesVotes => {

                    console.log('yesVotes', yesVotes);
                    const width = 800;
                    const height = 800;

                    const container = d3.select('#viz');

                    const svg = container.append('svg')
                        .attr('width', width)
                        .attr('height', height)
                        .style('border', '2px dashed black')

                    const projection = d3.geoAlbers()
                        .center([0, 46.7])
                        .rotate([-9, 0, 0])
                        .parallels([40, 50])
                        .scale(12500);

                    const pathGenerator = d3.geoPath().projection(projection);

                    // TODO: use other color range
                    // https://gka.github.io/palettes/#/10|d|fe2b3a,ffffff|ffffff,5cb24a|1|1

                    const colorScale = d3.scaleThreshold()
                        .domain([30,35,40,45,50,55,60,65,70,100])
                        .range(["#d0001b", "#e0513c", "#ee7e5f", "#f7a684", "#fdceaa", "#d0e0af", "#a6c185", "#7da35b", "#538633", "#256900"]);

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
                })
        })
});
