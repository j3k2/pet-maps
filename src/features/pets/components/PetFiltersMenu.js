import React from 'react';
import { Form, Segment, Dropdown } from 'semantic-ui-react'
import { map, startCase } from 'lodash';

function PetFiltersMenu(props) {
    return (
        <Segment style={{
            minWidth: 441,
            background: '#198f35'
        }}>
            <Form>
                <Form.Group widths="equal" style={{ padding: 20 }}>
                    {renderPetFilters(props.petFilters, props.setActivePetFilters)}
                </Form.Group>
            </Form>
        </Segment>)
}

function renderPetFilters(filters, setActivePetFilters) {
    return map(filters, (fieldValues, fieldName) => {
        const options = map(fieldValues, (value) => {

            return {
                key: value,
                text: value,
                value: value
            }
        });
        return (
            <Form.Field key={fieldName}>
                <label style={{ color: 'white' }}>{startCase(fieldName)}</label>
                <Dropdown
                    fluid
                    multiple selection
                    placeholder={startCase(fieldName)}
                    options={options}
                    onChange={(e, d) => {
                        setActivePetFilters(d.value, fieldName);
                    }} />
            </Form.Field>

        )
    });

}

export default PetFiltersMenu;