import {Html5Audio, Sequence, staticFile} from 'remotion';

export type SoundCue = Readonly<{
  /** Global frame the sound starts on. */
  from: number;
  /** Path inside public/. */
  src: string;
  volume?: number;
  /** Frames to play; required for looping sounds. */
  duration?: number;
  loop?: boolean;
}>;

/** Places each cue on the timeline; the film owns which cues exist and when. */
export const Soundtrack = ({cues}: Readonly<{cues: readonly SoundCue[]}>) => (
  <>
    {cues.map((cue, index) => (
      <Sequence key={`${cue.src}-${cue.from}-${index}`} from={cue.from} durationInFrames={cue.duration} layout="none">
        <Html5Audio src={staticFile(cue.src)} volume={cue.volume ?? 1} loop={cue.loop} />
      </Sequence>
    ))}
  </>
);
