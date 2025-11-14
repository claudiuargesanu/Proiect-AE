import { useState } from "react";
import Filters from "../components/Filters";
import Products from "../components/Products";
import DataSorting from "../components/DataSorting";

function Homepage() {
  const [filters, setFilters] = useState({
    category: "",
  });
  const [sorting, setSorting] = useState(1);

  return (
    <div className="homepageWrapper">
      <Filters setFilters={setFilters} />
      <div>
        <DataSorting setSorting={setSorting}/>
        <Products filters={filters} sorting={sorting}/>
      </div>
    </div>
  );
}

export default Homepage;
