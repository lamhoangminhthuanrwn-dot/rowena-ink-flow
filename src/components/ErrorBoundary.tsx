import React from "react";
import { Button } from "@/components/ui/button";
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
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
          <h2 className="text-xl font-semibold text-foreground">
            Đã xảy ra lỗi
          </h2>
          <p className="text-sm text-muted-foreground">
            Trang không thể tải. Vui lòng thử lại.
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
          >
            Tải lại trang
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
