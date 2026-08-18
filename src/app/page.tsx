import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Skyline from "@/components/Skyline";
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

      {/* Skyline visual after intro */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 mb-4">
        <Skyline />
      </div>

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
