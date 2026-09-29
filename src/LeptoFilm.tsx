import {Audio, Sequence, staticFile} from 'remotion';
import {PoseLabelsContext} from './components/Character';
import {CHAPTERS} from './data/timings';
import {COLORS} from './design/tokens';
import {SCENES} from './scenes';

export type LeptoFilmProps = {
  /** Show "POSE NEEDED" chips on stand-in character art. Turn off for final renders. */
  poseLabels: boolean;
  /** Music file inside public/, e.g. "assets/audio/music.mp3" (120 BPM), or null. */
  music: string | null;
};

/** Sequences the nine chapters back to back on the 120 BPM grid. */
export const LeptoFilm: React.FC<LeptoFilmProps> = ({poseLabels, music}) => (
  <PoseLabelsContext.Provider value={poseLabels}>
    <div style={{position: 'absolute', inset: 0, backgroundColor: COLORS.paper, overflow: 'hidden'}}>
      {CHAPTERS.map(({id, start, duration}) => {
        const Scene = SCENES[id];
        return (
          <Sequence key={id} name={id} from={start} durationInFrames={duration}>
            <Scene duration={duration} />
          </Sequence>
        );
      })}
      {music && <Audio src={staticFile(music)} />}
    </div>
  </PoseLabelsContext.Provider>
);
