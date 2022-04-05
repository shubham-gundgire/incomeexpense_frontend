import React, { useState } from "react";
import styles from "../../css/dashboard/navbard.module.css";
import { AiOutlineMenu, AiOutlineCaretDown } from "react-icons/ai";
import { refsidebar,ison,userdata } from "../atoms";
import { useRecoilState } from "recoil";

function Navbard() {
  const [refer, userefer] = useRecoilState(refsidebar);
    const [data, setdata] = useRecoilState(userdata);
const [refer1,userfer1]=useRecoilState(ison);

  const handlemenu = () => {
    
    if (window.innerWidth < 1200) {
      if (!refer1) {
        refer.style.left = "0px";
       
      } else if(refer) {
        refer.style.left = "-350px";
       
      }
   }

  };
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logodiv}>
          <a href="/dashboard" className={styles.logoindiv}>
            <img src="/wallet.png" alt="logo" className={styles.logo} />
            <span className={styles.logotext}>Income and Expenses</span>
          </a>
          <div className={styles.menubtndiv}>
            <AiOutlineMenu className={styles.menubtn} onClick={handlemenu} />
          </div>
        </div>
        <div className={styles.profilediv}>
          <a href="/dashboard/profile" className={styles.profile}>
            <div className={styles.profileimg}>{data?.userdata?.email.charAt(0)}</div>
            <span className={styles.profiledivname}>
              {data?.userdata?.email}
              <AiOutlineCaretDown className={styles.dropd} />
            </span>
          </a>
        </div>
      </header>
    </>
  );
}

export default Navbard;
