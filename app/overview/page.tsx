"use client";
import MapboxExample from '../components/MapBox';
import {useState, useEffect} from 'react';


export default function Home() {
  const [dummyItems, setDummyItems] = useState([
    { ID: "1", Name: "Blue Backpack", lat: 42.4075, long: -71.1189, found: false },
    { ID: "2", Name: "iPhone 13", lat: 42.4066, long: -71.1195, found: true },
    { ID: "3", Name: "Keys", lat: 42.4081, long: -71.1209, found: false },
  ]);

  useEffect(() => {
  const getData = async () => {
    try {
      const response = await fetch('/search');
      const result = await response.json();
      
      console.log(result);
      
      // Access the data array from the response
      const mappedItems = result.data.map((item: any) => ({
        ID: item.id.toString(),
        Name: item.name,
        lat: item.lat,
        long: item.lng,
        found: item.found === 1
      }));
      
      setDummyItems(mappedItems);
      console.log(mappedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  getData();
}, []);

  return (
    <main className="h-screen">
      <MapboxExample items={dummyItems}/>
    </main>
  );
}