// libs
import React from 'react'
import d3 from 'd3'
import Streaming from './streaming.jsx'

// inits
class StreamingTest extends React.Component{
    constructor(props) {
        super(props)
        this.state={
            interval_id : {},

            count : 100,
            init_data : [],
            new_data : [0,0,0]
        }
    }

    componentDidMount(){
        this.run()
    }
    componentWillUnmount(){
        window.clearInterval(this.state.interval_id);
    }

    random(min, max) {
        return function(){return Math.random() * (max - min) + min}
    }
    run(){
        var parent = this,
            random1 = this.random(0, .2),
            random2 = this.random(0, 1.4),
            random3 = this.random(0, .8)

        var x1 = 0
        var interval_id = setInterval(()=>{
            if (++x1 === 60) {
               window.clearInterval(interval_id);
            }
            parent.setState({
                new_data:[
                    random1(),
                    random2(),
                    random3()
                ]
            })
        },500)

        parent.setState({
            interval_id: interval_id,
            init_data:[
                d3.range(this.state.count).map(random1),
                d3.range(this.state.count).map(random2),
                d3.range(this.state.count).map(random3)
            ]
        })

    }
	render(){
        var parent = this
        return (<div className='d3-page'>
        {
            this.state.init_data.length === 0? '':
                <Streaming
                    init_data = {this.state.init_data}
                    color = {['#2200ff','#00ff00','#ffe100']}
                    new_data = {this.state.new_data}
                    count = {this.state.count}
                    lines = {3}
                ></Streaming>
        }
            <button onClick={e=>{
            parent.setState({
                new_data:[
                    parent.random(0, .2)(),
                    parent.random(0, 11.4)(),
                    parent.random(0, .8)()
                ]
            })
        }}>add data</button>
        
        </div>
    )}
}
export default StreamingTest
