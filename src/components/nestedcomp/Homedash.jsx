import React from "react";
import styles from "../../css/dashboard/homedash.module.css";
import { BiMoney } from "react-icons/bi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { userdata } from "../atoms";
import { useRecoilState } from "recoil";
import Chart from "react-apexcharts";
function Homedash() {
  const [data, setdata] = useRecoilState(userdata);
const options = { year: "numeric", month: "long", day: "numeric" };

  const incomedata = data?.getincome?.map((ele) => [
    ele.amount,
    new Date(ele.createdat),
  ]);
  const expensedata = data?.getexpense?.map((ele) => [
    ele.amount,
    new Date(ele.createdat),
  ]);

  const today = (data) => {
    const td = new Date();
    const currentYear = td.getFullYear();
    const currentMonth = td.getMonth() + 1;
    const currentDate = td.getDate();
    let amount = 0;
    for (var i = 0; i < data?.length; i++) {
      const e = new Date(data[i][1]);
      const ed = e.getDate();
      const em = e.getMonth() + 1;
      const ey = e.getFullYear();

      if (currentDate == ed && currentMonth == em && currentYear == ey) {
        amount += data[i][0];
      }
    }
    return amount;
  };
  const month = (data) => {
    const td = new Date();
    const currentYear = td.getFullYear();
    const currentMonth = td.getMonth() + 1;
    let amount = 0;
    for (var i = 0; i < data?.length; i++) {
      const e = new Date(data[i][1]);
      const em = e.getMonth() + 1;
      const ey = e.getFullYear();
      if (currentMonth == em && currentYear == ey) {
        amount += data[i][0];
      }
    }
    return amount;
  };
  const year = (data) => {
    const td = new Date();
    const currentYear = td.getFullYear();
    let amount = 0;
    for (var i = 0; i < data?.length; i++) {
      const e = new Date(data[i][1]);
      const ey = e.getFullYear();
      if (currentYear == ey) {
        amount += data[i][0];
      }
    }
    return amount;
  };

  const sortdate = (d) => {
    const res = d?.sort(function (a, b) {
      var c = new Date(a[1]).getTime();
      var d = new Date(b[1]).getTime();
      return c - d;
    });
    return res;
  };

  const amountarray = (incomedata) => {
    const data = sortdate(incomedata);
    const l = data?.length;
    const a = [];
    for (let i = 0; i < l; i++) {
      a.push(data[i][0]);
    }
    return a;
  };
  const datearray = (incomedata) => {
    const data = sortdate(incomedata);
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
  console.log("dfsdfdsf", data?.getincome?.length);
  return (
    <main className={styles.main}>
      <div className={styles.div}>
        <h1 className={styles.h1}>Dashboard</h1>
        <nav className={styles.nav}>
          <div className={styles.ol1}>
            <li className={styles.li}>Home</li>
            <li className={styles.li}>/ dashboard</li>
            <li className={styles.li}>/</li>
          </div>
        </nav>
      </div>
      <div className={styles.div1}>
        <div className={styles.top1}>
          <div className={styles.card}>
            <div className={styles.cardbody}>
              <div className={styles.cardtop}>
                <div className={styles.carddiv}>
                  <h5 className={styles.h5}>
                    Welcome {data?.userdata?.name ? data.userdata.name : "User"}{" "}
                    🎉
                  </h5>
                  <p className={styles.p}>
                    Welcome to income and expense mangement system app.check
                    your profile.
                  </p>

                  <a href="/dashboard/profile" className={styles.mbtn}>
                    View profile
                  </a>
                </div>
              </div>
              <div className={styles.cardbottom}>
                <div>
                  <img
                    src="/man-with-laptop-light.png"
                    height="140"
                    alt="View Badge User"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.div2}>
        <div className={styles.card11}>
          <div className={styles.card12}>
            <div className={styles.card13}>
              <div className={styles.imgdiv}>
                <div className={styles.icondiv}>
                  <BiMoney className={styles.icon} />
                </div>
              </div>

              <span className={styles.span}>Income</span>
              <h3 className={styles.h3}>₹{today(incomedata)}</h3>
              <small className={styles.small}>Today</small>
            </div>
          </div>
        </div>
        <div className={styles.card11}>
          <div className={styles.card12}>
            <div className={styles.card13}>
              <div className={styles.imgdiv}>
                <div className={styles.icondiv}>
                  <BiMoney className={styles.icon} />
                </div>
              </div>

              <span className={styles.span}>Income</span>
              <h3 className={styles.h3}>₹{month(incomedata)}</h3>
              <small className={styles.small}>This Month</small>
            </div>
          </div>
        </div>
        <div className={styles.card11}>
          <div className={styles.card12}>
            <div className={styles.card13}>
              <div className={styles.imgdiv}>
                <div className={styles.icondiv}>
                  <BiMoney className={styles.icon} />
                </div>
              </div>

              <span className={styles.span}>Income</span>
              <h3 className={styles.h3}>₹{year(incomedata)}</h3>
              <small className={styles.small}>This Year</small>
            </div>
          </div>
        </div>
        <div className={styles.card11}>
          <div className={styles.card12}>
            <div className={styles.card13}>
              <div className={styles.imgdiv}>
                <div className={styles.icondiv}>
                  <MdOutlineAttachMoney className={styles.icon} />
                </div>
              </div>

              <span className={styles.span}>Expenses</span>
              <h3 className={styles.h3}>₹{today(expensedata)}</h3>
              <small className={styles.small}>Today</small>
            </div>
          </div>
        </div>
        <div className={styles.card11}>
          <div className={styles.card12}>
            <div className={styles.card13}>
              <div className={styles.imgdiv}>
                <div className={styles.icondiv}>
                  <MdOutlineAttachMoney className={styles.icon} />
                </div>
              </div>

              <span className={styles.span}>Expenses</span>
              <h3 className={styles.h3}>₹{month(expensedata)}</h3>
              <small className={styles.small}>This Year</small>
            </div>
          </div>
        </div>
        <div className={styles.card11}>
          <div className={styles.card12}>
            <div className={styles.card13}>
              <div className={styles.imgdiv}>
                <div className={styles.icondiv}>
                  <MdOutlineAttachMoney className={styles.icon} />
                </div>
              </div>

              <span className={styles.span}>Expenses</span>
              <h3 className={styles.h3}>₹{year(expensedata)}</h3>
              <small className={styles.small}>This Year</small>
            </div>
          </div>
        </div>
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
      <div className={styles.card}>
        <div className={styles.card_body}>
          <h5 className={styles.card_title}>All income</h5>
          <div className={styles.form}>
            <div className={styles.tablediv}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr className={styles.tr}>
                    <th className={styles.th}>#</th>
                    <th className={styles.th}>Category</th>
                    <th className={styles.th}>Amount</th>
                    <th className={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  {data?.getincome &&
                    data?.getincome.map((incomedata, i = 0) => {
                      i++;
                      return (
                        <tr className={styles.tr} key={incomedata._id}>
                          <th className={styles.thh}>{i}</th>
                          <td className={styles.td}>{incomedata.category}</td>
                          <td className={styles.td}>{incomedata.amount}</td>
                          <td className={styles.td}>
                            {new Date(incomedata.createdat).toLocaleDateString(
                              undefined,
                              options
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {data?.getincome?.length === 0 && (
              <div className={styles.nodata}>No Data </div>
            )}
            
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.card_body}>
          <h5 className={styles.card_title}>All Expenses</h5>
          <div className={styles.form}>
            <div className={styles.tablediv}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr className={styles.tr}>
                    <th className={styles.th}>#</th>
                    <th className={styles.th}>Category</th>
                    <th className={styles.th}>Amount</th>
                    <th className={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  {data?.getexpense &&
                    data?.getexpense.map((incomedata, i = 0) => {
                      i++;
                      return (
                        <tr className={styles.tr} key={incomedata._id}>
                          <th className={styles.thh}>{i}</th>
                          <td className={styles.td}>{incomedata.category}</td>
                          <td className={styles.td}>{incomedata.amount}</td>
                          <td className={styles.td}>
                            {new Date(incomedata.createdat).toLocaleDateString(
                              undefined,
                              options
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {data?.getincome?.length === 0 && (
              <div className={styles.nodata}>No Data </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

export default Homedash;
