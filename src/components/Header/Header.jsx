import React from "react";
import "./header.scss";

export default function Header() {
  return (
    <header>
      <div className="header-container">
        <div className="logo">Phat Nguyen</div>
        <nav>
          <ul>
            <li>
              <a href="/">discover</a>
            </li>
            <li>
              <a href="/">product</a>
            </li>
            <li>
              <a href="/">solution</a>
            </li>
            <li>
              <a href="/">reach</a>
            </li>
            <li className="btn">
              <a href="/">order</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
