interface Props {
  tryCount: number;
}

function Progress({ tryCount }: Props): JSX.Element {
  return <div>{tryCount}번째 시도 중...</div>;
}

export default Progress;
