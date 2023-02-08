import React from 'react'
// eslint-disable-next-line no-unused-vars
import styles from './YQReport.module.css';
import { romanize } from '../../../utils/projectUtils';
import ENUMS from '../../../constants/appEnums';

function YQReport({ data }) {
  return (
    <table className="table table-success table-striped">
      <thead>
        <tr className="table-dark">
          <th scope="col" className="text-lg-start">
            Quarter
          </th>
          <th scope="col" className="text-lg-center">
            Year
          </th>
          <th scope="col" className="text-lg-end">
            Quarter hashrate (EH)
          </th>
        </tr>
      </thead>
      <tbody>
        {data?.report?.map((elem, index) => (
          <tr key={elem.Quarter}>
            <td className="text-lg-start">
              {romanize(elem.Quarter)} Quarter ({ENUMS.QUARTERS[index + 1]})
            </td>
            <td className="text-lg-center">
              {data?.year}
            </td>
            <td className="text-lg-end">
              {elem.total}
            </td>
          </tr>
        ))}
        <tr>
          <th scope="col" className="text-lg-start">
            Totals:
          </th>
          <th scope="col" className="text-lg-center">
            {data?.year}
          </th>
          <th scope="col" className="text-lg-end">
            {data?.total?.toFixed(2)}
          </th>
        </tr>
      </tbody>
    </table>
  );
}

export default YQReport