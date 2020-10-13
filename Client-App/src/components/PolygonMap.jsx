import React, { Component, createRef } from "react";
import { Map, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import {
  getPointData,
  getVehicles,
  calculateFuelConsumption,
} from "../services/pointServices";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";
var dateFormat = require("dateformat");

class PolygonExample extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: 43.32472,
      lon: 21.90333,
      zoom: 13,
      positions: [],
      vehicles: null,
      selectedVehicle: null,
      selectDatetime: { From: new Date(2008, 0, 1), To: new Date() },
      precision: 10,
      calculation: null,
    };
  }

  mapRef = createRef();
  refPolyline = createRef();

  render() {
    const calculatebtnDisabled = this.state.positions.length < 2 ? true : false;
    const { selectDatetime, precision } = this.state;
    return (
      <div className="row">
        <div className="col-6">
          <Map
            center={[this.state.lat, this.state.lon]}
            onClick={this.addPosition}
            zoom={this.state.zoom}
            ref={this.mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            {this.renderPlygone()}
          </Map>
        </div>
        <div className="col-3">
          <ul style={{ maxHeight: "85vh", overflow: "auto" }}>
            {this.renderListPoints()}
          </ul>
        </div>
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="selectVehicle">Select vehicle</label>
            <Select
              id="selectVehicle"
              onChange={this.handleSelectChange}
              options={this.state.vehicles}
            />
          </div>
          <div className="form-group">
            <label htmlFor="selectFrom">Date from</label>
            <DateTimePicker
              id="selectFrom"
              onChange={this.handleDatatimePickerFromChange}
              format="dd.MM.yyyy hh:mm"
              value={selectDatetime.From}
            />
          </div>
          <div className="form-group">
            <label htmlFor="selectTo">Date to</label>
            <DateTimePicker
              id="selectTo"
              onChange={this.handleDatatimePickerToChange}
              value={selectDatetime.To}
            />
          </div>
          <div className="form-group">
            <label htmlFor="precision">Precision</label>
            <input
              id="precision"
              type="number"
              onChange={this.handlePrecisionChange}
              value={precision}
            />
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary float-left"
              onClick={() => this.removeLastPostion()}
            >
              Undo last line
            </button>
            <button
              disabled={calculatebtnDisabled}
              className="btn btn-secondary float-right"
              onClick={() => this.calculate()}
            >
              Calculate
            </button>
          </div>
          {this.renderResult()}
        </div>
      </div>
    );
  }

  async componentDidMount() {
    var data = await getVehicles();
    this.setState({ vehicles: data });
  }

  /* #region Render region */

  renderPlygone = () => {
    const { positions } = this.state;
    if (positions.length > 1)
      return positions.map((point, i) => {
        if (i > 0) {
          return (
            <Polyline
              key={i}
              positions={[positions[i - 1], point]}
              color="blue"
            />
          );
        }
      });
  };

  renderListPoints = () => {
    const { positions } = this.state;
    if (positions.length < 1)
      return <li className="list-group-item">Points does not exists.</li>;
    else {
      return positions.map((point, i) => {
        if (i == positions.length - 1)
          return (
            <li key={i} className="list-group-item active">
              Lot: {point[0]} Lan: {point[1]}
            </li>
          );
        else
          return (
            <li key={i} className="list-group-item">
              Lot: {point[0]} Lan: {point[1]}
            </li>
          );
      });
    }
  };

  renderResult = () => {
    const { calculation } = this.state;
    if (calculation != null) {
      return (
        <div className="form-group">
          <label> Average fuel consumption is</label>
          <h3>{calculation} l/km</h3>
        </div>
      );
    }
  };

  /* #endregion */

  /* #region Event hander regon */

  addPosition = (e) => {
    const newPos = [e.latlng.lat, e.latlng.lng];
    this.setState((prevState) => ({
      positions: prevState.positions.concat([newPos]),
    }));
  };

  removeLastPostion = () => {
    let { positions } = this.state;
    positions.pop();
    this.setState({ positions });
  };

  handleSelectChange = (selectedOption) => {
    this.setState({ selectedVehicle: selectedOption });
  };

  handleDatatimePickerFromChange = (value) => {
    let { selectDatetime } = this.state;
    selectDatetime.From = value;
    this.setState({ selectDatetime });
  };

  handleDatatimePickerToChange = (value) => {
    let { selectDatetime } = this.state;
    selectDatetime.To = value;
    this.setState({ selectDatetime });
  };

  handlePrecisionChange = (e) => {
    let { precision } = this.state;
    precision = parseInt(e.target.value);
    if (precision > 1) this.setState({ precision });
    else this.setState({ precision: 1 });
  };
  /* #endregion */

  /* #region  Request calls */

  calculate = async () => {
    const { positions } = this.state;
    const pointsObj = positions.map((point) => {
      return { Lat: point[0], Lon: point[1] };
    });
    const FuelConsumption = await calculateFuelConsumption(pointsObj);
    console.log(FuelConsumption);
    this.setState({ calculation: FuelConsumption });
  };

  /* #endregion */
}

export default PolygonExample;
