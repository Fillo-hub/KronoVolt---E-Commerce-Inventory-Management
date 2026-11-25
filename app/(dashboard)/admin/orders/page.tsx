"use client";
import AdminOrders from "@/components/AdminOrders";
import DashboardSidebar from "@/components/DashboardSidebar";
import React from "react";

const DashboardOrdersPage = () => {
  return (
    <div className="bg-slate-50 flex justify-start max-w-screen-2xl mx-auto min-h-screen max-xl:flex-col">
      <DashboardSidebar />
      <AdminOrders />
    </div>
  );
};

export default DashboardOrdersPage;
