import axios, { all } from "axios";
import { useEffect, useState, useRef } from "react";
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

 
// =pk.eyJ1IjoidGltLWsiLCJhIjoiY2w2amM5dmhjMGthZTNkczIxM3VxcnJudSJ9.cnTV2rDMOu02waoEdaXldA
mapboxgl.accessToken = 'pk.eyJ1IjoidGltLWsiLCJhIjoiY2w2amM5dmhjMGthZTNkczIxM3VxcnJudSJ9.cnTV2rDMOu02waoEdaXldA';
 

const Home = () =>{

    const [user, setUser] = useState(null);
    const [lng, setLng] = useState(79.4);
const [lat, setLat] = useState(40);
const [zoom, setZoom] = useState(15);


    const mapContainer = useRef(null);
const map = useRef(null);

let allUser = []

 

    

    useEffect(()=>{

        let templat, templng;

        async function fetchData(){
          
            const response = await axios.post('/');
            
            const data = await response.data;
            
           
            setUser(()=>data.name);

            


            const rs = await axios.post('http://localhost:5000/database');
            const dt = await rs.data;
           
            allUser = []
            for(let d of dt)
            {
                if(d._id!==data._id)
                {
                    allUser.push(d.geometry.coordinates);
                }
            }
            console.log('allUsers',allUser);

            const fetchIP = await axios.post('http://localhost:5000/ip');
            const ipdata = await fetchIP.data;
            console.log("****",ipdata);
             setLat(() =>ipdata[1][0]);
            setLng(()=>ipdata[1][1]);
           
        }
        fetchData();

      

        let render = [];
        allUser.map(c=>
        {
            {
            console.log('heyyyyyy')
            render.push({
                'type': 'Feature',
            'properties': {
            'description':
            '<strong>Make it Mount Pleasant</strong><p>Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>'
            },
            'geometry': {
            'type': 'Point',
            'coordinates': [c[1], c[0]]
            }

            })
        }
        })
        console.log('render',render);

        
        const map = new mapboxgl.Map({
            container: 'map',
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: 16
            });
             
            map.on('load', () => {
            map.addSource('places',
            {
            'type': 'geojson',
            'data': {
            'type': 'FeatureCollection',

           
            'features': 
            [
               
                {
                

                    'type': 'Feature',
                    'properties': {
                    'description':
                    '<strong>Me</strong><p></p>'
                    },
                    'geometry': {
                    'type': 'Point',
                    'coordinates':  [lng,lat]
                    }
                    },
            {
                

            'type': 'Feature',
            'properties': {
            'description':
            '<strong>Patient 1</strong><a href="/connect">Connect Now</a>'
            },
            'geometry': {
            'type': 'Point',
            'coordinates': [77.0661, 28.7190]
            }
            },
            {
                

                'type': 'Feature',
                'properties': {
                'description':
                '<strong>Patient 2</strong><a href="/connect">Connect Now</a>'
                },
                'geometry': {
                'type': 'Point',
                'coordinates': [77.0659, 28.7192]
                }
                }
            ]
            }
            });
        new mapboxgl.Marker().setLngLat([77.0661,28.7197]).addTo(map.current)

            // Add a layer showing the places.
            map.addLayer({
            'id': 'places',
            'type': 'circle',
            'source': 'places',
            'paint': {
            'circle-color': '#4264fb',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
            }
            });
             
            // Create a popup, but don't add it to the map yet.
            const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
            });
             
            map.on('mouseenter', 'places', (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';
             
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;
             
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
             
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(description).addTo(map);
            });
             
            map.on('mouseleave', 'places', () => {
            map.getCanvas().style.cursor = '';
            // popup.remove();
            });
            });
        
    //     map.current = new mapboxgl.Map({
    //     // container: mapContainer.current,
    //     container: 'map',
    //     style: 'mapbox://styles/mapbox/streets-v11',
    //     center: [lng, lat],
    //     zoom: zoom
    //     });

    //     new mapboxgl.Marker().setLngLat([lng,lat]).addTo(map.current)
    //     .setPopup(
    //         new mapboxgl.Popup({ offset: 25 }) // add popups
    //           .setHTML(
    //             `<p>your current location</p>`
    //           )
    //       )

    //   for(let e of allUser)
    //     {
    //         new mapboxgl.Marker().setLngLat([e[1],e[0]]).addTo(map.current)
    //     }
    

        
      
    //     map.current.on('loads', () => {

            
    //     setLng(lng);
    //     setLat(lat);
    //     setZoom(map.current.getZoom().toFixed(2));
    //     });
       
        
       
    },[lat,lng])


    const logoutHandler = async() =>{
        const result = await(await axios.post('/logout')).data;
      
        
        if(result)
        {
            console.log('logged out');
            window.location.href='/';
        }
    }

    return (
        <div>
           
          <div id="map" ref={mapContainer} className="map-container" style={{'width':'100vw', 'height':'100vh'}}></div>
          <div>
                Welcome : {user}
            </div>
            <button onClick={logoutHandler}>Log Out</button>
        </div>
    )
}

export default Home;