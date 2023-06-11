import React from 'react';
import { FaLinkedin, FaGithub ,FaPhone,  FaMailBulk} from 'react-icons/fa'
import './Footer.css';
import img from './me.jpg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <p className="footer-text">Made with love... 🤍</p>
          <p className="footer-text name">Mohammad Alshraideh</p>
          <img src={img} alt="Profile" className="profile-image" />
        </div>

        <div className="contact-info">
          <p className="footer-text">Contact:</p>
          <div className="personal-info">
            <p className="footer-text">Email <FaMailBulk/> : mhmd.shrydh1996@gmail.com</p>
            <p className="footer-text"> Phone <FaPhone/> :  +962 795 95 6190</p>
          </div>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/mohammad-alshraideh/" className="social-link">
            <FaLinkedin /> LinkedIn
            </a>
            <a href="https://github.com/mohammadsh96" className="social-link">
            <FaGithub /> GitHub
            </a>
          </div>
        </div>
      </div>
      <p className="footer-text">&copy; 2023 Copy rights</p>
    </footer>
  );
};

export default Footer;
