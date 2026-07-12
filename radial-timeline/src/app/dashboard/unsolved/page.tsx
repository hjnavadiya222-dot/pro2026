import { QuestionsListPage } from "@/components/layout/QuestionsListPage";
export default function UnsolvedQuestionsPage() {
  return <QuestionsListPage filterStatus="Pending" pageTitle="Pending Questions" pageDesc="Questions awaiting faculty response" />;
}
