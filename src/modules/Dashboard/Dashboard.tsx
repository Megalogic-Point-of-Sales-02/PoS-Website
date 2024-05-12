import Customers from "./Customers/Customers";
import Orders from "./Orders/Orders";
import Products from "./Products/Products";

const Dashboard = () => {
  return (
    <>
      <h1 className="text-2xl">Dashboard</h1>
      <h2 className="text-xl">Customer List</h2>
      <Customers />

      <h2 className="text-xl">Order List</h2>
      <Orders />

      <h2 className="text-xl">Product List</h2>
      <Products />
    </>
  );
};

export default Dashboard;
