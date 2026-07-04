import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Błąd aplikacji:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h2 className="text-xl font-semibold">Coś poszło nie tak.</h2>
            <button
              className="px-4 py-2 bg-black text-white rounded"
              onClick={() => this.setState({ hasError: false })}
            >
              Spróbuj ponownie
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
