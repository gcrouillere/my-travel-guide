import React from "react";

global.React = React

// GOOGLE
global.google = {
  maps: {
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
    InfoWindow: class { open(){} },
    Marker: class { addListener(){} },
    LatLngBounds: class {},
    ControlPosition: {
      LEFT_CENTER: 'LEFT_CENTER'
    },
    event: {
      addDomListener: () => {}
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

//JS raw event Listeners
global.onmousemove = {fn: () => {}}
global.onmouseup = {fn: () => {}}
