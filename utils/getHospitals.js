import parser from 'fast-html-parser';
import retry from '@vercel/fetch-retry';
import nodeFetch from 'node-fetch';
import opencage from 'opencage-api-client';

import hospitals from './hospitals.json';

const fetcher = retry(nodeFetch);

export default async function getHospitals() {
  try {
    const rawData = await getPage();
    const root = parser.parse(rawData);
    const rows = root.querySelectorAll('tbody tr');
    const result = [];

    for (const row of rows) {
      const tds = row.querySelectorAll('td');
      const name = tds[0].text,
        province = tds[1].text,
        telephone = tds[2].querySelectorAll('span').map(s => s.text),
        fax = tds[3].text.replace(' ', '-'),
        address = tds[4].text,
        additionalInfo = await fetchHospitals(name, province);
      console.lo;
      result.push({
        name,
        province,
        telephone,
        fax,
        address,
        ...additionalInfo
      });
    }

    return result;
  } catch (error) {
    console.log('ah there was an error: ', error);
  }
}

function getPage() {
  const url = 'https://covid19.go.id/daftar-rumah-sakit-rujukan';
  return new Promise((resolve, reject) => {
    fetcher(url).then(
      res => resolve(res.text()),
      err => reject(err)
    );
  });
}

async function fetchHospitals(name, province) {
  const savedHospital = hospitals.find(hospital => hospital.name === name);
  if (savedHospital) {
    console.log(savedHospital);
    return savedHospital;
  }

  const data = await opencage.geocode({
    q: `${name}, ${province}`,
    no_annotations: 1,
    language: 'id',
    countryCode: 'id',
    limit: 1
  });
  const transformedData = transformData(data.results[0]);
  return transformedData;
}

function transformData(data) {
  const componentType = ['city', 'state', 'county'];
  const {components, formatted, geometry} = data;

  if (components._type === 'hospital' || components._type === 'building') {
    const address = formatted.split(', ').slice(1).join(', ');
    return {
      address,
      isHospital: true,
      geolocation: geometry
    };
  }

  if (componentType.includes(components._type)) {
    return {
      address: formatted,
      isHospital: false,
      geolocation: geometry
    };
  }
}
