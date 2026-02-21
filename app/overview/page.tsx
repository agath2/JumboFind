import MapboxExample from '../components/MapBox';

const dummyItems = [
  { ID: "1", Name: "Blue Backpack", lat: 42.4075, long: -71.1189, found: false },
  { ID: "2", Name: "iPhone 13", lat: 42.4066, long: -71.1195, found: true },
  { ID: "3", Name: "Keys", lat: 42.4081, long: -71.1209, found: false },
];

export default function Home() {
  return (
    <main className="h-screen">
      <MapboxExample items={dummyItems}/>
    </main>
  );
}