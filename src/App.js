import { Link } from "react-router-dom";
import Navbar from "./components/home/Navbar";
import Hero from './components/home/Hero';
import Contact from "./components/home/Contact";
import styles from './css/home/app.module.css';
import Services from "./components/home/Services";
import Maincontact from "./components/home/Maincontact";
import Footer from "./components/home/Footer";
function App() {
  return (
    <>
      <main className={styles.main}>
        <Navbar />
        <Hero />
        <Contact />
        <Services />
        <Maincontact id="contact"/>
        <Footer/>
     </main>
    </>
  );
}

export default App;
