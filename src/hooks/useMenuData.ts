import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { MenuItem } from '../data';

const SHEET_ID = '1otN1s4qs_QfF7jfK4uy-uTFOKhflZUXao7vTLrzQBK8';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

export function useMenuData() {
  const [data, setData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`${CSV_URL}&_=${new Date().getTime()}`);
      const csvText = await response.text();
      const rows = csvText.split('\n');

      const formattedData = rows.slice(1).map((row, index) => {
        const columns = row.split(',').map(col => col.replace(/^"|"$/g, '').trim());
        
        const seqId = columns[1] ? columns[1].trim() : '';
        const imageUrl = seqId ? `https://raw.githubusercontent.com/royalmanish431-ux/amansweet/main/${seqId}` : '';
        
        console.log('Parsed Image:', seqId, 'URL:', imageUrl);

        return {
          id: (index + 1).toString(),
          category: columns[2] ? columns[2].trim() : 'Other',
          nativeName: columns[3] ? columns[3].trim() : '',
          name: columns[4] ? columns[4].trim() : '',
          portion: columns[5] ? columns[5].trim() : '-',
          priceHalf: columns[6] ? columns[6].trim() : '',
          priceFull: columns[7] ? columns[7].trim() : '',
          offer: columns[8] ? columns[8].trim() : '',
          imageName: seqId
        };
      });

      setData(formattedData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
