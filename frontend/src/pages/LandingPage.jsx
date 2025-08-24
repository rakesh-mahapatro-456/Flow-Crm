import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle"; // ✅ Dark/Light toggle
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="w-full border-b bg-background">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Brand */}
          <h1 className="text-2xl font-bold text-primary">FlowCRM</h1>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <ModeToggle /> {/* ✅ Theme toggle */}
            <Button variant="outline" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-3xl space-y-6">
          <h2 className="text-5xl font-bold tracking-tight">
            Manage Your <span className="text-primary">Leads & Sales</span> Effortlessly
          </h2>
          <p className="text-lg text-muted-foreground">
            FlowCRM helps teams streamline lead tracking, manage customer interactions, 
            and close deals faster with powerful yet simple tools.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/signup")}>
              Get Started Free
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">📊 Lead Tracking</h3>
              <p className="text-muted-foreground">
                Keep all your leads organized in one place with smart filters and tags.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">🤝 Customer Management</h3>
              <p className="text-muted-foreground">
                Build stronger relationships by tracking conversations and activity.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">⚡ Sales Automation</h3>
              <p className="text-muted-foreground">
                Automate repetitive tasks so your team can focus on closing deals.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} FlowCRM. All rights reserved.
      </footer>
    </div>
  );
}
