import React, { useEffect, useState, useRef } from "react";
import styles from "../css/dashboard/main.module.css";
import Navbard from "../components/dashboard/Navbard";
import Sidebar from "../components/dashboard/Sidebar";
import { Link, Outlet } from "react-router-dom";
import Homedash from "../components/nestedcomp/Homedash";
import Income from "../components/nestedcomp/Income";
import Expense from "../components/nestedcomp/Expense";
import Charts from "../components/nestedcomp/Charts";
import Profile from "../components/nestedcomp/Profile";
import axios from "axios";
import { userdata} from "../components/atoms";
import Cookies from "universal-cookie";
import { useRecoilState } from "recoil";
const cookies = new Cookies();
axios.defaults.withCredentials = true;
function Main() {
  const [isauth, setIsauth] = useState(false);
  const [udata, setudata] = useRecoilState(userdata);
 
  const [isunable, setunable] = useState(false);


  useEffect(() => {
    verifyuser();
  }, []);


  const verifyuser = async () => {
    const mytoken=localStorage.getItem('token')

    if (!mytoken) {
      setIsauth(false);
      window.location.href = "/login";
    } else if (mytoken) {
      setIsauth(true);
      getdata();
      console.log("you are our user");
    }
  };

  const getdata = async () => {
const mytoken = localStorage.getItem("token");
    const data = await axios
      .get("https://glacial-shelf-00875.herokuapp.com/private/getdata", {
        headers: {
          Authorization: mytoken,
        },
      })
      .then(({ data }) => {
        setudata(data);

        return data;
      })
      .catch((e) => {
        console.log(e?.response?.data);
        setunable(true);
      });
  };

  return (
    <main className={styles.main}>
      <Navbard />
      <div className={styles.body}>
        <Sidebar />
      </div>
      <div className={styles.nestedmain}>
        <Outlet className={styles.outlet} context={{getdata}} />
      </div>
    </main>
  );
}

export default Main;
