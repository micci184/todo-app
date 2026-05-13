import { AppShell } from "@/components/AppShell";
import { KanbanBoard } from "@/components/KanbanBoard";

export default function Home() {
  return (
    <AppShell>
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            1 ボード固定のカンバン型 ToDo アプリ
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            まずは小さく動く MVP を作ります
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            保存先はブラウザの localStorage のみです。DB、API
            サーバー、認証、外部ストレージは使わず、Client Component
            側で保存処理を扱う設計にします。
          </p>
        </div>
      </section>
      <KanbanBoard />
    </AppShell>
  );
}
