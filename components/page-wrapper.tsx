// PageWrapper — use this as the outermost wrapper on every page
// Ensures consistent max-width, horizontal padding, and vertical spacing
// Usage: <PageWrapper>...</PageWrapper>
// Usage with dark bg: <PageWrapper className="bg-[#050e2d]">...</PageWrapper>

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean; // for blog/article pages — tighter max-width
}

export default function PageWrapper({ children, className = "", narrow = false }: PageWrapperProps) {
  return (
    <div className={`w-full min-h-screen ${className}`}>
      <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${narrow ? "max-w-4xl" : "max-w-7xl"}`}>
        {children}
      </div>
    </div>
  );
}
