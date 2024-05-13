"use client";

import { useState } from "react";

const MonthylRevenue = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);

  const getCurrentDatePrefix = () => {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; // months from 1-12
    const monthPadded = month.toString().padStart(2, "0"); // Turns 1 into 01 (add 0 in the start until the length is 2)
    const year = dateObj.getUTCFullYear();

    const currentDatePrefix = year + "-" + monthPadded;
    console.log("current date prefix: ", currentDatePrefix);
    return currentDatePrefix;
  };

  const [datePrefix, setDatePrefix] = useState(getCurrentDatePrefix());

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/v1/revenues/monthly?date-prefix=" + datePrefix);
    if (!response.ok) {
      const errorMessage = await response.json();
      console.log(errorMessage);
    } else {
      const data = await response.json();
      setMonthlyRevenue(data);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="date-prefix">Select month:</label>
        <input
          type="month"
          id="date-prefix"
          name="date-prefix"
          value={datePrefix}
          max="2024-05"
          onChange={(e) => {
            setDatePrefix(e.target.value);
            console.log(e.target.value);
          }}
        />
        <br />
        <button type="submit">Get Monthly Revenue</button>
      </form>
      <div>Monthly Revenue: </div>
      {monthlyRevenue !== null && <>{monthlyRevenue}</>}
    </div>
  );
};

export default MonthylRevenue;
