type GameHeaderProps = {
  title: string;
  subtitle?: string;
};

export function GameHeader({ title, subtitle }: GameHeaderProps) {
  return (
    <header className="shrink-0 border-b border-gray-100 pb-4 text-center">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      {subtitle ? (
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      ) : null}
    </header>
  );
}
