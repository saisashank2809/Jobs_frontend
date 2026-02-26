import type { Metadata } from "next";
import RobotDemoClient from "./robot-client";

export const metadata: Metadata = {
    title: "Interactive 3D Robot Demo",
    description: "Experience the Ottobon 3D robot directly in your browser.",
    alternates: {
        canonical: "/robot-demo",
    },
    openGraph: {
        title: "Interactive 3D Robot Demo | Ottobon",
        description: "Experience the Ottobon 3D robot directly in your browser.",
        url: "/robot-demo",
    },
};

export default function RobotDemoPage() {
    return <RobotDemoClient />;
}
