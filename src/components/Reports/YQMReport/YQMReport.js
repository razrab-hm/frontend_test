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
          <th scope="col" className="text-lg-end">
            {modal ? 'Year' : 'YEAR'}
          </th>
          <th scope="col" className="text-lg-end">
            {modal ? 'Month hashrate (EH)' : 'HASHRATE PER MONTH/QUARTER (EH)'}
          </th>
          {
            data.total_profit ?
            <th scope="col" className="text-lg-end">
              {modal ? 'Total profit (BTC)' : 'TOTAL PROFIT (BTC)'}
            </th>
            : null
          }
        </tr>
        {data?.report.map((elem) => {
            return elem.type === 'quarter' ? (
              <tr key={elem.date} className={styles.quarter_title}>
                <td className="text-lg-start">{elem.date}</td>
                <td className="text-lg-end">{data?.year}</td>
                <td className="text-lg-end">{elem.total}</td>
                {
                  elem.total_profit ?
                  <td className="text-lg-end">{elem.total_profit}</td>
                  : null
                }
              </tr>
            ) : (
              <tr key={elem.date}>
                <td className="text-lg-start">{elem.date}</td>
                <td className="text-lg-end">{data?.year}</td>
                <td className="text-lg-end">{elem.total}</td>
                {
                  elem.total_profit ?
                  <td className="text-lg-end">{elem.total_profit}</td>
                  : null
                }
              </tr>
            );
        }
        )}
        {
          <tr className={styles.quarter_title}>
            <td className="text-lg-start">Total:</td>
            <td className="text-lg-end">{data?.year}</td>
            <td className="text-lg-end">{data?.total}</td>
            {
              data.total_profit ?
              <td className="text-lg-end">{data.total_profit}</td>
              : null
            }
          </tr>
        }
      </thead>
      <tbody></tbody>
    </table>
  );
}

export default YQMReport