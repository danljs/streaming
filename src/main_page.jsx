// libs
import React from 'react'
import {Link} from 'react-router'
// inits
class MainPage extends React.Component{
    constructor(props) {
        super(props)
    }

    componentDidMount(){
    }

	render(){
        var parent = this
        return <div>
            <hr/>
            <Link to='/d3'>Start</Link>&nbsp;&nbsp;&nbsp;&nbsp;
            <Link to='/other'>OtherPage</Link>
            {this.props.children}
        </div>

    }
}
export default MainPage
