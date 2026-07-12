import { QuestionsListPage } from "@/components/layout/QuestionsListPage";
export default function SolvedQuestionsPage() {
  return <QuestionsListPage filterStatus="Answered" pageTitle="Solved Questions" pageDesc="Questions that have been answered by faculty" />;
}
