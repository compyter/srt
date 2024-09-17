import puppeteer, { Browser, Page } from 'puppeteer';
import { ACCOUNT_TYPE, Account, Reservation, Schedule, Train } from '../data';

let browser: Browser;
let page: Page;

export async function init() {
  if (browser) {
    browser.close();
  }
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 1024 });

  // alert, confirm 무시
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function login(account: Account) {
  await init();
  const { type, id, password } = account;
  const typeSelector = `#${type}`;
  const idSelector = type === ACCOUNT_TYPE.회원번호 ? '#srchDvNm01' : type === ACCOUNT_TYPE.이메일 ? '#srchDvNm02' : '#srchDvNm03';
  const passwordSelector =
    type === ACCOUNT_TYPE.회원번호 ? '#hmpgPwdCphd01' : type === ACCOUNT_TYPE.이메일 ? '#hmpgPwdCphd02' : '#hmpgPwdCphd03';

  await page.goto('https://etk.srail.kr/cmc/01/selectLoginForm.do?pageId=TK0701000000');

  await page.locator(typeSelector).click();
  await page.locator(idSelector).fill(id);
  await page.locator(passwordSelector).fill(password);

  await page.locator('.loginSubmit').click();
  await wait(2000);
  if (page.url().includes('selectLoginForm')) {
    throw Error();
  }
}

export async function fetchTrains(schedule: Schedule) {
  const { departureStation, arrivalStation, date, time } = schedule;

  await page.goto('https://etk.srail.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000');

  await page.locator('#dptRsStnCd').setVisibility(null).setEnsureElementIsInTheViewport(false).fill(departureStation);
  await page.locator('#arvRsStnCd').setVisibility(null).setEnsureElementIsInTheViewport(false).fill(arrivalStation);
  await page.select('#dptDt', date);
  await page.select('#dptTm', time);

  await page.locator('.inquery_btn').click();
  await page.waitForNavigation({ timeout: 1000000 });
}

export async function getTrains(schedule: Schedule) {
  await fetchTrains(schedule);

  const trains = await page.$$eval('table tbody tr', (els) => {
    return els
      .map<Train>((el) => {
        const departureTime = el.querySelector<HTMLDivElement>('td:nth-child(4) .time')?.innerText ?? '';
        const arrivalTime = el.querySelector<HTMLDivElement>('td:nth-child(5) .time')?.innerText ?? '';

        return {
          departureTime,
          arrivalTime,
        };
      })
      .filter((train) => train.departureTime && train.arrivalTime);
  });

  return trains;
}

export async function refetchTrains() {
  await page.reload();
  await page.waitForNetworkIdle();

  while (true) {
    try {
      await page.waitForSelector('table tbody tr', { timeout: 3000 });
      break;
    } catch {
      await page.locator('.inquery_btn').setTimeout(60000).click();
    }
  }
}

export async function reserve(reservations: Reservation[]) {
  for (let i = 0; i < reservations.length; i++) {
    const { index, seat } = reservations[i];
    const tdOrder = seat === 'first' ? 6 : 7;

    await page.waitForSelector(`table tbody tr:nth-child(${index + 1}) td:nth-child(${tdOrder}) > a`);
    const hasSeat = await page.$eval(`table tbody tr:nth-child(${index + 1}) td:nth-child(${tdOrder}) > a`, (el) =>
      el.innerText.includes('예약')
    );
    if (!hasSeat) {
      continue;
    }

    await page.locator(`table tbody tr:nth-child(${index + 1}) td:nth-child(${tdOrder}) > a`).click();

    try {
      await page.waitForSelector('.mgl20', { timeout: 3000 });
      const success = !(await page.$eval('.mgl20', (el) => (el as HTMLElement).innerText.includes('잔여석')));
      if (success) {
        return true;
      } else {
        await page.goBack();
        return false;
      }
    } catch {
      return true;
    }
  }

  return false;
}
