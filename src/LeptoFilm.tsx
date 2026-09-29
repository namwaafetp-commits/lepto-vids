import {useCurrentFrame} from 'remotion';

export const LeptoFilm: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      data-frame={frame}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#071A2B',
      }}
    />
  );
};
