import { useEffect, useState } from 'react';
import Account from './components/Account';
import { Message, Train } from '../../data';
import Schedule from './components/Schedule';
import Reservation from './components/Reservation';
import Progress from './components/Progress';
import Result from './components/Result';

type Status = 'account' | 'schedule' | 'reservation' | 'progress' | 'result';

function App(): JSX.Element {
  const [status, setStatus] = useState<Status>('account');
  const [trains, setTrains] = useState<Train[]>([]);
  const [tryCount, setTryCount] = useState(0);

  useEffect(() => {
    window.electron.ipcRenderer.on('account', (_, message: Message) => {
      const { success } = message;

      if (success) {
        setStatus('schedule');
      } else {
        alert('로그인 실패');
      }
    });

    window.electron.ipcRenderer.on('schedule', (_, { success, data }: Message<Train[]>) => {
      if (success) {
        setTrains(data);
        setStatus('reservation');
      } else {
        alert('승차권 조회 실패');
      }
    });

    window.electron.ipcRenderer.on('reservation', () => {
      setStatus('progress');
    });

    window.electron.ipcRenderer.on('progress', (_, { success, data }: Message<number>) => {
      if (success) {
        setStatus('result');
      } else {
        setTryCount(data);
      }
    });
  }, []);

  return (
    <>
      <h1>SRT 취소 티켓 매크로</h1>
      {status === 'account' && <Account onConfirm={(account) => window.electron.ipcRenderer.send('account', account)} />}
      {status === 'schedule' && <Schedule onConfirm={(schedule) => window.electron.ipcRenderer.send('schedule', schedule)} />}
      {status === 'reservation' && (
        <Reservation trains={trains} onConfirm={(rservations) => window.electron.ipcRenderer.send('reservation', rservations)} />
      )}
      {status === 'progress' && <Progress tryCount={tryCount} />}
      {status === 'result' && <Result />}
    </>
  );
}

export default App;
