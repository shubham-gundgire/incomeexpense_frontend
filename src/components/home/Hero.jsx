import React from 'react'
import { BsArrowRight } from 'react-icons/bs';
import styles from '../../css/home/hero.module.css';
import { useState,useRef } from 'react';
function Hero() {
  
  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.left}>
              <h1 className={styles.lefth1}>
                The #1 tool to manage your Income and expenses.
              </h1>
              <h2 className={styles.lefth2}>
                Using income and expense management system you can track your
                income & expenses efectively.
              </h2>
              <a href='/signup' className={styles.btndiv}>
                <div className={styles.span}>Sign up</div>
                <BsArrowRight className={styles.arrow} />
              </a>
            </div>
            <div className={styles.heroimgdiv}>
              <img
                src="/hero.svg"
                alt="heroimg"
                className={styles.heroimg}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero