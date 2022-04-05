import React from "react";
import styles from "../../css/home/contact.module.css";
import { BsArrowRight } from "react-icons/bs";
function Contact() {
  return (
    <>
      <section className={styles.section} id="about">
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.innerow}>
              <div className={styles.left}>
                <h3 className={styles.lefth3}>Who we are</h3>
                <h2 className={styles.lefth2}>
                  Income & Expense manegemnt is tool which help you to manage your income and expenses and its totally free.
                </h2>
                <p className={styles.leftp}>
                 It tracks and categorize all your expenses.it help you to analyse income and expenses using charts.its free and you can access your data from any device.try it now.
                </p>
                <div className={styles.topbtndiv}>
                  <a href='./signup' className={styles.btndiv}>
                    <span className={styles.span}>Sign up</span>
                    <BsArrowRight className={styles.arrow} />
                  </a>
                </div>
              </div>
            </div>
            <div className={styles.imgdiv}>
              <img
                src="./about.jpg"
                alt="contactpageimage"
                className={styles.img}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
