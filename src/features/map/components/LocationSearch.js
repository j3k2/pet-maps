import React from 'react';
import { connect } from 'react-redux';
import { locationSearched } from '../mapActions';
import SearchInput from '../../../common/components/SearchInput';

function LocationSearch(props) {
    return (
        <SearchInput
            onSearch={props.locationSearched}
            placeholder='Enter postal code or city name'
            width={300}
        />
    )
}


export default connect(null, { locationSearched })(LocationSearch);