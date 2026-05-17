import { AppShell } from "@/components/AppShell";
import { KanbanBoard } from "@/components/KanbanBoard";

export default function Home() {
  return (
    <AppShell>
      <KanbanBoard />
    </AppShell>
  );
}
