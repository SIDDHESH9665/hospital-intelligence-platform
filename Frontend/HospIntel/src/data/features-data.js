import {
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";

export const featuresData = [
  {
    color: "blue",
    title: "Hospital Profiling",
    icon: DocumentMagnifyingGlassIcon,
    description:
      "Analyze key hospital metrics, patient demographics, and specialties to pinpoint strengths and improvement areas.",
    link: "/hospital-profiling",
  },
  {
    color: "green",
    title: "Hospital Impact Analysis",
    icon: ChartBarIcon,
    description:
      "Examine how policy, demographics, and tariff allocations influence hospital performance and community health.",
    link: "/hospital-impact-analysis",
  },
  {
    color: "gray",
    title: "Hospital Due Diligence",
    icon: ClipboardDocumentCheckIcon,
    description:
      "Assess hospital financials, compliance, quality, and risks for sound investment or partnership decisions.",
    link: "/hospital-due-diligence",
  },
];

export default featuresData;
