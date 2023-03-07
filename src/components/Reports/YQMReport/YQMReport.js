import React from 'react'
import styles from './YQMReport.module.css';

function YQMReport({ data, modal = false }) {
  if (!data.report) return null;

  return (
    <table className={`table ${styles.table_striped}`}>
      <thead>
        <tr className="table-dark">
          <th scope="col" className="text-lg-start">
            {modal ? 'Month' : 'MONTH/QUARTER'}
          </th>
          <th scope="col" className="text-lg-center">
            {modal ? 'Year' : 'YEAR'}
          </th>
          <th scope="col" className="text-lg-end">
            {modal ? 'Month hashrate (EH)' : 'HASHRATE PER MONTH/QUARTER (EH)'}
          </th>
        </tr>
        {data?.report.map((elem) => {
            return elem.type === 'quarter' ? (
              <tr key={elem.date} className={styles.quarter_title}>
                <td className="text-lg-start">{elem.date}</td>
                <td className="text-lg-center">{data?.year}</td>
                <td className="text-lg-end">{elem.total}</td>
              </tr>
            ) : (
              <tr key={elem.date}>
                <td className="text-lg-start">{elem.date}</td>
                <td className="text-lg-center">{data?.year}</td>
                <td className="text-lg-end">{elem.total}</td>
              </tr>
            );
        }
        )}
        {
          <tr className={styles.quarter_title}>
            <td className="text-lg-start">Total:</td>
            <td className="text-lg-center">{data?.year}</td>
            <td className="text-lg-end">{data?.total}</td>
          </tr>
        }
      </thead>
      <tbody></tbody>
    </table>
  );
}

export default YQMReport