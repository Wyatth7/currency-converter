import React, { useEffect, useState } from "react";

import axios from "axios";

import city from "./../../images/arthur-osipyan-ApW5ueh85jY-unsplash.jpg";

const Converter = (props) => {
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const [count, setCount] = useState(0);

  const getConversionData = async () => {
    try {
      const data = await axios.get("/api/request/data/");
      setKeys(data.data.data.keys);
      setValues(data.data.data.values);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getConversionData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count < values.length - 1) {
        setCount(count + 1);
      } else {
        setCount(0);
      }
    }, 8000);
    return () => clearInterval(interval);
  });

  return (
    <div className="Convert">
      <img
        alt="New York City at night"
        className="video-foreground video-background"
        src={city}
      />
      <div className="name">
        <h1>Curringo</h1>
        <h4>Convert over 30 different currencies.</h4>
      </div>
      <div className="conversion-section">
        <div className="inputs">
          {/* Inject with real data later */}
          <h3 className="auto--from">USD</h3>
          <h3 className="auto--middle">to</h3>
          <h3 className="auto--to">{keys[count]}</h3>
        </div>
        <div className="auto-result">
          {/* Inject with real data later */}
          <h3>{values[count]}</h3>
        </div>
      </div>
    </div>
  );
};

export default Converter;
