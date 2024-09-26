import { format } from 'date-fns';

import { mapDateToDateStr, timestampInTZ } from './datetimeToDate';

describe('timestampInTZ', () => {
  const timeZone = 'America/New_York';

  it.skip('should convert as relative date-time if it is today', () => {
    // For relative datetime it is expected that hours are changed according to TZ
    const today = new Date();
    const todayDate = format(today, 'yyyy-MM-dd');
    const localTime = todayDate + 'T11:00:00.000+02:00';
    // TODO: fix this test to work with DST
    const expected = todayDate + 'T05:00:00.000-04:00';

    expect(timestampInTZ(new Date(localTime), timeZone)).toEqual(expected);
  });

  it('should convert as relative date-time even if it is in past', () => {
    // For relative datetime it is expected that hours are changed according to TZ
    const localTime = '2023-06-15T11:00:00.000+02:00';
    const expected = '2023-06-15T05:00:00.000-04:00';

    expect(timestampInTZ(new Date(localTime), timeZone)).toEqual(expected);
  });

  it.skip('should convert as absolute date-time if it is start of the day', () => {
    // For absolute date it is expected that hours are not changed, because we only need to shift TZ
    const localTime = '2023-06-24T00:00:00.000+02:00';
    const expected = '2023-06-24T00:00:00.000-04:00';

    expect(timestampInTZ(new Date(localTime), timeZone)).toEqual(expected);
  });

  it.skip('should convert as absolute date-time if it is end of the day', () => {
    // For absolute date it is expected that hours are not changed, because we only need to shift TZ
    const localTime = '2023-06-24T23:59:59.000+02:00';
    const expected = '2023-06-24T23:59:59.000-04:00';

    expect(timestampInTZ(new Date(localTime), timeZone)).toEqual(expected);
  });
});

describe('mapDateToDateStr', () => {
  it('should convert date to date string in user TZ', () => {
    const d = new Date(2023, 10, 23, 12);
    expect(mapDateToDateStr(d)).toEqual('2023-11-23');
  });

  it('should convert date to date string in user TZ (check + tz)', () => {
    const d = new Date('2023-06-24T23:59:59.000+02:00');
    expect(mapDateToDateStr(d)).toEqual('2023-06-24');
  });

  it('should convert date to date string in user TZ (check - tz)', () => {
    const d = new Date('2023-06-25T01:59:59.000-10:00');
    expect(mapDateToDateStr(d)).toEqual('2023-06-25');
  });

  it('should convert date to date string in UTC (check Z)', () => {
    const d = new Date('2023-06-25T01:59:59.000Z');
    expect(mapDateToDateStr(d)).toEqual('2023-06-25');
  });
});
