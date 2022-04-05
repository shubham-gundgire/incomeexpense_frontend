import React, { useState, useRef } from "react";
import styles from "../../css/dashboard/profile.module.css";

import {
  AiOutlineTwitter,
  AiFillFacebook,
  AiFillInstagram,
  AiFillLinkedin,
  AiOutlineUpload,
  AiFillDelete,
} from "react-icons/ai";
import axios from "axios";
import { userdata } from "../atoms";
import { useRecoilState } from "recoil";
import { useOutletContext } from "react-router-dom";
axios.defaults.withCredentials = true;
function Profile() {
  const [isdataload, setisdataload] = useState(false);
  const [currstate, setcurrstate] = useState(1);
   const { getdata} = useOutletContext();
  const [data, setdata] = useRecoilState(userdata);

  const handleoverview = () => {
    setcurrstate(1);
  };
  const handleuppro = () => {
    console.log(2);
    setcurrstate(2);
  };
  const handlechngpass = () => {
    setcurrstate(3);
  };
  const currpass = useRef();
  const pass = useRef();
  const repass = useRef();
  const nameref = useRef();
  const aboutref = useRef();
  const tref = useRef();
  const fref = useRef();
  const iref = useRef();
  const lref = useRef();
  const [cform, setcform] = useState({
    current_pass: "",
    password: "",
    repassword: "",
  });
  const [userform, setuserform] = useState({
    name: '',
    about: '',
    twitterpro:'',
    facebookpro: '',
    instapro: '',
    linkedpro: '',
  });
  const handleuserform = (e) => {
    setuserform({ ...userform, [e.target.name]: e.target.value });
  }
  const handleform = (e) => {
    setcform({ ...cform, [e.target.name]: e.target.value });
  };
  const [iserror, setiserror] = useState(false);
  const [errormsg, seterrormsg] = useState("");
const [isuerror, setisuerror] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();

    setiserror(false);
    if (
      cform.current_pass.length !== 0 &&
      cform.password.length !== 0 &&
      cform.repassword.length !== 0 &&
      cform.password === cform.repassword
    ) {
const mytoken = localStorage.getItem("token");
      const data = await axios
        .post(
          "https://glacial-shelf-00875.herokuapp.com/private/resetpass",
          {
            current_pass: cform.current_pass,
            new_pass: cform.password,
          },
          {
            headers: {
              Authorization: mytoken,
            },
          }
        )
        .then((data) => {
          console.log("password changed");
          setcform({
            current_pass: "",
            password: "",
            repassword: "",
          });
          currpass.current.value = "";
          pass.current.value = "";
          repass.current.value = "";
          setcurrstate(1);
        })
        .catch((e) => {
          console.log("error password", e?.response?.data);
          if (e?.response?.data?.code == "503") {
            setiserror(true);
            seterrormsg("invalid current password");
          }
        });
    } else {
      console.log("error");
      setiserror(true);
      errorgenrator();
    }
  };
  const submituserdata = async (e) => {
    e.preventDefault();
    setisuerror(false);
    if (userform.name.length != 0 &&
      userform.about.length != 0 &&

      userform.twitterpro.length != 0 &&
      userform.instapro.length != 0 && 
      userform.linkedpro.length != 0 && 
      userform.facebookpro.length != 0) {
const mytoken = localStorage.getItem("token");
     const data = await axios
       .post(
         "https://glacial-shelf-00875.herokuapp.com/private/userdata",
         {
           name: userform.name,
           about: userform.about,
           twitterpro: userform.twitterpro,
           facebookpro: userform.facebookpro,
           instapro: userform.instapro,
           linkedpro: userform.linkedpro,
         },
         {
           headers: {
             Authorization: mytoken,
           },
         }
       )
       .then((data) => {
         console.log("user data updated");
         getdata();
         setcurrstate(1);
       })
       .catch((e) => {
         console.log("error password", e.response.data);
       });
    }
    else {
            console.log("error");
      setisuerror(true);
      usererror();
    }
  }
  const errorgenrator = () => {
    if (cform.current_pass.length === 0) {
      seterrormsg("please enter current password");
    } else if (cform.password.length === 0) {
      seterrormsg("please enter  password");
    } else if (cform.repassword.length == 0) {
      seterrormsg("please re-enter  password");
    } else if (cform.repassword !== cform.password) {
      seterrormsg("password doesnt match");
    }
  };
  const usererror = () => {
    if (userform.name.length === 0) {
      seterrormsg("please enter name");
    } else if (userform.about.length === 0) {
      seterrormsg("please fill  about field");
    } else if (userform.twitterpro.length === 0) {
      seterrormsg("please enter twitter link");
    } else if (userform.instapro.length === 0) {
      seterrormsg("please enter instagram link");
    } else if (userform.linkedpro.length === 0) {
      seterrormsg("please enter linkedin link");
    } else if (userform.facebookpro.length === 0) {
      seterrormsg("please enter facebook link");
    }
  }

  if (data && !isdataload) {
  setuserform({
    name: data?.userdata?.name,
    about: data?.userdata?.about,
    twitterpro: data?.userdata?.twitterpro,
    facebookpro: data?.userdata?.facebookpro,
    instapro: data?.userdata?.instapro,
    linkedpro: data?.userdata?.linkedpro,
  });
    setisdataload(true)
}

  return (
    <>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.h1}>Profile</h1>

          <nav className={styles.nav}>
            <ol className={styles.ol}>
              <li className={styles.li}>Home</li>
              <li className={styles.li}>/ users</li>
              <li className={styles.li}>/ profile</li>
            </ol>
          </nav>
        </div>
        <section className={styles.section}>
          <div className={styles.div1}>
            <div className={styles.colx1}>
              <div className={styles.card}>
                <div className={styles.cardbody}>
                  <div className={styles.profileimg}>
                    {data?.userdata?.email.charAt(0)}
                  </div>
                  <h2 className={styles.h2}>shubham gundgire</h2>
                  <div className={styles.links}>
                    <a href="https://twitter.com">
                      {" "}
                      <AiOutlineTwitter className={styles.icon} />
                    </a>
                    <a href="https://facebook.com">
                      <AiFillFacebook className={styles.icon} />
                    </a>
                    <a href="https://instagram.com">
                      <AiFillInstagram className={styles.icon} />
                    </a>
                    <a href="https://linkedin.com">
                      <AiFillLinkedin className={styles.icon} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.down}>
              <div className={styles.card2}>
                <div className={styles.cardbody2}>
                  <ul className={styles.ul2}>
                    <li className={styles.li2}>
                      <button className={styles.btn} onClick={handleoverview}>
                        Overview
                      </button>
                    </li>
                    <li className={styles.li2}>
                      <button className={styles.btn} onClick={handleuppro}>
                        Edit profile
                      </button>
                    </li>
                    <li className={styles.li2}>
                      <button className={styles.btn} onClick={handlechngpass}>
                        Change Password
                      </button>
                    </li>
                  </ul>
                  {currstate === 1 && (
                    <div className={styles.details}>
                      <div className={styles.info}>
                        <h5 className={styles.about}>About</h5>
                        <p className={styles.desc}>
                          {data?.userdata?.about
                            ? data.userdata.about
                            : "No Data"}
                        </p>
                        <h5 className={styles.about}>Profile Details</h5>
                        <div className={styles.row}>
                          <div className={styles.key}>Full Name</div>
                          <div className={styles.value}>
                            {data?.userdata?.name
                              ? data.userdata.name
                              : "No Data"}
                          </div>
                        </div>
                        <div className={styles.row}>
                          <div className={styles.key}>Email</div>
                          <div className={styles.value}>
                            {data?.userdata?.email
                              ? data.userdata.email
                              : "No Data"}
                          </div>
                        </div>
                        <div className={styles.row}>
                          <div className={styles.key}>Country</div>
                          <div className={styles.value}>India</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {currstate === 2 && (
                    <div className={styles.details}>
                      <div className={styles.formdiv}>
                        <form className={styles.form}>
                          {isuerror && (
                            <div className={styles.error}>{errormsg}</div>
                          )}
                          <div className={styles.rows}>
                            <label className={styles.label}>Full Name</label>
                            <div className={styles.inputdivs}>
                              <input
                                type="text"
                                className={styles.input}
                                ref={nameref}
                                onChange={handleuserform}
                                name="name"
                                value={userform.name}
                              />
                            </div>
                          </div>
                          <div className={styles.rows}>
                            <label className={styles.label}>About</label>
                            <textarea
                              className={styles.input}
                              ref={aboutref}
                              onChange={handleuserform}
                              name="about"
                              value={userform.about}
                            />
                          </div>

                          <div className={styles.rows}>
                            <label className={styles.label}>
                              Twitter Profile
                            </label>
                            <div className={styles.inputdivs}>
                              <input
                                type="text"
                                className={styles.input}
                                ref={tref}
                                onChange={handleuserform}
                                name="twitterpro"
                                value={userform.twitterpro}
                              />
                            </div>
                          </div>
                          <div className={styles.rows}>
                            <label className={styles.label}>
                              Facebook Profile
                            </label>
                            <div className={styles.inputdivs}>
                              <input
                                type="text"
                                className={styles.input}
                                ref={fref}
                                onChange={handleuserform}
                                name="facebookpro"
                                value={userform.facebookpro}
                              />
                            </div>
                          </div>
                          <div className={styles.rows}>
                            <label className={styles.label}>
                              Instagram Profile
                            </label>
                            <div className={styles.inputdivs}>
                              <input
                                type="text"
                                className={styles.input}
                                ref={iref}
                                onChange={handleuserform}
                                name="instapro"
                                value={userform.instapro}
                              />
                            </div>
                          </div>
                          <div className={styles.rows}>
                            <label className={styles.label}>
                              Linkedin Profile
                            </label>
                            <div className={styles.inputdivs}>
                              <input
                                type="text"
                                className={styles.input}
                                ref={lref}
                                onChange={handleuserform}
                                name="linkedpro"
                                value={userform.linkedpro}
                              />
                            </div>
                          </div>
                          <div className={styles.submitbtn}>
                            <button
                              className={styles.finalbtn}
                              onClick={submituserdata}
                            >
                              Save changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  {currstate === 3 && (
                    <div className={styles.details}>
                      <div className={styles.formdiv}>
                        <div className={styles.form}>
                          {iserror && (
                            <div className={styles.error}>{errormsg}</div>
                          )}
                          <div className={styles.rows}>
                            <label className={styles.label}>
                              Current password
                            </label>
                            <div className={styles.inputdivs}>
                              <input
                                type="password"
                                className={styles.input}
                                ref={currpass}
                                onChange={handleform}
                                name="current_pass"
                              />
                            </div>
                          </div>
                          <div className={styles.rows}>
                            <label className={styles.label}>New password</label>
                            <div className={styles.inputdivs}>
                              <input
                                type="password"
                                className={styles.input}
                                ref={pass}
                                onChange={handleform}
                                name="password"
                              />
                            </div>
                          </div>
                          <div className={styles.rows}>
                            <label className={styles.label}>
                              Re-enter New Password
                            </label>
                            <div className={styles.inputdivs}>
                              <input
                                type="password"
                                className={styles.input}
                                ref={repass}
                                onChange={handleform}
                                name="repassword"
                              />
                            </div>
                          </div>
                          <div className={styles.submitbtn}>
                            <button
                              className={styles.finalbtn}
                              onClick={handlesubmit}
                            >
                              Change password
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Profile;
