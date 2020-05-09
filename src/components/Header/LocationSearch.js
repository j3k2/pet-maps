import React from 'react';
import { connect } from 'react-redux';
import { setCenterAndUpdateOption } from '../../state/map/mapActions';
import SearchInput from '../Basic/SearchInput';

function LocationSearch(props) {
    return (
        <SearchInput
            onSearch={props.setCenterAndUpdateOption}
            placeholder='Enter postal code or city name'
            width={300}
        />
    )
}


export default connect(null, { setCenterAndUpdateOption })(LocationSearch);