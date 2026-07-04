interface Props {
  children: React.ReactNode;
}

export const Container = ({ children }: Props) => (
  <main className="w-full max-w-screen-2xl mx-auto px-4">
    {children}
  </main>
);
