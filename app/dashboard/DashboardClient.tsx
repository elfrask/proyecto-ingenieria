"use client";
import dynamic from "next/dynamic";

const MapDashboard = dynamic(() => import("../../components/map-dashboard"), {
  loading: () => <p>loading...</p>,
  ssr: false,
});

export default function DashboardClient() {
  return <MapDashboard />;
}