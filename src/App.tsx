import TenSecondTap from '../games/TenSecondTap';
import TicTacToe from '../games/TicTacToe';

export default function App() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <a href="/" className="text-base font-semibold text-gray-900 no-underline">
            404 Game Test
          </a>
          <nav className="text-sm text-gray-500">
            <span>ホーム</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <article className="space-y-8">
          <header className="space-y-3 border-b border-gray-200 pb-8">
            <p className="text-sm font-medium text-gray-400">404 Not Found</p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              ページが見つかりません
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              お探しのページは存在しないか、移動した可能性があります。
            </p>
          </header>

          <section className="space-y-8">
            <TicTacToe />
            <TenSecondTap />
          </section>
        </article>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 text-center text-xs text-gray-400">
          © 2026 404 Game Test
        </div>
      </footer>
    </div>
  );
}
