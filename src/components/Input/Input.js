import React, { useEffect, useState } from "react";

import axios from "axios";

const Input = (props) => {
  const [titles, setTitles] = useState([]);
  const [sendAmount, setSendAmount] = useState("");
  const [sendFrom, setSendFrom] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [resAmount, setResAmount] = useState("");
  const [resFrom, setResFrom] = useState("");
  const [resTo, setResTo] = useState("");
  const [topSelectBorderColor, settopSelectBorderColor] = useState(false);
  const [bottomSelectBorderColor, setBottomSelectBorderColor] = useState(false);
  const [conversionButtonClicked, setConversionButtonClicked] = useState(false);

  const getCurrencyTitles = async () => {
    try {
      const title = await axios.get("/api/request/data/title");
      setTitles(title.data.data.keys);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCurrencyTitles();
  }, []);

  const createTitleOptions = React.Children.toArray(
    titles.map((el) => {
      return <option value={`${el}`}>{el}</option>;
    })
  );

  const amountOnChangeHandler = (e) => {
    setSendAmount(e.target.value);
  };

  const topOptionSelectedHandler = (e) => {
    setSendFrom(e.target.value);
    settopSelectBorderColor(true);
  };

  const bottomOptionSelectedHandler = (e) => {
    setSendTo(e.target.value);
    setBottomSelectBorderColor(true);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const data = await axios.get("/api/request/data/query", {
        params: {
          base: sendFrom,
          symbols: sendTo,
          amount: sendAmount,
        },
      });

      setResAmount(data.data.data.amount);
      setResFrom(data.data.data.from);
      setResTo(data.data.data.to);

      setConversionButtonClicked(true);
    } catch (err) {}
  };

  return (
    <div className="Input">
      <form onSubmit={onSubmitHandler}>
        <input
          onChange={amountOnChangeHandler}
          className="from"
          type="text"
          placeholder="Amount"
          required
        />
        <select
          onChange={topOptionSelectedHandler}
          className={`from ${topSelectBorderColor ? "item-selected" : ""}`}
          name="currencies"
          defaultValue="Select a currency"
        >
          <option disabled value="Select a currency">
            Select a currency
          </option>
          {createTitleOptions}
        </select>
        <select
          onChange={bottomOptionSelectedHandler}
          className={`from ${bottomSelectBorderColor ? "item-selected" : ""}`}
          defaultValue="Select a currency"
          name="currencies"
        >
          <option disabled value="Select a currency">
            Select a currency
          </option>
          {createTitleOptions}
        </select>
        <div className="buttons">
          <button className="buttons--convert-submit">Convert</button>
          {conversionButtonClicked ? (
            <p className="amount">
              {sendAmount} {resFrom} is {resAmount} {resTo}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Input;
