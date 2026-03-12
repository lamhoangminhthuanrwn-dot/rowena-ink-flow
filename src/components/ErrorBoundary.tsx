import React from "react";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
    toast.error("Đã xảy ra lỗi. Vui lòng tải lại trang.");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground">
          <h2 className="text-xl font-semibold">Đã xảy ra lỗi</h2>
          <p className="text-muted-foreground">Vui lòng tải lại trang để tiếp tục.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            Tải lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
