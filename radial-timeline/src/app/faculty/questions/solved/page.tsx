import { FacultyQuestionsListPage } from "@/components/layout/FacultyQuestionsListPage";
export default function FacultySolvedPage() {
  return <FacultyQuestionsListPage filterStatus="Answered" pageTitle="Answered Questions" pageDesc="Questions you have successfully resolved" />;
}
