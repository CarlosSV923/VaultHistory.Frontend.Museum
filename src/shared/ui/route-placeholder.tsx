type RoutePlaceholderProps = { eyebrow: string; title: string; description: string; };

export function RoutePlaceholder({ eyebrow, title, description }: RoutePlaceholderProps) {
    return <main className="route"><p className="route__eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p><section className="route__card" aria-label="Estado de implementación"><strong>Base preparada</strong><p>Esta ruta ya dispone de estados de carga y error. Su caso de uso se implementará en la historia correspondiente.</p></section></main>;
}
