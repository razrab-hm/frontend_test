import React from 'react';
import styles from './QDMReport.module.css';
import { romanize } from '../../../utils/projectUtils';

function QDMReport({data}) {
  return (
    <table className={`table ${styles.table_striped}`}>
      <thead>
        <tr className="table-dark">
          <th scope='col' className='text-lg-start'>Date</th>
          <th scope='col' className='text-lg-center'>Year</th>
        <th scope='col' className='text-lg-end'>Day/Months Hashrate (EH)</th>
        </tr>
      </thead>
      <tbody>
        {
          data?.report?.map(elem => (
            elem.type === 'month' ? 
            <tr key={elem.date}>
              <th scope='col' className='text-lg-start'>Totals for {elem.date}</th>
              <th scope='col' className='text-lg-center'>{data?.year}</th>
              <th scope='col' className='text-lg-end'>{elem?.total?.toFixed(2)}</th>
            </tr>
            :
            <tr key={elem.date}>
              <td className='text-lg-start'>{elem.date}</td>
              <td className='text-lg-center'>{data?.year}</td>
              <td className='text-lg-end'>{elem.hash}</td>
            </tr>
          ))
        }
         <tr>
              <th scope='col' className='text-lg-start'>Total {romanize(data?.quarter)} Quarter</th>
              <th scope='col' className='text-lg-center'>{data?.year}</th>
              <th scope='col' className='text-lg-end'>{data?.total?.toFixed(2)}</th>
            </tr>
      </tbody>
    </table>
  )
}

export default QDMReport