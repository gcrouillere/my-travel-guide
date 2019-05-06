import React from "react";

global.React = React

// GOOGLE
global.google = {
  maps: {
    Marker:class{},
    Map:class{ setTilt(){} fitBounds(){}},
    LatLngBounds:class{},
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

// AJAX
// global.$ = {
//   ajax: (data) => {
//     return data
//   },
//   done: () => { console.log("done called") }
// }

