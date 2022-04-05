import React, { useState, useRef } from "react";
import styles from "../../css/dashboard/income.module.css";
import axios from "axios";
import { userdata } from "../atoms";
import { useRecoilState } from "recoil";
import { useOutletContext } from 'react-router-dom';
axios.defaults.withCredentials = true;
function Income() {
    const { getdata } = useOutletContext();
  const [data, setdata] = useRecoilState(userdata);
const options = { year: "numeric", month: "long", day: "numeric" };
  const [formdata, setformdata] = useState({
    category: "",
    amount: null,
    subject: "",
    description: "",
    createdat: "",
  });
  const handleform = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };
  const [iserror, setiserror] = useState(false);
  const [errormsg, seterrormsg] = useState("");
  const cateref = useRef();
  const amountref = useRef();
  const subjectref = useRef();
  const descref = useRef();
  const createdref = useRef();
  const handlesubmit = async (e) => {
    e.preventDefault();
    console.log("true");
    setiserror(false);
    if (
      formdata.category.length != 0 &&
      (formdata.amount != null || formdata.amount?.length != 0) &&
      formdata.subject.length != 0 &&
      formdata.description.length != 0 &&
      formdata.createdat.length != 0
    ) {
    const mytoken = localStorage.getItem("token");
      const data = await axios
        .post(
          "https://glacial-shelf-00875.herokuapp.com/private/income",
          {
            category: formdata.category,
            amount: formdata.amount,
            subject: formdata.subject,
            description: formdata.description,
            createdat: formdata.createdat,
          },
          {
            headers: {
              Authorization: mytoken,
            },
          }
        )
        .then((data) => {
          console.log("submited sucessfuly");
          setformdata({
            category: "",
            amount: null,
            subject: "",
            description: "",
            createdat: "",
          });
          cateref.current.value = "";
          amountref.current.value = null;
          subjectref.current.value = "";
          descref.current.value = "";
          createdref.current.value = "";
          getdata();
        })
        .catch((e) => {
          console.log("error while expenses", e.response.data);
        });
    } else {
      console.log("error");
      setiserror(true);
      errorgenrator();
    }
  };
  const errorgenrator = () => {
    if (formdata.category.length == 0) {
      seterrormsg("please select categoery");
    } else if (formdata.amount == null || formdata.amount?.length == 0) {
      seterrormsg("please enter amount");
    } else if (formdata.subject.length == 0) {
      seterrormsg("please enter subject");
    } else if (formdata.description.length == 0) {
      seterrormsg("please enter description");
    } else if (formdata.createdat.length == 0) {
      seterrormsg("please enter date");
    }
    };

  return (
    <main className={styles.main}>
      <div className={styles.div}>
        <h1 className={styles.h1}>Income</h1>
        <nav className={styles.nav}>
          <ol className={styles.ol}>
            <li className={styles.li}>Home</li>
            <li className={styles.li}>/ dashboard</li>
            <li className={styles.li}>/ income</li>
          </ol>
        </nav>
      </div>
      <section className={styles.section}>
        <div className={styles.row}>
          <div className={styles.card}>
            <div className={styles.card_body}>
              <h5 className={styles.card_title}>Add Income</h5>
              <div className={styles.form}>
                {iserror && <div className={styles.error}>{errormsg}</div>}

                <div className={styles.dropdown}>
                  <label className={styles.label}>Categoery</label>
                  <div className={styles.indiv}>
                    <select
                      className={styles.select}
                      ref={cateref}
                      onChange={handleform}
                      name="category"
                    >
                      <option selected className={styles.option}>
                        select one value
                      </option>
                      <option className={styles.option}>Others</option>
                      <option value="Salary" className={styles.option}>
                        Salary
                      </option>
                      <option value="Awards" className={styles.option}>
                        Awards
                      </option>
                      <option value="Grants" className={styles.option}>
                        Grants
                      </option>
                      <option value="Sale" className={styles.option}>
                        Sale
                      </option>
                      <option value="Rental" className={styles.option}>
                        Rental
                      </option>
                      <option value="Refunds" className={styles.option}>
                        Refunds
                      </option>
                      <option value="Coupons" className={styles.option}>
                        Coupons
                      </option>
                      <option value="Dividends" className={styles.option}>
                        Dividends
                      </option>
                      <option value="Invesment" className={styles.option}>
                        Invesment
                      </option>
                    </select>
                  </div>
                </div>
                <div className={styles.ind}>
                  <label className={styles.label}>Amount</label>
                  <div className={styles.indd}>
                    <input
                      type="number"
                      className={styles.in}
                      ref={amountref}
                      onChange={handleform}
                      name="amount"
                    />
                  </div>
                </div>
                <div className={styles.ind}>
                  <label className={styles.label}>Subject</label>
                  <div className={styles.indd}>
                    <input
                      type="text"
                      className={styles.in}
                      ref={subjectref}
                      onChange={handleform}
                      name="subject"
                    />
                  </div>
                </div>
                <div className={styles.ind}>
                  <label className={styles.label}>Description</label>
                  <div className={styles.indd}>
                    <textarea
                      className={styles.in}
                      ref={descref}
                      onChange={handleform}
                      name="description"
                    />
                  </div>
                </div>
                <div className={styles.ind}>
                  <label className={styles.label}>Date</label>
                  <div className={styles.indd}>
                    <input
                      type="date"
                      className={styles.in}
                      ref={createdref}
                      onChange={handleform}
                      name="createdat"
                    />
                  </div>
                </div>
                <div className={styles.btndiv}>
                  <button className={styles.btn} onClick={handlesubmit}>
                    Add income
                  </button>
                </div>
              </div>
            </div>
          </div>

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
                              <td className={styles.td}>
                                {incomedata.category}
                              </td>
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
        </div>
      </section>
    </main>
  );
}

export default Income;
