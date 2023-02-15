import React from 'react'
import styles from './QMQReport.module.css';
import { romanize } from '../../../utils/projectUtils';

function QMQReport({data}) {
  return (
    <table className={`table ${styles.table_striped}`}>
      <thead>
        <tr className="table-dark">
          <th scope="col" className="text-lg-start">
            Month
          </th>
          <th scope="col" className="text-lg-center">
            Year
          </th>
          <th scope="col" className="text-lg-end">
            Months/Quarterly Hashrate (EH)
          </th>
        </tr>
      </thead>
      <tbody>
        {data?.report?.map((elem) => (
          <tr key={elem.date}>
            <td className="text-lg-start">{elem.date}</td>
            <td className="text-lg-center">{data.year}</td>
            <td className="text-lg-end">{elem.total.toFixed(2)}</td>
          </tr>
        ))}
        <tr>
          <th scope="col" className="text-lg-start">
            Totals {romanize(data.quarter)} Quarter:
          </th>
          <th scope="col" className="text-lg-center">
            {data.year}
          </th>
          <th scope="col" className="text-lg-end">
            {data.total}
          </th>
        </tr>
      </tbody>
    </table>
  );
}

export default QMQReport