import React from 'react';
import styles from './YDMQReport.module.css';

function YDMQReport({data}) {
  return (
    <table className={`table ${styles.table_striped}`}>
      <thead>
        <tr className="table-dark">
          <th scope='col' className='text-lg-start'>Day/Month/Quarters</th>
          <th scope='col' className='text-lg-center'>Average Hashrate (PH/s)</th>
        <th scope='col' className='text-lg-end'>Day/Months/quarters Hashrate (EH)</th>
        </tr>
      </thead>
      <tbody>
        {
          data?.report?.map(elem => (
            elem.type === 'month' ? 
            <tr key={elem.date}>
              <th scope='col' className='text-lg-start'>Totals for {elem.date}</th>
              <th scope='col' className='text-lg-center'>{elem.average}</th>
              <th scope='col' className='text-lg-end'>{elem.total}</th>
            </tr>
            :
            elem.type === 'quarter' ?
            <tr key={elem.date}>
              <th scope='col' className='text-lg-start'>{elem.date}</th>
              <th scope='col' className='text-lg-center'>{elem.average}</th>
              <th scope='col' className='text-lg-end'>{elem.total}</th>
            </tr>
            :
            <tr key={elem.date}>
              <td className='text-lg-start'>{elem.date}</td>
              <td className='text-lg-center'>{elem.average}</td>
              <td className='text-lg-end'>{elem.hash}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default YDMQReport