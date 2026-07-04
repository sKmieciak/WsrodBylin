import FooterContact from "./FooterContact";
import FooterLinks from "./FooterLinks";
import FooterNewsletter from "./FooterNewsletter";

export const Footer = () => {
  return (
<footer className="bg-card text-foreground py-10 mt-10 border-t border-border">
      <div className="container max-w-screen-2xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FooterContact />
        <FooterLinks />
        <FooterNewsletter />
      </div>
    </footer>
  );
};

export default Footer;
