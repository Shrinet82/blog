export default function ContactPage() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 min-h-[50vh]">
      <h1 className="text-headline-lg font-headline-lg text-on-surface mb-6 font-display font-bold">Contact Us</h1>
      <p className="text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
        Have a question, wish to submit an article, or want to publish a journal with us? <br />
        Reach out to us directly at <a href="mailto:abhishalprakashan@gmail.com" className="text-primary hover:underline font-bold">abhishalprakashan@gmail.com</a>.
      </p>
    </div>
  );
}
