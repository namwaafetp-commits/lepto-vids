/**
 * Generated environment art and props (prompts: docs/ASSET_PROMPTS.md). Each file lives in
 * public/assets/. Until an asset is `ready`, scenes draw their vector stand-in instead.
 */
export type AssetId = 'bangkok-flood' | 'rat' | 'dog' | 'cow' | 'buffalo' | 'pig' | 'floodwater';

export type Asset = Readonly<{
  file: string;
  ready: boolean;
  /** Image width ÷ height. */
  aspect: number;
}>;

export const ASSETS: Readonly<Record<AssetId, Asset>> = {
  'bangkok-flood': {file: 'assets/backgrounds/bangkok-flood.png', ready: false, aspect: 1536 / 1024},
  rat: {file: 'assets/props/rat.png', ready: false, aspect: 1},
  dog: {file: 'assets/props/dog.png', ready: false, aspect: 1},
  cow: {file: 'assets/props/cow.png', ready: false, aspect: 1},
  buffalo: {file: 'assets/props/buffalo.png', ready: false, aspect: 1},
  pig: {file: 'assets/props/pig.png', ready: false, aspect: 1},
  floodwater: {file: 'assets/textures/floodwater.png', ready: false, aspect: 1},
};
