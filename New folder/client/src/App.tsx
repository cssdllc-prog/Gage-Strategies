import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Solutions from "./pages/Solutions";
import ProductDetail from "./pages/ProductDetail";
import SolutionFinder from "./pages/SolutionFinder";
import HowItWorks from "./pages/HowItWorks";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Bundles from "./pages/Bundles";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminLeads from "./pages/admin/Leads";
import AdminActivity from "./pages/admin/Activity";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminBlog from "./pages/admin/Blog";
import MyPurchases from "./pages/MyPurchases";
import AdminPurchases from "./pages/admin/Purchases";
import CustomSolutions from "./pages/CustomSolutions";
import FreeTools from "./pages/FreeTools";
import CompanyProfile from "./pages/CompanyProfile";
import ComparePlans from "./pages/ComparePlans";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Organizations from "./pages/Organizations";
import InviteAccept from "./pages/InviteAccept";
import BusinessNameGenerator from "./pages/tools/BusinessNameGenerator";
import ROICalculator from "./pages/tools/ROICalculator";
import ColdEmailWriter from "./pages/tools/ColdEmailWriter";
import InvoiceGenerator from "./pages/tools/InvoiceGenerator";
import ProfitMarginCalculator from "./pages/tools/ProfitMarginCalculator";
import SocialMediaCaptionGenerator from "./pages/tools/SocialMediaCaptionGenerator";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/solutions"} component={Solutions} />
      <Route path={"/bundles"} component={Bundles} />
      <Route path={"/solution/:id"} component={ProductDetail} />
      <Route path={"/solution-finder"} component={SolutionFinder} />
      <Route path={"/how-it-works"} component={HowItWorks} />
      <Route path={"/resources"} component={Resources} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/custom-solutions"} component={CustomSolutions} />
      <Route path={"/free-tools"} component={FreeTools} />
      <Route path={"/tools/business-name-generator"} component={BusinessNameGenerator} />
      <Route path={"/tools/roi-calculator"} component={ROICalculator} />
      <Route path={"/tools/cold-email-writer"} component={ColdEmailWriter} />
      <Route path={"/tools/invoice-generator"} component={InvoiceGenerator} />
      <Route path={"/tools/profit-margin-calculator"} component={ProfitMarginCalculator} />
      <Route path={"/tools/social-media-captions"} component={SocialMediaCaptionGenerator} />
      <Route path={"/compare"} component={ComparePlans} />
      <Route path={"/purchase-success"} component={PurchaseSuccess} />
      <Route path={"/my-purchases"} component={MyPurchases} />
      <Route path={"/purchases"} component={MyPurchases} />
      <Route path={"/company-profile"} component={CompanyProfile} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/organizations"} component={Organizations} />
      <Route path={"/invite/:token"} component={InviteAccept} />
      {/* Admin Routes */}
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/products"} component={AdminProducts} />
      <Route path={"/admin/categories"} component={AdminCategories} />
      <Route path={"/admin/assets"} component={AdminAssets} />
      <Route path={"/admin/leads"} component={AdminLeads} />
      <Route path={"/admin/activity"} component={AdminActivity} />
      <Route path={"/admin/blog"} component={AdminBlog} />
      <Route path={"/admin/purchases"} component={AdminPurchases} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
import AdminAssets from "./pages/admin/Assets";
