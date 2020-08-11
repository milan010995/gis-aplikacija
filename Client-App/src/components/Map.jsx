import React, { Component } from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Point, CarPoint } from "../services/pointServices";

class MapComponent extends Component {
  state = {
    lat: 43.32472,
    lon: 21.90333,
    zoom: 13,
    points: [
      { lat: 43.327584, lon: 21.902324 },
      { lat: 43.320517, lon: 21.900239 },
    ],
  };

  render() {
    return (
      <div id="map">
        <Map center={[this.state.lat, this.state.lon]} zoom={13}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {this.state.points.map((point) => (
            <Marker key={point.lon} position={[point.lat, point.lon]}>
              <Popup>Pozicija!</Popup>
            </Marker>
          ))}
        </Map>
      </div>
    );
  }
}

export default MapComponent;
