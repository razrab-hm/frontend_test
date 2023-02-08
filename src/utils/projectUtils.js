import { reportsApi } from "./reportsApi";
import { getCookie } from "./cookie";
import { authApi } from "./authApi";


export const checkAuthStatus = async (setterUser, setterUserRole, setterLoading) => {
  const data = {
    accessToken: getCookie('accessToken'),
    refreshToken: getCookie('refreshToken')
  }

  if (data.accessToken && data.refreshToken) {
    setterLoading(true)
    authApi.authStatus(data.accessToken)
      .then((res) => {
        if(res && res.message === "success") {
          setterUser(true);
          setterUserRole(res.role)
          setterLoading(false)
        }
    })
      .catch((error) => {
        console.log(error)
        setterUser(false)
        setterLoading(false)
      });
  } else {
    setterUser(false)
    setterLoading(false)
  }
}


export const getData = (parameters, setData, apiMethod, url, selectedCompanies) => {
  setData([]);
  apiMethod(parameters , url, selectedCompanies)
    .then((res) => {
    setData(res);
  })
    .catch((error) => {
    setData([]);
    console.log(error)
  })
}

export const handlReport = async (parameters, url, setter, pdf = false, xlsx = false) => {
  setter([]);
    if (pdf) {
      reportsApi.getReport(parameters, url, pdf)
        .then((res) => {
          const blob = new Blob([res], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `Report-${+new Date()}`;
          link.click();
        })
        .catch((error) => {
          setter([]);
          console.log(error);
        });
    } else if(xlsx) {
          const res = await reportsApi.getXlsxReport(parameters);
          let blob = await res.blob();
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `Report-${+new Date()}.xls`;
          link.click();
    } else {
      reportsApi.getReport(parameters, url)
        .then((res) => {
          setter(res);
        })
        .catch((error) => {
          setter([]);
          console.log(error);
        });
    }
};





export function romanize(num) {
    var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},roman = '',i;
    for ( i in lookup ) {
      while ( num >= lookup[i] ) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
}

export function sortByMonthName(monthNames, isReverse = false) {
  const referenceMonthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const directionFactor = isReverse ? -1 : 1;
  const comparator = (a, b) => {
    if (!a && !b) return 0;
    if (!a && b) return -1 * directionFactor;
    if (a && !b) return 1 * directionFactor;

    const comparableA = a.toLowerCase().substring(0, 3);
    const comparableB = b.toLowerCase().substring(0, 3);
    const comparisonResult = referenceMonthNames.indexOf(comparableA) - referenceMonthNames.indexOf(comparableB);
    return comparisonResult * directionFactor;
  };
  const safeCopyMonthNames = [...monthNames];
  safeCopyMonthNames.sort(comparator);
  return safeCopyMonthNames;
}

