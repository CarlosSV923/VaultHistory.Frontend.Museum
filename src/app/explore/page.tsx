import { StoryFilter } from '@/features/explore/story-filter';

const stories = [
    { theme: 'Misterio', title: 'La llave que olvidó su puerta', time: '4 min' },
    { theme: 'Aventura', title: 'Un mapa en el reverso del recibo', time: '6 min' },
    { theme: 'Memoria', title: 'La casa que guardaba las voces', time: '5 min' },
];

export default function ExplorePage() {
    return <main id="main-content" className="explore"><section className="explore__hero"><div><h1>Historias con un lugar al que volver.</h1><p>Explora relatos breves, guarda los que te acompañen y crea el tuyo cuando quieras.</p></div><div className="explore__mark" aria-hidden="true"><span>V</span></div></section><section aria-labelledby="featured-stories"><div className="section-heading"><h2 id="featured-stories">Para leer ahora</h2><p>Una selección para empezar</p></div><StoryFilter /><div className="story-grid">{stories.map((story) => <article className="story-card" key={story.title}><div><p className="story-card__theme">{story.theme}</p><h3>{story.title}</h3></div><footer className="story-card__footer"><span>Relato breve</span><span>{story.time}</span></footer></article>)}</div></section></main>;
}
