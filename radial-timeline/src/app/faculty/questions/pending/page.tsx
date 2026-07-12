import { FacultyQuestionsListPage } from "@/components/layout/FacultyQuestionsListPage";
export default function FacultyPendingPage() {
  return <FacultyQuestionsListPage filterStatus="Pending" pageTitle="Pending Questions" pageDesc="Questions waiting for your response" />;
}
