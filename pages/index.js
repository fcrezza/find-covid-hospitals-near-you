import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import swal from '@sweetalert/with-react';
import opencage from 'opencage-api-client';
import {getDistance, convertDistance} from 'geolib';

// this should be implemented
// import getHospitals from '../utils/getHospitals';
import Alert from '../components/Alert';
// this import for development only
import hospitals from '../utils/saved-hospitals.json';
const Map = dynamic(() => import('../features/Map/Map'), {
  ssr: false
});

export default function Home() {
  const [currentPosition, setCurrentPosition] = React.useState(null);
  /**
   * distance in km value.
   * distance can be changed from user input.
   * default distance is 50km.
   */
  const [distance, setDistance] = React.useState(50);
  let filteredHospitals;

  // implement divide and conquer algorithm in here.
  if (currentPosition) {
    filteredHospitals = hospitals.filter(hospital => {
      // if (hospital.isHospital) {
      if (hospital.geolocation) {
        const distanceFromCurrentLocation = convertDistance(
          getDistance(currentPosition.geolocation, hospital.geolocation, 0.01),
          'km'
        );
        return distanceFromCurrentLocation <= distance;
      }
      // }
    });
  } else {
    filteredHospitals = hospitals;
  }

  const onChangeDistance = e => {
    setDistance(e.target.value);
  };

  const coordinateCollection = filteredHospitals
    .map(hospital => hospital.isHospital && Object.values(hospital.geolocation))
    .filter(Boolean);
  const bounds = currentPosition && [
    Object.values(currentPosition.geolocation),
    ...coordinateCollection
  ];

  const showAlert = ({title, text}) => {
    return new Promise(resolve => {
      swal({
        button: 'Ya, saya mengerti',
        content: <Alert title={title} text={text} />
      }).then(resolve);
    });
  };

  const error = () => {
    showAlert({
      title: 'LOKASI TIDAK TERJANGKAU',
      text:
        'Kami tidak dapat bisa menjangkau lokasi anda saat ini, pastikan anda telah mengeklik "Izinkan/Allow" untuk kami dapat mengakses lokasi anda saat ini.'
    });
  };

  const success = position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    opencage
      .geocode({
        q: `${latitude}, ${longitude}`,
        no_annotations: 1,
        language: 'id',
        countryCode: 'id',
        limit: 1,
        key: process.env.NEXT_PUBLIC_OCD_API_KEY
      })
      .then(res => {
        setCurrentPosition({
          name: res.results[0].formatted,
          province: res.results[0].components.state,
          geolocation: {latitude, longitude}
        });
      }, error);
  };

  const getCurrentPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      showAlert({
        title: 'FITUR TIDAK DIDUKUNG',
        text:
          'Fitur geolocation tidak didukung oleh browser anda, coba buka aplikasi menggunakan browser versi terbaru atau tetap lanjutkan menggunakan aplikasi dengan mencari rumah sakit rujukan melalui kolom pencarian'
      });
    }
    localStorage.setItem('isVisited', '1');
  };

  React.useEffect(() => {
    const isVisited = Boolean(localStorage.getItem('isVisited'));

    const init = async () => {
      if (!isVisited) {
        await showAlert({
          title: 'PERHATIAN',
          text:
            'Aplikasi ini membutuhkan akses lokasi anda untuk menentukan rumah sakit rujukan yang dekat dengan lokasi anda, tekan "Izinkan/Allow" jika ingin langsung mengetahui lokasi rumah sakit rujukan yang berada didekat anda. Anda juga bisa mengubah radius jangkauan, dan melakukan pencarian rumah sakit rujukan melalui kolom pencarian.'
        });
      }
      getCurrentPosition();
    };

    init();
  }, []);

  return (
    <div>
      <Head>
        <title>FIND COVID-19 HOSPITALS NEAR YOU</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map
        data={filteredHospitals}
        currentPosition={currentPosition}
        bounds={bounds}
        distance={distance}
        onChangeDistance={onChangeDistance}
      />
    </div>
  );
}

// export async function getStaticProps() {
//   const hospitals = await getHospitals();
//   return {
//     props: {
//       hospitals
//     }
//   };
// }
