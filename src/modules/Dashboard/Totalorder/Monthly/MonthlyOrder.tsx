"use client";

import { useState } from "react";

const MonthlyOrder = () => {
  const [monthlyOrder, setMonthlyOrder] = useState(null);

  const getCurrentDatePrefix = () => {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; // months from 1-12
    const monthPadded = month.toString().padStart(2, "0"); // Turns 1 into 01 (add 0 in the start until the length is 2)
    const year = dateObj.getUTCFullYear();

    const currentDatePrefix = year + "-" + monthPadded;
    return currentDatePrefix;
  };

  const [datePrefix, setDatePrefix] = useState(getCurrentDatePrefix());

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/v1/totalorder/monthly?date-prefix=" + datePrefix);
    if (!response.ok) {
      const errorMessage = await response.json();
      console.log(errorMessage);
    } else {
      const data = await response.json();
      setMonthlyOrder(data);
    }
  };

  return (
    <div>
      <h2 className="text-xl">Monthly Order</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="date-prefix">Select month:</label>
        <input
          type="month"
          id="date-prefix"
          name="date-prefix"
          value={datePrefix}
          max={getCurrentDatePrefix()}
          onChange={(e) => {
            setDatePrefix(e.target.value);
            console.log(e.target.value);
          }}
        />
        <br />
        <button type="submit">Get Monthly Order</button>
      </form>
      <div>Monthly Order: </div>
      {monthlyOrder !== null && <>{monthlyOrder}</>}
    </div>
  );
};

export default MonthlyOrder;
