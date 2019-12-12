import React from 'react';
import LocationSearch from './LocationSearch';
import { Icon } from 'semantic-ui-react';

function Header() {
    return (
        <div style={{
            position: 'fixed',
            height: 70,
            zIndex: 999,
            width: '100%',
            minWidth: 840,
            fontSize: 18,
            background: '#198f35',
            color: 'white'
        }}>
            <div style={{ padding: 10, paddingLeft: 20 }}>
                <div style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                    <Icon name="paw" />
                    <span style={{ fontFamily: 'Luckiest Guy', marginLeft: 5, marginRight: 30 }}>PET MAPS</span>
                </div>
                <LocationSearch />
            </div>
        </div>
    )
}

export default Header;