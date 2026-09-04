export function AppFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} Hyper Cluster</p>
        <p>Processed locally in your browser</p>
      </div>
    </footer>
  );
}
