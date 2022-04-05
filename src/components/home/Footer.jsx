import React from 'react'
import styles from '../../css/home/footer.module.css';
function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div>
          © Copyright <span className={styles.span}> Income & Expense.</span> All Rights
          Reserved
        </div>
      </footer>
    </>
  );
}

export default Footer