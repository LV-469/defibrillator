import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { GeoJSONLayer } from 'react-mapbox-gl';
import PropTypes from 'prop-types';
import Map from './Map';
import SYMBOL_LAYOUT from './symbolLayout';
import geoJsonData from './geoJsonData';
import { defsFilterSelector } from '../../reducers/defReducer';
import { setMap } from '../../actions/map';
import { sidebarWidth } from '../Sidebar/styleConstants';

const useStyles = makeStyles({
  mapOuterStyle: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    width: `calc(100vw - ${sidebarWidth})`
  }
});

const MapHolder = ({
  filteredDefs,
  mapState,
  setMapCenterParams
}) => {
  const classes = useStyles();

  const [map, setLocalMap] = useState(null);
  const loadMap = mapRaw => {
    if (mapRaw) {
      setLocalMap(mapRaw);
    }
  };

  const GEO_JSON_DATA = geoJsonData(filteredDefs);
  const { lng, lat, zoom } = mapState;

  const symbolClick = event => {
    const { lngLat } = event;
    const curZoom = map.getZoom();
    setMapCenterParams({
      lng: lngLat.lng,
      lat: lngLat.lat,
      zoom: curZoom
    });
  };

  const mouseEnter = () => {
    map.getCanvas().style.cursor = 'pointer';
  };

  const mouseLeave = () => {
    map.getCanvas().style.cursor = '';
  };

  return (
    <Map
      // eslint-disable-next-line react/style-prop-object
      style="mapbox://styles/oskovbasiuk/ck5nwya36638v1ilpmwxlfv5g"
      className={classes.mapOuterStyle}
      center={[lng, lat]}
      zoom={[zoom]}
      onStyleLoad={rawMap => {
        if (rawMap) {
          loadMap(rawMap);
        }
      }}
    >
      <GeoJSONLayer
        data={GEO_JSON_DATA}
        symbolLayout={SYMBOL_LAYOUT}
        symbolOnClick={symbolClick}
        symbolOnMouseEnter={mouseEnter}
        symbolOnMouseLeave={mouseLeave}
      />
    </Map>
  );
};
MapHolder.defaultProps = {
  mapState: {},
  filteredDefs: [],
  setMapCenterParams: () => null
};

MapHolder.propTypes = {
  mapState: PropTypes.shape({
    lng: PropTypes.number,
    lat: PropTypes.number,
    zoom: PropTypes.number
  }),
  filteredDefs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      address: PropTypes.string,
      location: PropTypes.shape({
        type: PropTypes.string,
        coordinates: PropTypes.arrayOf(PropTypes.number)
      }),
      actual_date: PropTypes.string,
      floor: PropTypes.number,
      storage_place: PropTypes.string,
      accessibility: PropTypes.string,
      language: PropTypes.string,
      informational_plates: PropTypes.string,
      phone: PropTypes.arrayOf(PropTypes.string),
      additional_information: PropTypes.string
    })
  ),
  setMapCenterParams: PropTypes.func
};

export default connect(
  state => ({
    defsState: state.defs,
    filter: state.filter,
    filteredDefs: defsFilterSelector(state),
    mapState: state.map
  }),
  {
    setMapCenterParams: setMap
  }
)(MapHolder);
