export type Scene1Copy = Readonly<{
  firstHeadline: string;
  dangerMessage: string;
}>;

export type Scene2Copy = Readonly<{
  primaryStatement: string;
  secondarySource: string;
  animalSources: string;
}>;

export type FilmScript = Readonly<{
  scene1: Scene1Copy;
  scene2: Scene2Copy;
}>;

export const SCRIPT: FilmScript = {
  scene1: {
    firstHeadline: 'น้ำท่วม',
    dangerMessage: 'ระวังโรคฉี่หนู',
  },
  scene2: {
    primaryStatement: 'เชื้อปนเปื้อนในน้ำและดิน',
    secondarySource: 'จากปัสสาวะของสัตว์ติดเชื้อ',
    animalSources: 'หนู • สุนัข • วัว • ควาย • สุกร',
  },
};
