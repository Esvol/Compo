import React from 'react'
import { Link } from 'react-router-dom'
import styles from './index.module.scss'
import { GiCompanionCube } from "react-icons/gi";

const Verification = () => {
  return (
    <div className={styles.root}>
        <div>
            <GiCompanionCube fontSize={80}/>
            <GiCompanionCube fontSize={80}/>
            <GiCompanionCube fontSize={80}/>
        </div>
        <p>
            Thank you for your interest in joining our community! 
            Before you get started, we need to verify your legitimacy to register your company on our site. 
            You will receive a response via email within a few hours. 
            Once verified, you can log in and continue exploring our platform.
        </p>
        <Link to={'/dashboard'} style={{textDecoration: 'none'}}>RETURN HOME</Link>
        <div>
            <GiCompanionCube fontSize={80}/>
            <GiCompanionCube fontSize={80}/>
            <GiCompanionCube fontSize={80}/>
        </div>
    </div>
  )
}

export default Verification