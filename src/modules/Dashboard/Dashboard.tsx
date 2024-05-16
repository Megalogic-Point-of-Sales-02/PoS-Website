import MonthylRevenue from "./Revenues/Monthly/MonthylRevenue";

const Dashboard = () => {
  return (
    <>
      <h1 className="text-2xl">Dashboard</h1>

      <h2 className="text-xl">Monthly Revenue</h2>
      <MonthylRevenue />
    </>
  );
};

export default Dashboard;
