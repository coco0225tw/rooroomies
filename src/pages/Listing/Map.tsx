import { GoogleMap, useJsApiLoader, useLoadScript, Marker } from '@react-google-maps/api';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import GoogleMapKey from '../../key';
function Map() {
  let map: google.maps.Map;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GoogleMapKey,
  });
  const mapStyles = {
    height: '50vh',
    width: '100%',
  };

  const chineseAddr = '台灣台北市信義區吳興街220巷73弄5號';
  const getGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${chineseAddr}&key=${GoogleMapKey}`;
  const keyword = '餐廳';
  const radius = 1000;
  const LatLng = { lat: 25.026221, lng: 121.560623 };
  const getRestaurantUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${LatLng.lat},${LatLng.lng}&radius=${radius}&keyword=${keyword}&language=zh-TW&key=${GoogleMapKey}`;
  const [allRestaurants, setAllRestaurants] = useState<{ lat: number; lng: number }[]>();
  const addrs = useMemo(() => ({ lat: 25.026221, lng: 121.560623 }), []);
  type YourType = { geometry: { location: { lat: number; lng: number } } };
  const addrsRef = useRef<{ lat: number; lng: number }>();
  const [addrState, setAddrState] = useState();
  useEffect(() => {
    async function getGeocode() {
      await fetch(getGeocodeUrl).then((res) => {
        res.json().then((data) => {
          // const coordinates = new google.maps.LatLng({
          //   lat: data.results[0].geometry.location.lat as number,
          //   lng: data.results[0].geometry.location.lng as number,
          // });
          //   setAddrState(coordinates);
        });
      });
    }
    getGeocode();

    async function getRestaurant() {
      await fetch(getRestaurantUrl).then((res) => {
        res.json().then((data) => {
          const coordinates = new google.maps.LatLng({
            lat: data.results[0].geometry.location.lat as number,
            lng: data.results[0].geometry.location.lng as number,
          });
          console.log(data);
          //   setAddrState(coordinates);
        });
      });
    }
    // getRestaurant();
  }, []);
  return (
    <>
      {isLoaded && (
        <GoogleMap mapContainerStyle={mapStyles} zoom={14} center={addrs}>
          <Marker position={addrs}></Marker>
        </GoogleMap>
      )}
    </>
  );
}
export default Map;