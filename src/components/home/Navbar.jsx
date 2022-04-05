import React from "react";
import { BiMenu } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import styles from "../../css/home/navbar.module.css";
import { useState, useRef,useEffect } from "react";
function Navbar() {
  const menudiv = useRef();
  const header = useRef();
  const [ison, setison] = useState(false);
  const menucontroller = () => {
    if (ison) {
      setison(false);
      menudiv.current.style.right = "-90%";
     
      
    }
    else {
      setison(true);
     
     menudiv.current.style.right = "0px";
    }
  }
  const handlescroll = () => {
    if (window.scrollY > 5) {
      header.current.style.boxShadow = "0px 2px 20px rgb(1 41 112 / 20%)";
    }
    else if (window.scrollY < 5) {
      header.current.style.boxShadow = "none";
    }
  }
  window.addEventListener('scroll', handlescroll);
  return (
    <>
      <header className={styles.header}
      
      ref={header} >
        <div className={styles.headerin}>
          <a href="/" className={styles.logodiv}>
            <img src="/wallet.png" alt="logo" className={styles.logo} />
            <a href='/' className={styles.logotext}>Income & Expenses</a>
          </a>
          <nav className={styles.nav} ref={menudiv}>
            <IoMdClose className={styles.close} onClick={menucontroller} />
            <ul className={styles.ul}>
              <li className={styles.li}>
                <a href="#" className={styles.a}>
                  Home
                </a>
              </li>
              <li className={styles.li}>
                <a href="#about" className={styles.a}>
                  About
                </a>
              </li>
              <li className={styles.li}>
                <a href="#services" className={styles.a}>
                  Services
                </a>
              </li>
              <li className={styles.li}>
                <a href="#contact" className={styles.a}>
                  Contact
                </a>
              </li>
              <li className={styles.li}>
                <a href="/signup" className={styles.btn}>
                  Sign up
                </a>
              </li>
            </ul>
          </nav>
          <BiMenu className={styles.menuicon} onClick={menucontroller} />
        </div>
      </header>
    </>
  );
}

export default Navbar;
