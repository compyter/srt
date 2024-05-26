import { useState } from 'react';
import { ACCOUNT_TYPE, Account as IAccount } from '../../../data';

interface Props {
  onConfirm: (account: IAccount) => void;
}

function Account({ onConfirm }: Props): JSX.Element {
  const [type, setType] = useState<IAccount['type']>(ACCOUNT_TYPE.회원번호);
  const [id, setId] = useState<IAccount['id']>();
  const [password, setPassword] = useState<IAccount['password']>();

  const types = Object.entries(ACCOUNT_TYPE);

  const confirm = (): void => {
    if (!id || !password) {
      alert(`${id ? '비밀번호' : '아이디'}를 입력하세요.`);
      return;
    }

    onConfirm({ type, id, password });
  };

  return (
    <div>
      <div>
        {types.map(([key, value]) => (
          <label key={key}>
            <input
              type="radio"
              name="loginType"
              value={value}
              checked={value === type}
              onChange={({ target }) => setType(target.value as IAccount['type'])}
            />
            {key}
          </label>
        ))}
      </div>
      <input placeholder="아이디" onChange={({ target }) => setId(target.value)} />
      <input type="password" placeholder="비밀번호" onChange={({ target }) => setPassword(target.value)} />
      <button onClick={confirm}>확인</button>
    </div>
  );
}

export default Account;
