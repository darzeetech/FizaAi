import { CSSProperties, ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { FontWeight, TextSize, TextStyled } from './style';

type TextProps = {
  children: ReactNode;
  size?: TextSize;
  color?: string;
  fontWeight?: FontWeight;
  name?: string;
  textDecoration?: CSSProperties['textDecoration'];
  className?: string;
};

const Text = (props: TextProps) => {
  const {
    children,
    size = 'medium',
    name = 'paragraph',
    fontWeight = 400,
    color = 'var(--color-nightRider)',
    textDecoration,
    className = '',
  } = props;

  return (
    <ThemeProvider theme={{ name }}>
      <TextStyled
        className={className}
        size={size}
        color={color}
        fontWeight={fontWeight}
        textDecoration={textDecoration}
      >
        {children}
      </TextStyled>
    </ThemeProvider>
  );
};

export default Text;
