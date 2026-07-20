-- Internationalisation du CONTENU des parcours.
--
-- Principe : les parcours ne sont pas des traductions mot a mot. Un parcours
-- anglophone a ses propres ressources (docs officielles en anglais, chaines
-- anglophones, plateformes de paiement internationales) et son propre angle.
-- On separe donc les parcours par locale plutot que de dupliquer des champs.
--
-- locale        : langue du contenu ('fr' par defaut, 'en' pour l'anglais)
-- counterpart_slug : parcours equivalent dans l'autre langue (lien croise,
--                    optionnel : un parcours peut n'exister que dans une langue)

alter table public.learning_tracks
  add column if not exists locale text not null default 'fr'
    check (locale in ('fr', 'en')),
  add column if not exists counterpart_slug text not null default '';

create index if not exists learning_tracks_locale_idx
  on public.learning_tracks (locale, sort_order);

-- Tout l'existant est francophone.
update public.learning_tracks set locale = 'fr' where locale is null or locale = '';

-- La banque de questions suit la langue de sa lecon (pas de colonne dediee :
-- les lecons appartiennent a un parcours qui porte deja la locale).

comment on column public.learning_tracks.locale is
  'Langue du contenu du parcours. Les parcours en ne sont pas des traductions : ressources et angle propres.';
comment on column public.learning_tracks.counterpart_slug is
  'Slug du parcours equivalent dans l''autre langue, pour proposer la bascule. Vide si pas d''equivalent.';
