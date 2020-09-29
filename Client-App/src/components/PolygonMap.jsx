import React, { Component, createRef } from "react";
import { Map, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import {
  getPointData,
  calculateFuelConsumption,
} from "../services/pointServices";

class PolygonExample extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: 43.32472,
      lon: 21.90333,
      zoom: 13,
      positions: [],
      calculation: null,
    };
  }

  mapRef = createRef();
  refPolyline = createRef();

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

  render() {
    const calculatebtnDisabled = this.state.positions.length < 2 ? true : false;
    return (
      <div className="row">
        <div className="col-10">
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
        <div className="col-2">
          <ul>{this.renderListPoints()}</ul>
          <div>
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
        </div>
      </div>
    );
  }

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

  calculate = async () => {
    const { positions } = this.state;
    const pointsObj = positions.map((point) => {
      return { Lat: point[0], Lon: point[1] };
    });
    const FuelConsumption = await calculateFuelConsumption(pointsObj);
    console.log(FuelConsumption);
  };

  /*
  async componentDidMount() {
    var data = await getPointData(200);
    this.setState({ positions: data });
    console.log(data);
  }
  */
}

export default PolygonExample;
