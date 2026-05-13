export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto flex max-w-5xl flex-col gap-4">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          localStorage Kanban MVP
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Todo App
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-600">
          Next.js App Router、TypeScript、Tailwind CSS で構築する最小構成の
          カンバン型 ToDo アプリです。
        </p>
      </section>
    </main>
  );
}
