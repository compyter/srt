export const STATION = {
  수서: '0551',
  동탄: '0552',
  평택지제: '0553',
  곡성: '0049',
  공주: '0514',
  광주송정: '0036',
  구례구: '0050',
  김천구미: '0507',
  나주: '0037',
  남원: '0048',
  대전: '0010',
  동대구: '0015',
  마산: '0059',
  목포: '0041',
  밀양: '0017',
  부산: '0020',
  서대구: '0506',
  순천: '0051',
  경주: '0508',
  여수EXPO: '0053',
  여천: '0139',
  오송: '0297',
  '울산(통도사)': '0509',
  익산: '0030',
  전주: '0045',
  정읍: '0033',
  진영: '0056',
  진주: '0063',
  창원: '0057',
  창원중앙: '0512',
  천안아산: '0502',
  포항: '0515',
} as const;
export type Station = (typeof STATION)[keyof typeof STATION];

export const ACCOUNT_TYPE = {
  회원번호: 'srchDvCd1',
  이메일: 'srchDvCd2',
  휴대전화번호: 'srchDvCd3',
} as const;
export type AccountType = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE];

export const EVEN_TIMES = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '24'];

export interface Account {
  type: AccountType;
  id: string;
  password: string;
}

export interface Schedule {
  departureStation: Station;
  arrivalStation: Station;
  date: string; // yyyymmdd
  time: string; // hh0000
}

export interface Train {
  departureTime: string; // hh:mm
  arrivalTime: string; // hh:mm
}

export interface Reservation {
  index: number;
  seat: 'first' | 'economy';
}

export interface Message<T = null> {
  success: boolean;
  data: T;
}
