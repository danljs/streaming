
import React from 'react'
import d3 from 'd3'
//https://bost.ocks.org/mike/path/

class StreamingTwo extends React.Component{
    constructor(props) {
        super(props)
        this.state={
            data: [],
            data_buffer: [],
            max_data: 1
        }
    }

    componentWillMount(){
        var buffer = [];
        for(var i = 0 ; i < this.props.lines ; i++){
            buffer.push([]);
            buffer[i][0] = this.props.new_data[i];
        }

        this.setState({
            data: this.props.init_data,
            data_buffer : buffer
        });
    }
    
    componentWillUnmount(){
        this.refs.d3_flag.value = '0';
    }

    componentWillReceiveProps(nextProps){
        var buffer = this.state.data_buffer;
        for(var i = 0 ; i < this.props.lines ; i++){
            buffer[i].push(nextProps.new_data[i])    
        }

        this.setState({
            data_buffer : buffer
        });
    }

    componentDidMount(){
        var parent = this;
        var margin = 50,
        width = parseInt(d3.select("#graph").style("width")) - margin*2,
        height = parseInt(d3.select("#graph").style("height")) - margin*2;

        var n = 100,
            duration = 750,
            now = new Date(Date.now() - duration),
            count = 0;

        // var xScale = d3
        //     .scale.linear()
        //     .domain([0, parent.props.count - 1]);

        var xScale = d3.time.scale()
            .domain([now - (n - 2) * duration, now - duration])
            .range([0, width]);

        var yScale = d3
            .scale.linear()
            .domain([0, parent.state.max_data]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        xScale.axis = xAxis;

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d, i) { return xScale(now - (n - 1 - i) * duration); })
            .y(function(d, i) { return yScale(d); });

        var graph = d3.select("#graph")
            .attr("width", width + margin * 2)
            .attr("height", height + margin * 2)
            .append("g")
            .attr("transform", "translate(" + margin + "," + margin + ")");

        xScale.domain([0, parent.props.count - 1]);
        yScale.domain([0, parent.state.max_data]);

        graph.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        graph.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Value");

        graph.append('defs').append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', width - 10)
            .attr('height', height);

        var path = [];
        for(var i = 0 ; i < this.props.lines ; i++){
            path.push(
                graph
                .append('g')
                .attr('clip-path', 'url(#clip)')
                .append("path")
                .datum(parent.state.data[i])
                .attr("class", "line")
                .style('stroke', parent.props.color[i])
                .attr("d", line)
            );
        }

        function resize() {
            var width = parseInt(d3.select("#graph").style("width")) - margin*2,
                height = parseInt(d3.select("#graph").style("height")) - margin*2;
            width = width < 0 ? 0 : width;
            height = height < 0 ? 0 : height;

            xScale.range([0, width]).nice();
            yScale.range([height, 0]).nice();

            graph.select('.x.axis')
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            graph.select('.y.axis')
                .call(yAxis);
            graph.select('defs clipPath rect')
                .attr('width', width -10)
                .attr('height', height);
        }

        d3.select(window).on('resize', resize); 

        resize();

        path.map((p,i)=>{
            tick();
            function tick(){
                if(!!!parent.refs.d3_flag || parent.refs.d3_flag.value==='0'){return}
                var buffer = parent.state.data_buffer;

                var new_data = buffer[i].length===1?buffer[i][0]:buffer[i].shift();
                new_data = !!!new_data?parent.state.data[i][parent.state.data[i].length-1]:new_data;
                
                parent.setState({
                    data_buffer:buffer
                });
                parent.state.data[i].push(new_data);

                var max = Math.max(...parent.state.data[i]) * 1.2;
                if(max > parent.state.max_data){
                    yScale.domain([0,max]).range([height, 0]);
                    yAxis.scale(yScale);
                    graph.select('.y.axis').call(yAxis);

                    xAxis.scale(xScale);
                    graph.select('.x.axis').call(xAxis);

                    parent.setState({max_data:max});
                    resize();
                }

                now = new Date(),
                xScale.domain([now - (n - 2) * duration, now - duration]);
                xScale.axis = xAxis;

                p.attr('d', line)
                .attr('transform', null)
                .transition()
                .duration(500)
                .ease('linear')
                .attr('transform', 'translate(' + xScale(now - (n - 1) * duration) + ',0)')
                .each('end', tick);

                parent.state.data[i].shift();
            }
        });
    }

	render(){
        return (
            <div>
                <svg id='graph'/>
                <input type='hidden' ref='d3_flag' defaultValue='1'></input>
            </div>
    )}
}
export default StreamingTwo

StreamingTwo.propTypes = {
    lines: React.PropTypes.number.isRequired,
    count: React.PropTypes.number.isRequired,
    new_data: React.PropTypes.array,
    init_data: React.PropTypes.array.isRequired,
    color: React.PropTypes.array
}

StreamingTwo.defaultProps = {
    lines: 2,
    count: 100,
    new_data: [],
    init_data: [],
    color: ['#000','#000','#000']
}
