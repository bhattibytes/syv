/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import Link from 'next/link';
import { withRouter } from 'next/router';
import AddressSuggest from './AddressSuggest';
import AddressInput from './AddressInput';
import styles from '../../styles/Home.module.css';

let isValid = false;

class AddressForm extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();
    this.onQuery = this.onQuery.bind(this);
    this.onAddressChange = this.onAddressChange.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onClear = this.onClear.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.toDashboard = this.toDashboard.bind(this);
  }

  onQuery(evt) {
    const query = evt.target.value;

    if (!query.length > 0) {
      this.setState(this.getInitialState());
      return;
    }

    const self = this;
    axios.get('https://geocode.search.hereapi.com/v1/geocode',
      {
        params: {
          APP_ID_GEO: this.props.APP_ID_GEO,
          apiKey: this.props.APP_KEY_GEO,
          q: query,
          maxresults: 1,
        },
      }).then((response) => {
      if (response.data.items.length > 0) {
        const { id } = response.data.items[0];
        const { address } = response.data.items[0];
        self.setState({
          address,
          query,
          locationId: id,
          fullAddress: address.label,
        });
      } else {
        const state = self.getInitialState();
        self.setState(state);
      }
    });
  }

  getInitialState() {
    return {
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      query: '',
      locationId: '',
      isChecked: false,
      coords: {},
    };
  }

  onClear(evt) {
    isValid = false;
    const state = this.getInitialState();
    this.setState(state);
  }

  toDashboard(evt) {
    evt.preventDefault();
    isValid = true;
    this.props.router.push('/dashboard');
  }

  onAddressChange(evt) {
    const { id } = evt.target;
    const val = evt.target.value;

    const { state } = this;
    state.address[id] = val;
    this.setState(state);
  }

  onCheck(evt) {
    const params = {
      APP_ID_GEO: this.props.APP_ID_GEO,
      apiKey: this.props.APP_KEY_GEO,
      q: this.state.fullAddress,
    };

    if (this.state.locationId.length > 0) {
      params.locationId = this.state.locationId;
    } else {
      params.searchtext = this.state.address.street
        + this.state.address.City
        + this.state.address.State
        + this.state.address.PostalCode
        + this.state.address.Country;
    }

    const self = this;
    axios.get('https://geocode.search.hereapi.com/v1/geocode',
      {
        params: {
          APP_ID_GEO: this.props.APP_ID_GEO,
          apiKey: this.props.APP_KEY_GEO,
          q: this.state.fullAddress,
          maxresults: 1,
        },
      }).then((response) => {
      const view = response.data.items;
      if (view.length > 0 && view[0].access.length > 0) {
        const location = view[0];

        self.setState({
          isChecked: 'true',
          locationId: '',
          query: location.address.label,
          address: {
            street: `${location.address.houseNumber} ${location.address.street}`,
            city: location.address.city,
            state: location.address.state,
            postalCode: location.address.postalCode,
            country: location.address.countryName,
          },
          coords: {
            lat: location.access[0].lat,
            lon: location.access[0].lng,
          },
        });
      } else {
        self.setState({
          isChecked: true,
          coords: null,
        });
      }
    })
      .catch((error) => {
        console.log('caught failed query', error);
        self.setState({
          isChecked: true,
          coords: null,
        });
      });
  }

  async submitForm(evt) {
    const { street, city, state } = this.state.address;
    let { postalCode } = this.state.address;
    if (postalCode.includes('-')) {
      postalCode = postalCode.split('-')[0];
    }
    evt.preventDefault();
    // Save address information to database and advance user to
    // entering email address and pick password complete signup
    const address = {
      street,
      city,
      state,
      zip: postalCode,
    };
    const res = await axios({
      url: 'https://syv-theta.vercel.app/api/user',
      method: 'PUT',
      data: address,
    });
    // if updated successfully
    if (res.status === 200) {
      this.props.router.push('/dashboard');
    }
  }

  alert() {
    if (!this.state.isChecked) {
      return;
    }

    if (this.state.coords === null) {
      return (
        <div role="alert">
          <b>Invalid.</b>
          {' '}
          The address is not recognized.
          The address must be within the United States of.
        </div>
      );
    }

    const co = this.state.address;
    const pos = co.postalCode.split('-')[0];

    if (co.country === 'United States') {
      isValid = true;
      return (
        <div role="alert">
          <b>Valid Address.</b>
          {' '}
          <Confetti
            width={document.documentElement.scrollWidth}
            height={document.documentElement.scrollHeight}
          />
        </div>
      );
    }
    isValid = false;
    return (
      <div role="alert">
        <b>Invalid.</b>
        {' '}
        The address must be within the United States of.
      </div>
    );
  }

  render() {
    const result = this.alert();
    return (
      <div className="w-7/12 mx-auto p-8">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-7xl uppercase font-bold text-gray-800 text-center">Additional Info</h2>
          <p className="text-lg font-light text-gray-700 text-center italic">Please register your address with us for the full experience of SYV</p>
        </div>
        <AddressSuggest
          query={this.state.query}
          onChange={this.onQuery}
        />
        <AddressInput
          street={this.state.address.street}
          city={this.state.address.city}
          state={this.state.address.state}
          postalCode={this.state.address.postalCode}
          country={this.state.address.country}
          onChange={this.onAddressChange}
        />
        <br />
        {result || <br />}
        <button className="btn btn-purple" type="submit" onClick={this.onCheck}>Check</button>
        {' '}

        <button className="btn btn-purple" type="submit" onClick={this.onClear}>Clear</button>
        {' '}

        <button className="btn btn-purple" type="submit" onClick={this.toDashboard}>Go To Dashboard</button>
        {' '}

        {result && isValid ? <button className="btn btn-purple" type="submit" onClick={this.submitForm}>Submit</button> : null}
      </div>
    );
  }
}

export default withRouter(AddressForm);
