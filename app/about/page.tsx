import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen px-[10vw] py-16">
      <h1 className="font-heading text-[56px] md:text-[80px] text-brand-white mb-16">
        About
      </h1>

      {/* The Peaches */}
      <section className="mb-20 flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1">
          <p className="font-display font-bold uppercase text-brand-orange text-sm mb-3">
            The Peaches
          </p>
          <h2 className="font-heading text-[40px] text-brand-white mb-6">
            Palisade, Colorado
          </h2>
          {/* PLACEHOLDER — replace with final peach region copy */}
          <div className="font-sans text-brand-white/70 text-lg leading-relaxed space-y-4">
            <p>
              Palisade is a small town located in western Colorado, United
              States. It is situated on the western slope of the Rocky
              Mountains, and is known for its scenic beauty, outdoor recreation,
              and agriculture. Palisade sits in a valley surrounded by rugged
              mountains and mesas, with the Colorado River flowing through the
              town. It is a charming and picturesque town, known for its
              friendly community and laid-back lifestyle.
            </p>
            <p>
              However, what most people don&apos;t know is that Palisade is know
              for producing the best peaches in the world (yup) due to its
              unique combination of location and climate. The town sits at high
              elevation, which provides warm sunny days and cool nights during
              the growing season. This diurnal shift helps to develop the sugars
              in the peaches, resulting in a sweeter and more flavorful fruit.
            </p>
            <p>
              Its unique geologic location combined with the &apos;million
              dollar winds&apos; from Debeque Canyon provide important
              protection from Spring frost damage. The semi-arid climate with
              low humidity also helps reduce the risk of disease/pests that can
              affect peach trees. Many farmers will allow their peaches to ripen
              on tree, which ensures that they are juicy, sweet, and bursting
              with flavor. Biting into a Palisade peach is truly a one-of-a-kind
              experience. And we want to share that experience with you and your
              loved ones!
            </p>
          </div>
        </div>
        {/* Farm / field photo */}
        <div className="w-full lg:w-[40vw] max-w-[480px] aspect-[4/3] rounded-[20px] overflow-hidden shrink-0">
          <Image
            src="/images/about-palisade.jpeg"
            alt="Palisade peach farm"
            width={480}
            height={360}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* The Farmers */}
      <section className="mb-20 flex flex-col lg:flex-row-reverse gap-12 items-start">
        <div className="flex-1">
          <p className="font-display font-bold uppercase text-brand-orange text-sm mb-3">
            The Farmers
          </p>
          {/* PLACEHOLDER — replace with partner farm name */}
          <h2 className="font-heading text-[40px] text-brand-white mb-6">
            Mesa Park Fruit Company and The Davis Family Farms
          </h2>
          {/* PLACEHOLDER — replace with farmer bio */}
          <div className="font-sans text-brand-white/70 text-lg leading-relaxed space-y-4">
            <p>
              Mesa Park Fruit Co. is a partnership between Brandon and Laura
              Black and Laurie Priddy – friends and neighbors farming in
              beautiful Palisade, CO. They farm ~25 acres on the mesa above
              downtown Palisade and specialize in Palisade peaches, cherries,
              plums, pluots and wine grapes!
            </p>
            <p>
              The Davis Family Farms story started in 2000, when they bought a
              truckload of Palisade peaches and drove them back to their
              hometowns to sell. The peaches were such a big hit, it inspired
              them to start growing their own. They offer their peaches at
              various farmer&apos;s markets and roadside stands throughout
              Colorado, as well as at their own market, Nana&apos;s Fruit &amp;
              Jam Shack, in the heart of downtown Palisade.
            </p>
            <p>
              &ldquo;There is something so special about doing the hard work of
              growing peaches and knowing they will be enjoyed at gatherings of
              friends and family all summer. We take pride in carefully curating
              the best selection of delicious, Colorado-grown peaches, for
              others to experience.&rdquo; - Becky Davis
            </p>
          </div>
          {/* PLACEHOLDER — farm website link */}
          <a
            href="#"
            className="inline-block mt-4 text-brand-orange hover:opacity-70 transition-opacity font-display font-bold italic"
          >
            Visit Farm Website ↗
          </a>
        </div>
        {/* Farmer photo */}
        <div className="w-full lg:w-[40vw] max-w-[480px] aspect-square rounded-[20px] overflow-hidden shrink-0">
          <Image
            src="/images/about-farms.jpg"
            alt="Mesa Park and Davis Family Farms"
            width={480}
            height={480}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* The Artist */}
      <section className="mb-20">
        <p className="font-display font-bold uppercase text-brand-orange text-sm mb-3">
          The Artist
        </p>
        <h2 className="font-heading text-[40px] text-brand-white mb-6">
          WAXBONES
        </h2>
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Artist photo */}
          <div className="w-[300px] h-[300px] lg:w-[200px] lg:h-[200px] rounded-full overflow-hidden shrink-0">
            <Image
              src="/images/about-waxbones.jpg"
              alt="WAXBONES"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="font-sans text-brand-white/70 text-lg leading-relaxed mb-4">
              We&apos;ve partnered with Waxbones to design our artwork. Waxbones
              is an illustrator and graphic designer based in Bristol, UK. After
              spending a decade designing wayfinding systems for cities all over
              the world, in 2021 he made the leap to pursue NFT art full-time,
              creating numerous sell-out collections, editions, 1/1s and his
              innovative narrative-focussed project Prometheus Lab, as well as
              collaborating with some of the biggest names in the scene.
            </p>
            <p>
              His style juxtaposes the whimsical with the macabre, taking
              inspiration from struggles with mental health, sci-fi and horror,
              punk, hardcore and related genres of music, as well as tattoo
              culture.
            </p>
            <p>
              His work has been exhibited all over the world and even sent to
              the International Space Station, and has recently worked with
              commercial clients integrating web3 elements - The Masked Singer
              (Fox), Barbie (Mattel) and KnownOrigin (eBay).
            </p>
            <a
              href="https://waxbones.xyz/"
              className="text-brand-orange hover:opacity-70 transition-opacity font-display font-bold italic"
            >
              Portfolio ↗
            </a>
          </div>
        </div>
      </section>

      {/* The Project
      <section className="mb-20">
        <p className="font-display font-bold uppercase text-brand-orange text-sm mb-3">
          The Project
        </p>
        <h2 className="font-heading text-[40px] text-brand-white mb-6">
          Peach Drop Token — Seasons 1–4
        </h2>

        <div className="font-sans text-brand-white/70 text-lg leading-relaxed space-y-4 max-w-2xl">
          <p>
            [Project history — brief overview of Seasons 1–3, how the project
            started, MetaCartel involvement, community reception. To be
            provided.]
          </p>
          <p>
            [Season 4 context — what&apos;s new, why Base, what&apos;s changed
            from previous seasons.]
          </p>
        </div>
        <div className="mt-6">
          <a
            href="https://metacartel.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-orange hover:opacity-70 transition-opacity font-display font-bold italic"
          >
            A MetaCartel Project ↗
          </a>
        </div>
      </section>
      */}
    </div>
  );
}
