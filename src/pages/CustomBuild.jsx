import { useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero";
import CustomizationPreviewer from "../components/CustomizationPreviewer";
import Button from "../components/Button";
import { useQuote } from "../context/QuoteContext";
import { useAuth } from "../context/AuthContext";

export default function CustomBuild() {
  const { addItem: addQuoteItem, openDrawer } = useQuote();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCustomBuildRequest = (fabricLabel) => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/custom-build" } } });
      return;
    }
    addQuoteItem({
      _id: `custom-${fabricLabel}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: `Custom Build — ${fabricLabel}`,
      images: [],
      moq: 300,
    });
    openDrawer();
  };

  return (
    <>
      <PageHero
        eyebrow="Bulk & Custom Orders"
        title="Build It"
        highlight="Your Way"
        description="Pick a material and color — or tell us exactly what you have in mind — and we'll turn it into a bulk order quote."
      />

      <CustomizationPreviewer onRequest={handleCustomBuildRequest} />

      <section className="py-24 sm:py-28 bg-cream-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <h3 className="font-display font-semibold text-2xl sm:text-3xl text-ink-950">
            Not sure where to start? Talk it through with us.
          </h3>
          <Button to="/contact" variant="primary" className="whitespace-nowrap">
            Talk to Our Team
          </Button>
        </div>
      </section>
    </>
  );
}
