import React from 'react';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import {
  // setActivePetFilters,
  petsRequested
} from '../petsActions';
import { Loader, Segment } from 'semantic-ui-react'
import PetCardsGroup from './PetCardsGroup';
// import PetFiltersMenu from './PetFiltersMenu';

class PetsContainer extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', debounce(() => {
      if (this.props.pets &&
        !this.props.loading &&
        this.props.currentPage < this.props.totalPages &&
        document.documentElement.scrollTop + document.body.clientHeight === document.getElementById('root').clientHeight) {
        this.props.petsRequested(this.props.currentPage);
      }
    }, 500));
  }

  render() {
    return (
      <div>
        <div style={{ padding: 20 }}>
          {/* <PetFiltersMenu petFilters={this.props.petFilters} setActivePetFilters={this.props.setActivePetFilters} /> */}
          <PetCardsGroup pets={this.props.pets}
          // activePetFilters={this.props.activePetFilters}
          />
        </div>
        {this.props.loading && <Loader active inline='centered'>Loading Pets</Loader>}
        {!this.props.loading && this.props.pets && this.props.pets.length === 0 &&
          <Segment>No pets found for the selected shelters.</Segment>
        }
      </div>
    )
  }
}

export default connect(state => {
  return {
    currentPage: state.pets.pagination ? state.pets.pagination.current_page : 0,
    totalPages: state.pets.pagination ? state.pets.pagination.total_pages : 0,
    pets: state.pets.items,
    loading: state.pets.loading,
    // petFilters: state.pets.petFilters,
    // activePetFilters: state.pets.activePetFilters
  }
}, {
  // setActivePetFilters,
  petsRequested
})(PetsContainer);