const features = [
  ['Special Navratri set', 'Ideal for the nine sacred days of Navratri.'],
  ['Traditional shringaar', 'A devotional collection for Maa Durga’s worship and offerings.'],
  ['Festive essentials', 'Suitable for enhancing your Navratri puja rituals.'],
  ['Perfect for gifting', 'A thoughtful spiritual gift for family, friends and loved ones.'],
  ['Trusted brand', 'Brought to you by YOUNOYA, blending devotion, tradition and thoughtful gifting.'],
]

const contents = [
  ['09', 'Individual coloured chunaris', 'A chunari for each day’s devotional offering.'],
  ['09', 'Bindi + bangles shringaar sets', 'Daily colour-coordinated shringaar for Maa Durga.'],
  ['09', 'Coloured clay diyas + cotton wicks', 'Diya and rui jyot for your daily puja.'],
  ['09', 'Fragrant coloured pooja dhoop cones', 'Pooja dhoop to accompany the nine days of worship.'],
  ['09', 'Different devotional offerings', 'Each day’s offering is listed in the daily kit guide below.'],
]

const details = [
  ['Brand', 'YOUNOYA'],
  ['Product name', '9 Kit Shringaar Kit'],
  ['Occasion', 'Navratri, Durga Puja and religious celebrations'],
  ['Ideal for', 'Home puja, devotional offerings and festive gifting'],
  ['Packaging', 'Nine individually packed daily kits together in one outer box'],
]

export default function NavratriDescription() {
  return <>
    <section className="navratri-description" aria-labelledby="navratri-description-title">
      <div className="navratri-description__story">
        <span className="navratri-eyebrow">DEVOTION · TRADITION · THOUGHTFUL GIFTING</span>
        <h2 id="navratri-description-title">A special set for <em>nine sacred days.</em></h2>
        <p>Celebrate the divine spirit of Navratri with the <strong>YOUNOYA 9 Kit Shringaar Kit</strong>, thoughtfully curated for devotional offerings to Maa Durga. This special Navratri shringaar set adds a traditional and auspicious touch to your daily Navratri puja and festive rituals.</p>
        <p>Perfect for devotees looking to make their nine days of worship more special, this shringaar kit is a meaningful choice for Navratri celebrations, Durga Puja and devotional gifting.</p>
      </div>
      <div className="navratri-features">
        <h3>Key features</h3>
        <ul>{features.map(([title, description]) => <li key={title}><h4>{title}</h4><p>{description}</p></li>)}</ul>
      </div>
    </section>
    <section className="navratri-inclusions" aria-labelledby="navratri-inclusions-title">
      <div>
        <span className="navratri-eyebrow">THE COMPLETE NINE-DAY SET</span>
        <h2 id="navratri-inclusions-title">What’s inside <em>your box.</em></h2>
        <ul className="navratri-inclusions__list">{contents.map(([count, title, description]) => <li key={title}><span>{count}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ul>
      </div>
      <div className="navratri-product-details">
        <h3>Product details</h3>
        <dl>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p>A colour and a devotional offering for each day. Explore the deity names and exact contents in the daily kit guide.</p>
        <a href="#nine-days">Explore the nine daily kits <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  </>
}
