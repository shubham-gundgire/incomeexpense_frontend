import React from 'react'
import styles from '../../css/dashboard/charts.module.css';
import { userdata } from "../atoms";
import { useRecoilState } from "recoil";
import Chart from "react-apexcharts";
function Charts() {

 



  const [data, setdata] = useRecoilState(userdata);
  const incomedata = data?.getincome?.map((ele) => [
    ele.amount,
    new Date(ele.createdat),
  ]);
  const expensedata = data?.getexpense?.map((ele) => [
    ele.amount,
    new Date(ele.createdat),
  ]);
  const sortdate = (d) => {
    const res = d?.sort(function (a, b) {
      var c = new Date(a[1]).getTime();
      var d = new Date(b[1]).getTime();
      return c - d;
    });
    return res;
  };

  const amountarray = (arr) => {
    const data = sortdate(arr);
    const l = data?.length;
    const a = [];
    for (let i = 0; i < l; i++) {
      a.push(data[i][0]);
    }
    return a;
  };
  const datearray = (arr) => {
    const data = sortdate(arr);
    const l = data?.length;
    const a = [];
    for (let i = 0; i < l; i++) {
      const dd = new Date(data[i][1]).getTime();
      a.push(dd);
    }

    return a;
  };
    const amountin = amountarray(incomedata);
    const datein = datearray(incomedata);
    const amountex = amountarray(expensedata);
  const dateex = datearray(expensedata);

  const chartdataincome = {
    series: [
      {
        name: "amount",
        data: amountin,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
      },
      title: {
        text: "income chart",
        align: "left",
        style: {
          fontSize: "20px",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: datein,
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  };
  const chartdataexpense = {
    series: [
      {
        name: "amount",
        data: amountex,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
        color: "#00E396",
      },
      fill: {
        colors: ["#00E396"],
      },
      title: {
        text: "expense chart",
        align: "left",
        style: {
          fontSize: "20px",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["#00E396"],
      },
      xaxis: {
        type: "datetime",
        categories: dateex,
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  };

  const uniqueincome = [...new Set(data?.getincome?.map((item) => item.category))];
  const uniqueexpense = [
    ...new Set(data?.getexpense?.map((item) => item.category)),
  ];
  const getpiein = () => {
    const categoryarr = [];
    let total = 0;
    for (let i = 0; i < uniqueincome?.length; i++){
      let count = 0;
      const arr = data?.getincome?.map((ele) => {
        if (ele.category == uniqueincome[i]) {
          count += ele.amount;
        }
        
      })
      categoryarr.push(count);
      total += count;
    }
return [categoryarr, total];
  }
    const getpieex = () => {
      const categoryarr = [];
      let total = 0;
      for (let i = 0; i < uniqueexpense?.length; i++) {
        let count = 0;
        const arr = data?.getexpense?.map((ele) => {
          if (ele.category == uniqueexpense[i]) {
            count += ele.amount;
          }
        });
        categoryarr.push(count);
        total += count;
      }
      return [categoryarr, total];
    };
 const indata= getpiein();
  const exdata = getpieex();
const piein={
          
            series: indata[0],
            options: {
              chart: {
                width: 380,
                type: 'pie',
              }, title: {
        text: "income by categoery",
        align: "left",
        style: {
          fontSize: "20px",
        },
      },
              labels: uniqueincome,
              responsive: [{
                breakpoint: 360,
                options: {
                  chart: {
                    width: 320
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            },
                    
  }  
 const pieex = {
   series: exdata[0],
   options: {
     chart: {
       width: 380,
       type: "pie",
     },
     title: {
       text: "expense by categoery",
       align: "left",
       style: {
         fontSize: "20px",
       },
     },
     labels: uniqueexpense,
     responsive: [
       {
         breakpoint: 360,
         options: {
           chart: {
             width: 320,
           },
           legend: {
             position: "bottom",
           },
         },
       },
     ],
   },
 }; 
  return (
    <main className={styles.main}>
      <div className={styles.div}>
        <h1 className={styles.h1}>Charts</h1>
        <nav className={styles.nav}>
          <div className={styles.ol1}>
            <li className={styles.li}>Home</li>
            <li className={styles.li}>/ dashboard</li>
            <li className={styles.li}>/ charts</li>
          </div>
        </nav>
      </div>
      <div className={styles.piediv}>
        {data?.getincome?.length > 0 && (
          <Chart
            options={piein.options}
            series={piein.series}
            type="pie"
            width={380}
            className={styles.chartbox}
          />
        )}
        {data?.getexpense?.length > 0 && (
          <Chart
            options={pieex.options}
            series={pieex.series}
            type="pie"
            width={380}
            className={styles.chartbox}
          />
        )}
      </div>
      {data?.getincome?.length > 1 && (
        <Chart
          options={chartdataincome.options}
          series={chartdataincome.series}
          type="area"
          height={360}
          className={styles.chartbox}
        />
      )}
      {data?.getexpense?.length > 1 && (
        <Chart
          options={chartdataexpense.options}
          series={chartdataexpense.series}
          type="area"
          height={360}
          className={styles.chartbox}
        />
      )}
      {data?.getincome?.length === 0 && data?.getexpense?.length === 0 && (
        <div className={styles.nodata}>
          No data availabe please add income or expenses
        </div>
      )}
    </main>
  );
}

export default Charts