import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

interface IHelp {
  onClose: (shouldClose: boolean) => void
}

const Help = (props: IHelp) => {
  const { onClose } = props;

  return (
    <EuiFlyout
      ownFocus
      onClose={() => { onClose(false) }}
      aria-labelledby="flyoutHelp"
    >
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2>Help</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiText>
          <p>
            Welcome to Substrate Scanner. Future help text for the user goes here...
          </p>
        </EuiText>
      </EuiFlyoutBody>
    </EuiFlyout>
  )
}

export default Help;