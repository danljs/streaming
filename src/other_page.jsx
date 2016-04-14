// libs
import React from 'react';
import {Link} from 'react-router'
// inits
class OtherPage extends React.Component{
    constructor(props) {
        super(props)
    }

    componentDidMount(){
    }

	render(){
        return <div>
        <Link to='/d3'>Return</Link>
        </div>
    }
}
export default OtherPage
