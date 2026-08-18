import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OfferingsSection from "@/components/OfferingsSection";
import CategoriesSection from "@/components/CategoriesSection";
import RoleComparison from "@/components/RoleComparison";
import RoleBranch from "@/components/RoleBranch";
import RoleSearch from "@/components/RoleSearch";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import UserSelection from "@/components/UserSelection";

function DecoHr() {
  return <hr className="deco-hr max-w-6xl mx-auto" />;
}

export default function Home() {
  return (
    <>
      <UserSelection />
      <Navbar />
      <HeroSection />
      <DecoHr />
      <OfferingsSection />
      <DecoHr />
      <CategoriesSection />
      <DecoHr />
      <RoleComparison />
      <DecoHr />
      <RoleBranch />
      <DecoHr />
      <RoleSearch />
      <CTASection />
      <Footer />
    </>
  );
}
