interface Props {
  children: React.ReactNode;
}

export const Container = ({ children }: Props) => (
  <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    {children}
  </main>
);
