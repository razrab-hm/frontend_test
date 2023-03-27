import React from 'react'
import styles from './YQMReport.module.css';

function YQMReport({ data, modal = false }) {

  if (!data.report) return null;

  return (
    <table className={`table ${styles.table_striped}`}>
      <thead>
        <tr className="table-dark">
          <th scope="col" className={styles.td_start}>
            {modal ? 'Month' : 'MONTH/QUARTER'}
          </th>
          <th scope="col" className={styles.td_end}>
            {modal ? 'Year' : 'YEAR'}
          </th>
          <th scope="col" className={styles.td_end}>
            {modal ? 'Month hashrate (EH)' : 'HASHRATE PER MONTH/QUARTER (EH)'}
          </th>
          {
            data.total_profit ?
            <th scope="col" className={styles.td_end}>
              BTC
            </th>
            : null
          }
        </tr>
        {data?.report.map((elem) => {
            return elem.type === 'quarter' ? (
              <tr key={elem.date} className={styles.quarter_title}>
                <td className={styles.td_start}>{elem.date}</td>
                <td className={styles.td_end}>{data?.year}</td>
                <td className={styles.td_end}>{elem.total}</td>
                {
                  elem.total_profit ?
                  <td className={styles.td_end}>{elem.total_profit}</td>
                  : null
                }
              </tr>
            ) : (
              <tr key={elem.date}>
                <td className={styles.td_start}>{elem.date}</td>
                <td className={styles.td_end}>{data?.year}</td>
                <td className={styles.td_end}>{elem.total}</td>
                {
                  elem.total_profit ?
                  <td className={styles.td_end}>{elem.total_profit}</td>
                  : null
                }
              </tr>
            );
        }
        )}
        {
          <tr className={styles.quarter_title}>
            <td className={styles.td_start}>Total:</td>
            <td className={styles.td_end}>{data?.year}</td>
            <td className={styles.td_end}>{data?.total}</td>
            {
              data.total_profit ?
              <td className={styles.td_end}>{data.total_profit}</td>
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