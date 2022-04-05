import React from "react";
import { ImStatsBars } from "react-icons/im";
import { BiMoney, BiCategory } from "react-icons/bi";
import { CgNotes } from 'react-icons/cg';
import styles from '../../css/home/services.module.css';
function Services() {
  return (
    <>
      <section className={styles.section} id="services">
        <div className={styles.container}>
          <div className={styles.up}>
            <h2 className={styles.h2}>Services</h2>
            <p className={styles.p}>
              Income and Expenses manegment provide you bunch of services.you
              can track your expenses according to different category and its
              totally free. analyse your data using charts and many more
              features.
            </p>
          </div>
          <div className={styles.down}>
            <div className={styles.downdown}>
              <div className={styles.card}>
                <div className={styles.icondiv}>
                  <CgNotes className={styles.icon} />
                </div>
                <h4 className={styles.h4}>Effective management </h4>
                <p className={styles.p2}>
                  it's now easier to track your expenses than ever before.track
                  your income and expenses effectivly
                </p>
              </div>
            </div>
            <div className={styles.downdown}>
              <div className={styles.card}>
                <div className={styles.icondiv}>
                  <BiCategory className={styles.icon1} />
                </div>
                <h4 className={styles.h4}>Categories your expenses</h4>
                <p className={styles.p2}>
                  you can organize your expenses by categories, like
                  travel,food,shoping etc.
                </p>
              </div>
            </div>
            <div className={styles.downdown}>
              <div className={styles.card}>
                <div className={styles.icondiv}>
                  <BiMoney className={styles.icon2} />
                </div>
                <h4 className={styles.h4}>Its is FREE</h4>
                <p className={styles.p2}>
                  Income and expense manegement tool is totaly free.you can
                  access different tools without any charges.
                </p>
              </div>
            </div>
            <div className={styles.downdown}>
              <div className={styles.card}>
                <div className={styles.icondiv}>
                  <ImStatsBars className={styles.icon3} />
                </div>
                <h4 className={styles.h4}>Analyse Data</h4>
                <p className={styles.p2}>
                  Income and expense management system help you to analyse your
                  income and expenses using charts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
