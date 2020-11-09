import Head from 'next/head';

import getHospitals from '../utils/getHospitals';

export default function Home({data}) {
  console.log(data);
  return (
    <div>
      <h1>Hello world!</h1>
      <Head>
        <title>FIND COVID-19 HOSPITALS NEAR YOU</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}

export async function getStaticProps() {
  const hospitals = await getHospitals();
  return {
    props: {
      data: hospitals
    }
  };
}
