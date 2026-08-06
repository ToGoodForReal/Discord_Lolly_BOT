interface Character {
  name: string;
  anime: string;
  description: string;
}

export const CHARACTERS: readonly Character[] = [
  { name: 'Naruto Uzumaki', anime: 'Naruto', description: 'Ninja determinado que sonha em ser Hokage' },
  { name: 'Monkey D. Luffy', anime: 'One Piece', description: 'Pirata de borracha em busca do One Piece' },
  { name: 'Goku', anime: 'Dragon Ball', description: 'Sayajin protetor da Terra' },
  { name: 'Edward Elric', anime: 'Fullmetal Alchemist', description: 'Alquimista em busca da Pedra Filosofal' },
  { name: 'Tanjiro Kamado', anime: 'Demon Slayer', description: 'Caçador de demônios gentil e determinado' },
  { name: 'Senku Ishigami', anime: 'Dr. Stone', description: 'Gênio científico revivendo a civilização' },
  { name: 'Rimuru Tempest', anime: 'That Time I Got Reincarnated as a Slime', description: 'Slime que se tornou líder de monstros' },
  { name: 'Ainz Ooal Gown', anime: 'Overlord', description: 'Esqueleto mago supremo de Nazarick' },
] as const;
