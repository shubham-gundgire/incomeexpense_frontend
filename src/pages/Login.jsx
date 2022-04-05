import React from "react";
import styles from "../css/forms.module.css";
import { useState, useRef } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
function Login() {
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });
  const [iserror, setiserror] = useState(false);
  const [errormsg, seterrormsg] = useState("");
  const emailin = useRef();
  const passwordin = useRef();
  const handleform = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setiserror(false);
    if (
      formdata.email.length != 0 &&
      formdata.password.length >= 6 &&
      /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(formdata.email)
    ) {
      const data = await axios
        .post("https://glacial-shelf-00875.herokuapp.com/auth/login", {
          email: formdata.email,
          password: formdata.password,
        })
        .then(({ data }) => {
          console.log("ok");
          localStorage.setItem("token", data.token);
          window.location.href = "/dashboard";
          setformdata({
            email: "",
            password: "",
          });
          emailin.current.value = "";
          passwordin.current.value = "";
        })
        .catch((e) => {
          console.log("error while registering", e?.response);
          if (e?.response?.data?.code == "502") {
            setiserror(true);
            seterrormsg("invalid email or password");
          }
        });
    } else {
      console.log("error");
      setiserror(true);
      errorgenrator();
    }
  };
  const errorgenrator = () => {
    if (formdata.email.length == 0) {
      seterrormsg("please enter email");
    } else if (
      /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(formdata.email) != true
    ) {
      seterrormsg("please enter valid email address");
    } else if (formdata.password.length == 0) {
      seterrormsg("please enter password");
    } else if (formdata.password.length < 6) {
      seterrormsg("password must be contain 6 charchter");
    }
  };
  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.wraper}>
              <div className={styles.logodiv}>
                <a href="/" className={styles.linke}>
                  <img src="./wallet.png" alt="logo" className={styles.logo} />
                  <span className={styles.logotext}>Income & Expenses</span>
                </a>
              </div>
              <div className={styles.main}>
                <div className={styles.card}>
                  <div className={styles.up}>
                    <h5 className={styles.h5}>Login to Your Account</h5>
                    <p className={styles.p}>
                      Enter your username & password to login
                    </p>
                  </div>
                  <form className={styles.form}>
                    {iserror && <div className={styles.error}>{errormsg}</div>}
                    <div className={styles.inputdiv}>
                      <label className={styles.label}>Username</label>
                      <div className={styles.username}>
                        <input
                          type="text"
                          className={styles.input1}
                          name="email"
                          ref={emailin}
                          onChange={handleform}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className={styles.inputdiv}>
                      <label className={styles.label}>Password</label>
                      <input
                        type="password"
                        className={styles.input1}
                        name="password"
                        ref={passwordin}
                        onChange={handleform}
                      />
                    </div>

                    <div className={styles.inputdiv}>
                      <button className={styles.btn} onClick={handlesubmit}>
                        Login
                      </button>
                    </div>
                    <div className={styles.inputdiv}>
                      <p className={styles.ishave}>
                        Don't have account?
                        <a href="/signup" className={styles.signlink}>
                          Create an account
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
