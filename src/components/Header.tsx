import { useState } from "react";
import {
  EuiHeader,
  EuiHeaderSectionItem,
  EuiTitle,
  EuiHeaderLink
} from '@elastic/eui';

import logo from '../images/symbol-polkadot.png';
import Help from './Help'

const Header = () => {
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  return (
    <EuiHeader>
      <EuiHeaderSectionItem border="right">
        <img src={logo} alt="Logo" />
        <EuiTitle size="xs">
          <span>Substrate Scanner</span>
        </EuiTitle>
      </EuiHeaderSectionItem>
      <EuiHeaderSectionItem>
        <EuiHeaderLink onClick={() => { setIsHelpVisible(true) }} iconType="help">Help</EuiHeaderLink>
      </EuiHeaderSectionItem>

      {isHelpVisible && <Help onClose={setIsHelpVisible} />}
    </EuiHeader>
  );
};

export default Header;