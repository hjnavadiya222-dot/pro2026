"use client";

import {
  GraduationCap,
  BookOpen,
  Cpu,
  Globe,
  Lightbulb,
  Code2,
  Users,
  Star,
  Award,
  Brain,
  FlaskConical,
  Network,
  Layers,
  Microscope,
  MonitorSmartphone,
  Database,
  ShieldCheck,
  Wifi,
  PenTool,
  Clock,
  UserCheck,
} from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Prof. (Dr.) Mita Parikh",
    date: "25 Years",
    content:
      "Professor & Head of Department | Ph.D. (Computer Engineering) | Email: mita.parikh@scet.ac.in",
    category: "Professor",
    icon: Star,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Prof. (Dr.) Vivaksha Jariwala",
    date: "22 Years",
    content:
      "Professor | Ph.D. (Computer Engineering) | Convener IT Solutions & Web Committee | Email: vivaksha.jariwala@scet.ac.in",
    category: "Professor",
    icon: Globe,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 3,
    title: "Prof. (Dr.) Dhruti Sharma",
    date: "19+ Years",
    content:
      "Associate Professor | Ph.D. (Computer Engineering) | Email: dhruti.sharma@scet.ac.in",
    category: "Associate Professor",
    icon: Brain,
    relatedIds: [1, 2, 4],
    status: "completed" as const,
    energy: 88,
  },
  {
    id: 4,
    title: "Prof. Hiren H. Vavaiya",
    date: "20 Years",
    content:
      "Assistant Professor | M.Tech (Computer Science & Engineering) | Email: hiren.vavaiya@scet.ac.in",
    category: "Assistant Professor",
    icon: Cpu,
    relatedIds: [3, 5],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 5,
    title: "Prof. Tushar Gohil",
    date: "19 Years",
    content:
      "Assistant Professor | M.Tech (Computer Science & Engineering) | Email: tushar.gohil@scet.ac.in",
    category: "Assistant Professor",
    icon: Code2,
    relatedIds: [4, 6],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 6,
    title: "Prof. Ashish Kharwar",
    date: "18 Years",
    content:
      "Assistant Professor | M.Tech (Computer Science & Engineering) | Email: ashish.kharwar@scet.ac.in",
    category: "Assistant Professor",
    icon: Layers,
    relatedIds: [5, 9],
    status: "completed" as const,
    energy: 80,
  },
  {
    id: 7,
    title: "Prof. Apurva Mandalaywala",
    date: "19 Years",
    content:
      "Assistant Professor | M.Tech (Communication Eng.), MBA (Gold Medallist), MA (Economics) | Email: apurva.mandalaywala@scet.ac.in",
    category: "Assistant Professor",
    icon: Network,
    relatedIds: [8, 14],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 8,
    title: "Prof. Bhumika Patel",
    date: "16 Years",
    content:
      "Assistant Professor | B.E. IT, M.Tech Computer (Gold Medalist) | Email: bhumika.patel@scet.ac.in",
    category: "Assistant Professor",
    icon: Award,
    relatedIds: [7, 11],
    status: "completed" as const,
    energy: 75,
  },
  {
    id: 9,
    title: "Prof. (Dr.) Ankit Kharwar",
    date: "12 Years",
    content:
      "Assistant Professor | Ph.D. (Computer Engineering) | 7 Months Industry | Email: ankit.kharwar@scet.ac.in",
    category: "Assistant Professor",
    icon: FlaskConical,
    relatedIds: [6, 10],
    status: "completed" as const,
    energy: 65,
  },
  {
    id: 10,
    title: "Prof. Ankit D. Patel",
    date: "10 Years",
    content:
      "Assistant Professor | M.E., Ph.D. (Pursuing) | Email: ankit.patel@scet.ac.in",
    category: "Assistant Professor",
    icon: BookOpen,
    relatedIds: [9, 13],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 11,
    title: "Prof. Karishma H. Desai",
    date: "8 Years",
    content:
      "Assistant Professor | M.E. (Computer) | Email: karishma.desai@scet.ac.in",
    category: "Assistant Professor",
    icon: Lightbulb,
    relatedIds: [8, 12],
    status: "in-progress" as const,
    energy: 55,
  },
  {
    id: 12,
    title: "Prof. Palak Desai",
    date: "13+ Years",
    content:
      "Assistant Professor | B.E. (IT), M.E. (Computer Engineering) | Email: palak.desai@scet.ac.in",
    category: "Assistant Professor",
    icon: MonitorSmartphone,
    relatedIds: [11, 13],
    status: "completed" as const,
    energy: 70,
  },
  {
    id: 13,
    title: "Prof. (Dr.) Mitali H. Desai",
    date: "10 Years",
    content:
      "Assistant Professor | Ph.D. (Computer Engineering) | Email: mitali.desai@scet.ac.in",
    category: "Assistant Professor",
    icon: Microscope,
    relatedIds: [10, 12],
    status: "completed" as const,
    energy: 60,
  },
  {
    id: 14,
    title: "Prof. Nitya Komalan",
    date: "8 Years",
    content:
      "Assistant Professor | M.E. (Computer Engineering) | 5 Yrs Academic + 3 Yrs Industry | Email: nitya.komalan@scet.ac.in",
    category: "Assistant Professor",
    icon: Wifi,
    relatedIds: [7, 15],
    status: "in-progress" as const,
    energy: 55,
  },
  {
    id: 15,
    title: "Prof. (Dr.) Vivek Champaneria",
    date: "10 Years",
    content:
      "Assistant Professor | Ph.D. (Computer Engineering) | Email: vivek.champaneria@scet.ac.in",
    category: "Assistant Professor",
    icon: Database,
    relatedIds: [14, 16],
    status: "completed" as const,
    energy: 60,
  },
  {
    id: 16,
    title: "Dr. Krishna S. Delvadia",
    date: "9 Years",
    content:
      "Assistant Professor | Ph.D. (Computer Engineering) | Email: krishna.delvadia@scet.ac.in",
    category: "Assistant Professor",
    icon: ShieldCheck,
    relatedIds: [15, 17],
    status: "completed" as const,
    energy: 58,
  },
  {
    id: 17,
    title: "Prof. Mitul Patel",
    date: "10 Years",
    content:
      "Assistant Professor | M.Tech (Information Technology), Ph.D. (Pursuing) | Email: mitul.patel@scet.ac.in",
    category: "Assistant Professor",
    icon: GraduationCap,
    relatedIds: [16, 18],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 18,
    title: "Dr. Vibha Patel",
    date: "15 Years",
    content:
      "Assistant Professor | Ph.D. (Computer Engineering) | Email: vibha.patel@scet.ac.in",
    category: "Assistant Professor",
    icon: Users,
    relatedIds: [17, 19],
    status: "completed" as const,
    energy: 72,
  },
  {
    id: 19,
    title: "Prof. Dhaval J. Rana",
    date: "12+ Years",
    content:
      "Assistant Professor | B.E. (CE), M.E. (IT), Ph.D. (Pursuing) | Email: dhaval.rana@scet.ac.in",
    category: "Assistant Professor",
    icon: PenTool,
    relatedIds: [18, 20],
    status: "in-progress" as const,
    energy: 65,
  },
  {
    id: 20,
    title: "Ms. Dhyani Joshi",
    date: "3 Years",
    content:
      "Assistant Professor (Contractual) | M.Tech Computer Science | Email: dhyani.joshi@scet.ac.in",
    category: "Contractual",
    icon: Clock,
    relatedIds: [19, 21],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 21,
    title: "Dr. Mahesh Trivedi",
    date: "15 Years",
    content:
      "Assistant Professor | Ph.D. | Email: mahesh.trivedi@scet.ac.in",
    category: "Assistant Professor",
    icon: UserCheck,
    relatedIds: [20, 1],
    status: "completed" as const,
    energy: 72,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none">
        <h1 className="text-white text-2xl font-bold tracking-widest uppercase">
          IT Department — SCET
        </h1>
        <p className="text-white/50 text-xs mt-1 tracking-wider">
          Faculty Constellation · Click a node to explore
        </p>
      </div>

      <RadialOrbitalTimeline timelineData={timelineData} />
    </div>
  );
}

export default RadialOrbitalTimelineDemo;
