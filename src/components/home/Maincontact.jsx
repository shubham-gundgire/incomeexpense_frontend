import React, { useRef } from "react";
import styles from "../../css/home/maincontact.module.css";
import { GrLocation } from "react-icons/gr";
import { useState } from "react";
import { BsTelephone, BsClock } from "react-icons/bs";
import { GrMailOption } from "react-icons/gr";
import axios from "axios";
function Maincontact() {
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    subject: "",
    msg: "",
  });
  const [iserror, setiserror] = useState(false);
  const handleform = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };
  const namein = useRef();
  const emailin = useRef();
  const subjectin = useRef();
  const msgin = useRef();
  const handlesubmit = async () => {
    if (
      formdata.name.length != 0 &&
      formdata.email.length != 0 &&
      formdata.subject.length != 0 &&
      formdata.msg.length != 0
    ) {
      console.log("ok");
      setiserror(false);
      
      const data = await axios
        .post("https://glacial-shelf-00875.herokuapp.com/public/contact", {
          name: formdata.name,
          email: formdata.email,
          subject: formdata.subject,
          msg: formdata.msg,
        })
        .then((data) => {
          console.log("message sent succesfully");
        })
        .catch((e) => {
          console.log("error", e?.response);
        });
      setformdata({
        name: "",
        email: "",
        subject: "",
        msg: "",
      });
      namein.current.value = '';
      emailin.current.value = "";
      subjectin.current.value = "";
      msgin.current.value = "";
    } else {
      setiserror(true);
    }
  };

  return (
    <>
      <section className={styles.section} id="contact">
        <div className={styles.container}>
          <header className={styles.header}>
            <h2 className={styles.h2}>Contact</h2>
            <p className={styles.p}>Contact Us</p>
          </header>
          <div className={styles.row}>
            <div className={styles.up}>
              <div className={styles.addrescard}>
                <div className={styles.carddiv}>
                  <div className={styles.card}>
                    <GrLocation className={styles.icon} />
                    <h3 className={styles.h3}>Address</h3>
                    <p className={styles.ap}>
                      Sinhagad road <br></br>Pune, India 411009
                    </p>
                  </div>
                </div>

                <div className={styles.carddiv}>
                  <div className={styles.card}>
                    <BsTelephone className={styles.icon} />
                    <h3 className={styles.h3}>Call Us</h3>
                    <p className={styles.ap}>
                      +91 55890 55488 <br></br>
                      +91 55891 55488
                    </p>
                  </div>
                </div>
                <div className={styles.carddiv}>
                  <div className={styles.card}>
                    <GrMailOption className={styles.icon} />
                    <h3 className={styles.h3}>Email Us</h3>
                    <p className={styles.ap}>
                      info@income&expenses.com <br></br>
                      contact@income&expenses.com
                    </p>
                  </div>
                </div>
                <div className={styles.carddiv}>
                  <div className={styles.card}>
                    <BsClock className={styles.icon} />
                    <h3 className={styles.h3}>Open Hours</h3>
                    <p className={styles.ap}>
                      Monday - Friday <br></br>9:00AM - 05:00PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.formdiv}>
                <div className={styles.form}>
                  {iserror && (
                    <div className={styles.error}>please fill all details</div>
                  )}
                  <div className={styles.inputdiv1}>
                    <input
                      type="text"
                      placeholder="Your name"
                      className={styles.input}
                      onChange={handleform}
                      name="name"
                      ref={namein}
                    />
                  </div>
                  <div className={styles.inputdiv1}>
                    <input
                      type="email"
                      placeholder="Your email"
                      className={styles.input}
                      onChange={handleform}
                      name="email"
                      ref={emailin}
                    />
                  </div>
                  <div className={styles.inputdiv}>
                    <input
                      type="text"
                      placeholder="Subject"
                      className={styles.input}
                      onChange={handleform}
                      name="subject"
                      ref={subjectin}
                    />
                  </div>
                  <div className={styles.inputdiv}>
                    <textarea
                      rows="6"
                      className={styles.textarea}
                      placeholder="Message"
                      name="msg"
                      onChange={handleform}
                      ref={msgin}
                    ></textarea>
                  </div>
                  <div className={styles.btndiv}>
                    <div className={styles.errormessage}></div>
                    <button className={styles.btn} onClick={handlesubmit}>
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Maincontact;
