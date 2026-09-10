'use client';

import { useState } from 'react';

const themes = ['Todo', 'Misterio', 'Aventura', 'Memoria'];

export function StoryFilter() {
    const [selected, setSelected] = useState('Todo');
    return <div className="filters" aria-label="Filtrar historias por tema">{themes.map((theme) => <button className="filter" key={theme} type="button" aria-pressed={selected === theme} onClick={() => setSelected(theme)}>{theme}</button>)}</div>;
}
