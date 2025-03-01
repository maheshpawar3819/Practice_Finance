import React, { useEffect, useState } from "react";
import "./WhoWerAre.css";

const WhoWeAre = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
           (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div className="whoweare">
      <button onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
      </button>

      <h1 className="headerwhoweare">Who Are We?</h1>

      <section className="whoweare-intro">
        <p>
          Welcome to FinanceShastra, your ultimate partner in mastering the art of personal finance and investment...
        </p>

        <div className="whoweare-mission">
          <h2>Our Mission</h2>
          <p>
            At FinanceShastra, our mission is to simplify financial decision-making for millions of Indians...
          </p>
        </div>

        <div className="whoweare-vision">
          <h2>Our Vision</h2>
          <p>
            We envision a future where every Indian is equipped with the confidence and knowledge...
          </p>
        </div>

        <section className="whoweare-key-points">
          <h2>What Sets Us Apart?</h2>
          <ul>
            <li><strong>Expert Insights:</strong> Our team comprises seasoned financial analysts...</li>
            <li><strong>Comprehensive Solutions:</strong> We offer a wide range of services...</li>
            <li><strong>Data-Driven Tools:</strong> Our advanced analytics platforms...</li>
            <li><strong>Education First:</strong> We simplify complex concepts...</li>
            <li><strong>Community-Oriented:</strong> Through collaboration...</li>
          </ul>
        </section>

        <div className="whoweare-approach">
          <h2>Our Approach</h2>
          <p>
            Combining traditional financial principles with modern analytical techniques...
          </p>
        </div>

        <div className="whoweare-team">
          <h2>The FinanceShastra Team</h2>
          <p>
            Our team is the backbone of our success...
          </p>
        </div>

        <section className="whoweare-call-to-action">
          <h2>Join Us Today</h2>
          <p>
            Take the first step toward a secure and prosperous financial future...
          </p>
          <h4>Let’s build your financial success story — together.</h4>
        </section>
      </section>
    </div>
  );
};

export default WhoWeAre;
