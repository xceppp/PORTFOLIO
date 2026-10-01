import ScrollVelocity from '../bits/ScrollVelocity';
import { keywords } from '../content';

export default function KeywordBand() {
  return (
    <section className="keyword-band" aria-label="Mots-clés">
      <ScrollVelocity items={keywords} velocity={0.8} />
      <ScrollVelocity items={[...keywords].reverse()} velocity={-0.7} />
    </section>
  );
}
