import { useState } from 'react';
import { Reservation as IReservation, Train } from '../../../data';

interface Props {
  trains: Train[];
  onConfirm: (reservations: IReservation[]) => void;
}

function Reservation({ trains, onConfirm }: Props): JSX.Element {
  const [reservations, setReservations] = useState<IReservation[]>([]);

  const push = (index: number, seat: IReservation['seat']) => {
    setReservations((rs) => rs.concat({ index, seat }));
  };

  const pop = (index: number, seat: IReservation['seat']) => {
    setReservations((rs) => rs.filter((r) => r.index !== index || r.seat !== seat));
  };

  const confirm = () => {
    if (reservations.length === 0) {
      alert('예매할 승차권을 선택하세요.');
      return;
    }

    onConfirm(reservations);
  };

  if (trains.length === 0) {
    return <div>승차권 없음</div>;
  }

  return (
    <div>
      {trains.map((train, index) => (
        <div key={index}>
          {train.departureTime} - {train.arrivalTime}
          <label>
            특실
            <input type="checkbox" onChange={({ target: { checked } }) => (checked ? push(index, 'first') : pop(index, 'first'))} />
          </label>
          <label>
            일반실
            <input type="checkbox" onChange={({ target: { checked } }) => (checked ? push(index, 'economy') : pop(index, 'economy'))} />
          </label>
        </div>
      ))}
      <div>
        <button onClick={confirm}>확인</button>
      </div>
    </div>
  );
}

export default Reservation;
