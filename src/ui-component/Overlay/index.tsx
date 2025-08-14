import { OverlayStyled } from './style';

type OverlayProps = {
  show?: boolean;
};

const Overlay = ({ show = false }: OverlayProps) => {
  return <OverlayStyled show={show} />;
};

export default Overlay;
