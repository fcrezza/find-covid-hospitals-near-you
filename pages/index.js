import Head from 'next/head';
import dynamic from 'next/dynamic';

// import getHospitals from '../utils/getHospitals';
import hospitals from '../utils/saved-hospitals.json';
const Map = dynamic(() => import('../components/Map'), {
  ssr: false
});

export default function Home() {
  return (
    <div>
      <Head>
        <title>FIND COVID-19 HOSPITALS NEAR YOU</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map data={hospitals} />
    </div>
  );
}

// export async function getStaticProps() {
//   const hospitals = await getHospitals();
//   console.log(hospitals);
//   return {
//     props: {
//       data: hospitals
//     }
//   };
// }
