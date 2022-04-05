import React, { useRef } from "react";
import styles from "../../css/dashboard/sidebar.module.css";
import { AiOutlineAppstore } from "react-icons/ai";
import { BiMoney } from "react-icons/bi";
import { HiOutlineCash, HiOutlineChartSquareBar } from "react-icons/hi";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { refsidebar } from "../atoms";
import axios from "axios";
axios.defaults.withCredentials = true;
function Sidebar() {
  const [refval, setrefval] = useRecoilState(refsidebar);
  const sidebarref = useRef();
  setrefval(sidebarref.current);

  const logout = async () => {  
    console.log('inside log');
        localStorage.clear();
 window.location.href = "/";

  };
  const handlesider = () => {
    sidebarref.current.style = "-350px";
  }
  return (
    <>
      <div className={styles.main} ref={sidebarref}>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <Link
              to="/dashboard/"
              className={styles.navlink}
              onClick={handlesider}
            >
              <AiOutlineAppstore className={styles.logo} />
              <span className={styles.span}>Dashboard</span>
            </Link>
          </li>
          <li className={styles.li}>
            <Link
              to="/dashboard/income"
              className={styles.navlink}
              onClick={handlesider}
            >
              <BiMoney className={styles.logo} />
              <span className={styles.span}>Income</span>
            </Link>
          </li>
          <li className={styles.li}>
            <Link
              to="/dashboard/expense"
              className={styles.navlink}
              onClick={handlesider}
            >
              <HiOutlineCash className={styles.logo} />
              <span className={styles.span}>Expenses</span>
            </Link>
          </li>
          <li className={styles.li}>
            <Link
              to="/dashboard/charts"
              className={styles.navlink}
              onClick={handlesider}
            >
              <HiOutlineChartSquareBar className={styles.logo} />
              <span className={styles.span}>Charts</span>
            </Link>
          </li>
          <li className={styles.li}>
            <Link
              to="/dashboard/profile"
              className={styles.navlink}
              onClick={handlesider}
            >
              <CgProfile className={styles.logo} />
              <span className={styles.span}>Profile</span>
            </Link>
          </li>
          <li className={styles.li}>
            <a href="#" className={styles.navlink} onClick={logout}>
              <MdLogout className={styles.logo} />
              <span className={styles.span}>Log out</span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
