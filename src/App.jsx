import { useTheme } from './hooks/useTheme';
import { a11y } from './content';
import AnnouncementBar from './sections/AnnouncementBar';
import Nav from './sections/Nav';
import Hero from './sections/Hero';
import Manifeste from './sections/Manifeste';
import Trajectoire from './sections/Trajectoire';
import Etablissements from './sections/Etablissements';
import Instruments from './sections/Instruments';
import Systeme from './sections/Systeme';
import Transmission from './sections/Transmission';
import Production from './sections/Production';
import Pilotage from './sections/Pilotage';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import './styles.css';

export default function App() {
  const { preference, setPreference, resolved } = useTheme();

  return (
    <>
      <a className="skip-link" href="#contenu">
        {a11y.skip}
      </a>
      <Nav preference={preference} setPreference={setPreference} resolved={resolved} />
      <main id="contenu">
        <Hero />
        <AnnouncementBar />
        <Manifeste />
        <Trajectoire />
        <Etablissements />
        <Instruments />
        <Systeme />
        <Transmission />
        <Production />
        <Pilotage />
        <Contact />
      </main>
      <Footer preference={preference} setPreference={setPreference} resolved={resolved} />
    </>
  );
}
