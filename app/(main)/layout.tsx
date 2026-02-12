import Footer from "../../components/global/Footer";
import Navbar from "../../components/global/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <main className="flex flex-col pt-12.5">{children}</main>
      <Footer />
    </div>
  );
}
