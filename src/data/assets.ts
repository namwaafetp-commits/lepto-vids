/**
 * Generated environment art and props (prompts: docs/ASSET_PROMPTS.md). Each file lives in
 * public/assets/. Until an asset is `ready`, scenes draw their vector stand-in instead.
 */
export type AssetId = 'bangkok-flood' | 'rat' | 'dog' | 'cow' | 'buffalo' | 'pig' | 'lepto' | 'floodwater';

export type Asset = Readonly<{
  file: string;
  ready: boolean;
  /** Image width ÷ height. */
  aspect: number;
}>;

export const ASSETS: Readonly<Record<AssetId, Asset>> = {
  'bangkok-flood': {file: 'assets/backgrounds/bangkok-flood.png', ready: true, aspect: 1536 / 1024},
  rat: {file: 'assets/props/rat.png', ready: true, aspect: 1241 / 551},
  dog: {file: 'assets/props/dog.png', ready: true, aspect: 1008 / 1229},
  cow: {file: 'assets/props/cow.png', ready: true, aspect: 1161 / 1213},
  buffalo: {file: 'assets/props/buffalo.png', ready: true, aspect: 1207 / 1137},
  pig: {file: 'assets/props/pig.png', ready: true, aspect: 1185 / 1175},
  /** The villain germ: head (face) on the right. */
  lepto: {file: 'assets/props/lepto.png', ready: true, aspect: 1152 / 866},
  floodwater: {file: 'assets/textures/floodwater.png', ready: true, aspect: 1},
};
