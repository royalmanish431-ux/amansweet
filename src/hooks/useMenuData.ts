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

      Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          // The structure is based on the user's HTML code:
          // row[0]: id, row[2]: category, row[3]: hindi, row[4]: english, 
          // row[5]: portion, row[6]: halfPrice, row[7]: fullPrice
          const rawData = results.data as string[][];
          // Skip the first row (headers)
          const dataRows = rawData.slice(1);
          const formattedData = dataRows.map((row) => ({
            id: row[0],
            category: row[2] || 'Other',
            nativeName: row[3] || '',
            name: row[4] || '',
            portion: row[5] || '-',
            priceHalf: row[6] || '-',
            priceFull: row[7] || '-',
            offer: row[8] || '',
          }));
          setData(formattedData);
          setLoading(false);
        },
        error: (err) => {
          setError(err.message);
          setLoading(false);
        }
      });
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
