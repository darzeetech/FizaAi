import { ReactNode, useEffect, useState } from 'react';
import _isNil from 'lodash/isNil';
import { useLocation } from 'react-router-dom';
import { Text } from '../';
import { Tab, TabList } from './style';

type TabsProps = {
  tabNameList: string[];
  children: ReactNode;
  defaultIndex?: number;
  isSticky?: boolean;
  width?: string;
  onTabChange?: (index: number) => void;
  tabCounts?: Record<string, number>;
};

const Tabs = ({
  defaultIndex = 0,
  tabNameList,
  isSticky = false,
  width,
  children,
  onTabChange,
  tabCounts,
}: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const location = useLocation();
  const isSelectCustomerPage = location.pathname === '/selectcustomer';

  useEffect(() => {
    if (!_isNil(defaultIndex) && typeof defaultIndex === 'number') {
      setActiveIndex(defaultIndex);
    }
  }, [defaultIndex]);

  useEffect(() => {
    if (typeof onTabChange === 'function') {
      onTabChange(activeIndex);
    }
  }, [activeIndex]);

  const updateActiveIndex = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div style={{ width: '100%' }}>
      <TabList $isSticky={isSticky} width={width}>
        {tabNameList.map((tabName, index) => (
          <Tab
            key={index}
            isActive={activeIndex === index}
            onClick={() => updateActiveIndex(index)}
          >
            <Text
              color={activeIndex === index ? 'primary' : 'var(--color-nightRider)'}
              fontWeight={500}
            >
              {tabName}{' '}
              {!isSelectCustomerPage && tabCounts?.[tabName.toLowerCase()]
                ? `(${tabCounts[tabName.toLowerCase()]})`
                : ''}
            </Text>
          </Tab>
        ))}
      </TabList>
      <>{Array.isArray(children) ? children[activeIndex] : children}</>
    </div>
  );
};

export default Tabs;
