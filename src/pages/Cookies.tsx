import { SEO } from "@/components/SEO";

const Cookies = () => (
  <>
    <SEO
      title="Cookie Policy | Evergreen Dental (Demo)"
      description="How the Evergreen Dental demo website uses cookies and local storage, including Google Analytics, and how you can accept, decline or change your choice."
      path="/cookies"
    />
    <section className="py-20">
      <div className="container-wide max-w-3xl space-y-6 text-foreground/80">
        <h1 className="text-4xl md:text-5xl font-bold tracking-display text-foreground">Cookie policy</h1>
        <p className="text-sm">This is a demo website. Evergreen Dental is not a real dental practice.</p>
        <h2 className="text-xl font-bold text-foreground">What are cookies?</h2>
        <p>Cookies are small files stored on your device that help a website remember information about your visit.</p>
        <h2 className="text-xl font-bold text-foreground">Cookies we use</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Essential:</strong> remember your cookie choice and chat assistant preferences. These are always on.</li>
          <li><strong>Analytics (Google Analytics):</strong> help us see which pages are visited and how the site is used. Only used if you accept.</li>
        </ul>
        <h2 className="text-xl font-bold text-foreground">Changing your choice</h2>
        <p>You can reset your choice at any time, and the banner will appear again.</p>
        <button
          type="button"
          onClick={() => { localStorage.removeItem("cookie_consent"); window.location.reload(); }}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft"
        >
          Change cookie settings
        </button>
      </div>
    </section>
  </>
);

export default Cookies;
