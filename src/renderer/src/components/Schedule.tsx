import { useState } from 'react';
import { Schedule as ISchedule, Station, STATION, EVEN_TIMES } from '../../../data';

interface Props {
  onConfirm: (schedule: ISchedule) => void;
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

function formatNumberToTwoDigit(n: number) {
  return n < 10 ? `0${n}` : n;
}

function formatDateToString(date: Date) {
  return `${date.getFullYear()}${formatNumberToTwoDigit(date.getMonth() + 1)}${formatNumberToTwoDigit(date.getDate())}`;
}

function Schedule({ onConfirm }: Props): JSX.Element {
  const [departureStation, setDepartureStation] = useState<Station>(STATION.동대구);
  const [arrivalStation, setArrivalStation] = useState<Station>(STATION.수서);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>(EVEN_TIMES[0]);
  const [loading, setLoading] = useState<boolean>(false);

  const stations = Object.entries(STATION);

  const confirm = () => {
    if (departureStation === arrivalStation) {
      alert('출발역과 도착역이 같습니다.');
      return;
    }

    if (!date) {
      alert('출발 날짜를 선택하세요.');
      return;
    }

    onConfirm({ departureStation, arrivalStation, date: formatDateToString(date), time });
    setLoading(true);
  };

  return (
    <div>
      <div>
        출발 날짜 오늘{formatDateToString(today)}
        <input type="radio" name="date" onClick={() => setDate(today)} />
        내일{formatDateToString(tomorrow)}
        <input type="radio" name="date" onClick={() => setDate(tomorrow)} />
      </div>
      <div>
        출발 시간
        <select onChange={({ target }) => setTime(target.value)}>
          {EVEN_TIMES.map((time) => (
            <option key={time} value={`${time}0000`}>
              {time}
            </option>
          ))}
        </select>
      </div>
      <div>
        출발역
        <select onChange={({ target }) => setDepartureStation(target.value as Station)} defaultValue={departureStation}>
          {stations.map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <div>
        도착역
        <select onChange={({ target }) => setArrivalStation(target.value as Station)} defaultValue={arrivalStation}>
          {stations.map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={() => confirm()}>확인</button>
      </div>
      {loading && <h1>로딩 중...</h1>}
    </div>
  );
}

export default Schedule;
