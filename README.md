# Todo App

ブラウザの `localStorage` のみで動作する、最小構成のカンバン型 ToDo アプリです。

1 つの固定ボードに `Todo` / `In Progress` / `Done` の 3 カラムを表示し、タスクの作成、一覧表示、編集、削除、ドラッグアンドドロップによるステータス変更ができます。保存先はブラウザ内の `localStorage` だけです。DB、API サーバー、認証、外部ストレージは使いません。

## 技術スタック

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- next-themes
- ESLint

## セットアップ

```bash
npm install
```

## 起動方法

開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

本番ビルドを確認する場合は、以下を実行します。

```bash
npm run build
npm run start
```

## 開発用コマンド

```bash
npm run lint
npm run build
```

## localStorage の仕様

このアプリはクライアント側でのみデータを保存します。

- 保存キー: `todo-app:kanban-state:v1`
- 保存内容: `{ tasks: Task[] }`
- 保存タイミング: タスク作成、編集、削除、ステータス変更後
- 読み込みタイミング: アプリ初回表示時

タスクの主な項目は以下です。

- `id`
- `title`
- `description`
- `status`
- `createdAt`
- `updatedAt`

## localStorage の注意点

- データは同じブラウザ、同じオリジン内にだけ保存されます。
- 別ブラウザ、別端末、別オリジンには同期されません。
- ブラウザのサイトデータ削除、プライベートブラウズ終了、開発中のストレージ削除などでデータは消えます。
- DB / API を使わないため、ユーザー認証、バックアップ、複数人共有はありません。
- 壊れた形式の保存データを読み込んだ場合は、空の状態として扱います。

保存データをリセットしたい場合は、ブラウザ DevTools の Application タブから `localStorage` の `todo-app:kanban-state:v1` を削除してください。

## 動作確認手順

1. `npm install` を実行する。
2. `npm run dev` を実行する。
3. http://localhost:3000 を開く。
4. `Todo` カラム内の入力欄からタスクを追加する。
5. 追加したタスクを編集できることを確認する。
6. タスクを別カラムへドラッグアンドドロップできることを確認する。
7. タスクを削除できることを確認する。
8. ページを再読み込みして、タスクが保持されていることを確認する。
9. テーマ切り替えボタンでライト / ダーク表示が切り替わることを確認する。

## 設計メモ

- `localStorage` の読み書きは `lib/storage.ts` に集約しています。
- ブラウザ API を使う処理は Client Component 側に限定しています。
- MVP では DB、API サーバー、外部ストレージ、状態管理ライブラリ、ドラッグアンドドロップ専用ライブラリは使っていません。