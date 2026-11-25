"use client";
import DashboardProductTable from "@/components/DashboardProductTable";
import DashboardSidebar from "@/components/DashboardSidebar";
import React from "react";

const DashboardProducts = () => {
  return (
    <div className="bg-slate-50 flex justify-start max-w-screen-2xl mx-auto min-h-screen max-xl:flex-col">
      <DashboardSidebar />
      <DashboardProductTable />
    </div>
  );
};

export default DashboardProducts;
