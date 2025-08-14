import { Container } from './style';

type LoaderProps = {
  showLoader?: boolean;
};

const Loader = (props: LoaderProps) => {
  const { showLoader = false } = props;

  if (!showLoader) {
    return null;
  }

  return (
    <Container>
      <div className="loader" />
    </Container>
  );
};

export default Loader;
