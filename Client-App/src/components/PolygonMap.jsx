import React, { Component, createRef } from "react";
import { Map, TileLayer, Marker, Popup, Polyline } from "react-leaflet";

class PolygonExample extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: 43.32472,
      lon: 21.90333,
      zoom: 13,
      positions: [[43.32472, 21.90333]],
      positionsCount: 1,
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
          <button
            className="btn btn-primary"
            onClick={() => this.removeLastPostion()}
          >
            Undo last line
          </button>
        </div>
      </div>
    );
  }

  renderPlygone = () => {
    const { positions } = this.state;
    if (positions.length > 1) {
      return positions.map((point, i) => {
        if (i > 0) {
          return (
            <Polyline positions={[positions[i - 1], point]} color="blue" />
          );
        }
      });
    }
  };
}

export default PolygonExample;
