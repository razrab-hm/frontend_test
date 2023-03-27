import React from 'react'
// eslint-disable-next-line no-unused-vars
import styles from './MonthReport.module.css'

function MonthReport({data, modal = false}) {

  return (
    <table className="table table-success table-striped">
      <thead>
        <tr className="table-dark">
          <th scope="col" className={styles.td_start}>
            DATE
          </th>
          <th scope="col" className={styles.td_end}>
            AVERAGE HASHRATE (PH/s)
          </th>
          <th scope="col" className={styles.td_end}>
            HASHRATE PER DAY (EH)
          </th>
          {
            data.total_profit ?
            <th scope="col" className={styles.td_end}>
              BTC
            </th>
            : null
          }
        </tr>
      </thead>
      <tbody style={{whiteSpace: 'nowrap'}}>
        {data?.report?.map((elem) => (
          <tr key={elem.date}>
            <td className={styles.td_start}>{elem.date}</td>
            <td className={styles.td_end}>{elem.average}</td>
            <td className={styles.td_end}>{elem.total}</td>
            {
              elem.total_profit ?
             <td className={styles.td_end}>{elem.total_profit}</td>
              : null
            }
          </tr>
        ))}
        {modal && data?.report?.length > 0 ? (
          <tr className="table">
            <th scope="col" className={styles.td_start}>
              Totals
            </th>
            <th scope="col" className={styles.td_end}>
              {data?.year}
            </th>
            <th scope="col" className={styles.td_end}>
              {data?.total}
            </th>
            {
              data.total_profit ?
              <th scope="col" className={styles.td_end}>
                {data?.total_profit}
              </th>
              : null
            }
          </tr>
        ) : (
          null
        )}
      </tbody>
    </table>
  );
}

export default MonthReport