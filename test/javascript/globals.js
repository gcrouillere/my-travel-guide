import React from "react";

global.React = React

// GOOGLE
global.google = {
  maps: {
    geometry: {
      spherical: {
        computeLength() {}
      }
    },
    Marker: class {},
    Map: class {
      setTilt() {}
      fitBounds(){}
      addListener(){}
      getZoom(){ return 1 }
      getCenter() {return this}
      lat() {return 36.7917802}
      lng() {return 3.0445432}
    },
    Size: class {},
    Point: class {},
    InfoWindow: class { open(){} },
    Marker: class { addListener(){} },
    Polyline: class {
      constructor() { this.list = [] }
      getPath() { return this }
      getLength() { return this.list.length + 2}
      push(x) { this.list.push(x) }
      addListener() {}
    },
    LatLngBounds: class {},
    ControlPosition: {
      LEFT_CENTER: 'LEFT_CENTER'
    },
    event: {
      addDomListener: () => {},
      clearListeners: () => {}
    },
    places: {
      Autocomplete: class {
        addListener(){} getPlace(){return {}}
      },
      addListener: () => {},
      getPlace: () => {},
      AutocompleteService: () => {},
      PlacesServiceStatus: {
        INVALID_REQUEST: 'INVALID_REQUEST',
        NOT_FOUND: 'NOT_FOUND',
        OK: 'OK',
        OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
        REQUEST_DENIED: 'REQUEST_DENIED',
        UNKNOWN_ERROR: 'UNKNOWN_ERROR',
        ZERO_RESULTS: 'ZERO_RESULTS',
      },
    },
    Geocoder: () => {},
    GeocoderStatus: {
      ERROR: 'ERROR',
      INVALID_REQUEST: 'INVALID_REQUEST',
      OK: 'OK',
      OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
      REQUEST_DENIED: 'REQUEST_DENIED',
      UNKNOWN_ERROR: 'UNKNOWN_ERROR',
      ZERO_RESULTS: 'ZERO_RESULTS',
    },
  },
};

// FORM DATA
class FormData {
  append(key, value) { this[key] = value };
}
global.FormData = FormData

//Raw event Listeners
global.onmousemove = {fn: () => {}}
global.onmouseup = {fn: () => {}}

// DataTransfer
class DataTransfer {
  constructor() {
    this.data = { dragX: "", dragY: "" };
    this.dropEffect = "none";
    this.effectAllowed = "all";
    this.files = [];
    this.img = "";
    this.items = [];
    this.types = [];
    this.xOffset = 0;
    this.yOffset = 0;
  }
  clearData() {
    this.data = {};
  }
  getData(format) {
    return this.data[format];
  }
  setData(format, data) {
    this.data[format] = data;
  }
  setDragImage(img, xOffset, yOffset) {
    this.img = img;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
  }
}

global.DataTransfer = DataTransfer
