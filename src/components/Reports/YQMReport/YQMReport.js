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
                <td className="text-lg-end">{elem.total.toFixed(2)}</td>
              </tr>
            ) : (
              <tr key={elem.date}>
                <td className="text-lg-start">{elem.date}</td>
                <td className="text-lg-center">{data?.year}</td>
                <td className="text-lg-end">{elem.total.toFixed(2)}</td>
              </tr>
            );
        }
        )}
        {/* {
                Object.keys(YQMReportData?.report).map((key, i) =>
                <>
                    {YQMReportData.report[key].map((elem) => (
                        <tr key={elem.name}>
                            <td className='text-lg-start'>{elem.name}</td>
                            <td className='text-lg-center'>{elem.date}</td>
                            <td className='text-lg-end'>{elem.total}</td>
                        </tr>
                    ))}
                        <tr key={`${key}${i}`} className={styles.quarter_title}>
                            <td className='text-lg-start'>{`${romanize(i + 1)} Quarter`}</td>
                            <td className='text-lg-center'>2022</td>
                            <td className='text-lg-end'>
                                {
                                YQMReportData.report[key].reduce( function(a, b){
                                    return (a + b.total);
                                }, 0).toFixed(2)
                                }
                            </td>
                        </tr>
                </>
                )
            } */}
        {/* Total */}
        {
          <tr className={styles.quarter_title}>
            <td className="text-lg-start">Total:</td>
            <td className="text-lg-center">{data?.year}</td>
            <td className="text-lg-end">{data?.total?.toFixed(2)}</td>
          </tr>
        }
      </thead>
      <tbody></tbody>
    </table>
  );
}

export default YQMReport