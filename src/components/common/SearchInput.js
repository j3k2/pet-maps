import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';

class SearchInput extends Component {
    state = {
        inputValue: ''
    }

    handleButton = () => {
        this.props.onSearch(this.state.inputValue)
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
            <Input type="text" 
                style={{ width: this.props.width }}
                placeholder={this.props.placeholder}
                onKeyDown={this.handleKeyDown}
                onChange={this.handleChange}
                value={this.state.inputValue} />
        )
    }
}

export default SearchInput;