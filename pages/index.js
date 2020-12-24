import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import swal from '@sweetalert/with-react';
import opencage from 'opencage-api-client';

// this should be implemented
// import getHospitals from '../utils/getHospitals';
import Alert from '../components/Alert';
import sortHospitals from '../utils/sortHospitals';
import findNearestHospitals from '../utils/findNearestHospitals';

const Map = dynamic(() => import('../features/map'), {
  ssr: false
});

export default function Home() {
  const [currentPosition, setCurrentPosition] = React.useState(null);
  const [nearestHospitals, setNearestHospitals] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  /**
   * distance in km value.
   * distance can be changed from user input.
   * default distance is 50km.
   */
  const [distance, setDistance] = React.useState(50);

  const onError = () => {
    swal({
      button: 'Coba lagi',
      content: (
        <Alert
          title="LOKASI TIDAK TERJANGKAU"
          text='Kami tidak dapat bisa menjangkau lokasi anda saat ini, pastikan anda telah mengeklik "Izinkan/Allow" untuk kami dapat mengakses lokasi anda saat ini.'
        />
      )
    }).then(() => location.reload());
  };

  const onSuccess = position => {
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
      }, onError);
  };

  const getCurrentPosition = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      swal({
        button: 'Ya, saya mengerti',
        content: (
          <Alert
            title="FITUR TIDAK DIDUKUNG"
            text="Fitur geolocation tidak didukung oleh browser anda, coba buka aplikasi menggunakan browser versi terbaru atau tetap lanjutkan menggunakan aplikasi dengan mencari rumah sakit rujukan melalui kolom pencarian"
          />
        )
      });
    }
  };

  const onChangeDistance = e => {
    setDistance(e.target.value);
  };

  React.useEffect(() => {
    const init = async () => {
      const isVisited = Boolean(localStorage.getItem('isVisited'));
      if (!isVisited) {
        await swal({
          button: 'Ya, saya mengerti',
          content: (
            <Alert
              title="PERHATIAN"
              text='Aplikasi ini membutuhkan akses lokasi anda untuk menentukan rumah sakit rujukan yang dekat dengan lokasi anda, tekan "Izinkan/Allow" jika ingin langsung mengetahui lokasi rumah sakit rujukan yang berada didekat anda. Anda juga bisa mengubah radius jangkauan, dan melakukan pencarian rumah sakit rujukan melalui kolom pencarian.'
            />
          )
        });
        localStorage.setItem('isVisited', '1');
      }
      getCurrentPosition();
    };

    init();
  }, []);

  React.useEffect(() => {
    const getHospitalData = async () => {
      try {
        let hospitalsData = await findNearestHospitals(
          currentPosition.geolocation,
          distance
        );
        hospitalsData = sortHospitals(hospitalsData);
        setNearestHospitals(hospitalsData);
        setLoading(false);
      } catch (error) {
        onError();
      }
    };

    if (currentPosition) {
      getHospitalData();
    }
  }, [currentPosition, distance]);

  return (
    <div>
      <Head>
        <title>FIND COVID-19 HOSPITALS NEAR YOU</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map
        nearestHospitals={nearestHospitals}
        currentPosition={currentPosition}
        getCurrentPosition={getCurrentPosition}
        distance={distance}
        onChangeDistance={onChangeDistance}
        isLoading={loading}
      />
    </div>
  );
}
