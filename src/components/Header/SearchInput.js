import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCenterAndUpdateMap } from '../../actions/mapActions';

class SearchInput extends Component {
    state = {
        inputValue: ''
    }
    handleButton = () => {
        this.props.setCenterAndUpdateMap(this.state.inputValue)
    }

    handleChange = (e) => {
        this.setState({
            inputValue: e.target.value
        })
    }

    handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.handleButton();
        }
    }
    render() {
        return (
            <Input type="text" style={{ margin: 'auto', width: 300 }}
                placeholder="Enter postal code or city name"
                onKeyDown={this.handleKeyDown}
                onChange={this.handleChange}
                value={this.state.inputValue} />
        )
    }
}

export default connect(state => {
    return { center: state.map.center }
}, { setCenterAndUpdateMap })(SearchInput);