import React from 'react'
// eslint-disable-next-line no-unused-vars
import styles from './MonthReport.module.css'

function MonthReport({data, modal = false}) {
  return (
    <table className="table table-success table-striped">
      <thead>
        <tr className="table-dark">
          <th scope="col" className="text-lg-start">
            DATE
          </th>
          <th scope="col" className="text-lg-end">
            AVERAGE HASHRATE (PH/s)
          </th>
          <th scope="col" className="text-lg-end">
            HASHRATE PER DAY (EH)
          </th>
        </tr>
      </thead>
      <tbody>
        {data?.report?.map((elem) => (
          <tr key={elem.date}>
            <td className="text-lg-start">{elem.date}</td>
            <td className="text-lg-end">{elem.average}</td>
            <td className="text-lg-end">{elem.total}</td>
          </tr>
        ))}
        {modal && data?.report?.length > 0 ? (
          <tr className="table-dark">
            <th scope="col" className="text-lg-start">
              Totals
            </th>
            <th scope="col" className="text-lg-end">
              {data?.year}
            </th>
            <th scope="col" className="text-lg-end">
              {data?.total?.toFixed(2)}
            </th>
          </tr>
        ) : (
          null
        )}
      </tbody>
    </table>
  );
}

export default MonthReport