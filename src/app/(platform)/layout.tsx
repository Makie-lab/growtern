import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/** Shared shell for inner pages: categories, assessment, experts, dashboard. */
export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
