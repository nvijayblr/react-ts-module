import {
  convertBillOccurenceKeyToLabel,
  generateBillOccurenceOption,
  generateFutureDispatchDate,
  identifyBillOccurenceOption,
} from './adjustmentBillPeriod.utils';

describe('Next dispatch date', () => {
  it('should calc next dispatch day, right after billing start', () => {
    expect(generateFutureDispatchDate(new Date('2019-12-1'), new Date('2019-12-2'))).toEqual(
      new Date('2020-01-01T00:00:00.000Z')
    );
  });
  it('should calc next dispatch day, in 1 month', () => {
    expect(generateFutureDispatchDate(new Date('2019-12-1'), new Date('2020-1-2'))).toEqual(
      new Date('2020-02-01T00:00:00.000Z')
    );
  });
  it('should calc next dispatch day, when billing day is in future in current month', () => {
    expect(generateFutureDispatchDate(new Date('2019-12-15'), new Date('2020-1-2'))).toEqual(
      new Date('2020-01-15T00:00:00.000Z')
    );
  });
  it('should calc next dispatch day, according to UTC timezone', () => {
    expect(
      generateFutureDispatchDate(new Date('2023-02-24T00:00:00.000Z'), new Date('2023-06-13T01:02:04.011Z'))
    ).toEqual(new Date('2023-06-24T00:00:00.000Z'));
  });
});

describe('Identify Bill Occurence', () => {
  it('as Every Bill', () => {
    expect(identifyBillOccurenceOption(new Date('2019-12-1'), new Date('2020-1-1'), undefined)).toEqual('every_bill');
  });

  // dispatchDate is 24
  // 06-02 - 06-23 is a first interval
  // 06-24 - 07-23 is a second interval
  // 07-24 - 08-23 is a third interval
  it('as Next 3 Bill with custom current time', () => {
    expect(
      identifyBillOccurenceOption(
        new Date('2023-02-24T00:00:00.000Z'),
        new Date('2023-06-13T01:23:45.678Z'),
        new Date('2023-08-02T00:00:00.000Z')
      )
    ).toEqual('next_3_bill');
  });

  // 11-01 - 11-30 is a first interval (but it is in past, so it is not included)
  // 12-01 - 12-31 is a second interval
  // 01-01 - 01-31 is a third interval
  // 02-01 - 02-29 is a fourth interval
  // 03-01 - 03-31 is a fifth interval
  it('as Next 4 Bills', () => {
    expect(identifyBillOccurenceOption(new Date('2019-11-1'), new Date('2019-12-15'), new Date('2020-4-1'))).toEqual(
      'next_4_bill'
    );
  });

  it('as Next 1 Bill', () => {
    expect(
      identifyBillOccurenceOption(
        new Date('2019-12-01T00:00:00.000Z'),
        new Date('2020-01-02T00:00:00.000Z'),
        new Date('2020-02-01T00:00:00.000Z')
      )
    ).toEqual('next_1_bill');
  });

  it('as Next 1 Bills, when current day is bill date, because it will be included in the next range', () => {
    expect(identifyBillOccurenceOption(new Date('2019-12-1'), new Date('2020-1-1'), new Date('2020-2-1'))).toEqual(
      'next_1_bill'
    );
  });

  it('as Next 2 Bills', () => {
    expect(identifyBillOccurenceOption(new Date('2019-11-1'), new Date('2020-1-2'), new Date('2020-3-1'))).toEqual(
      'next_2_bill'
    );
  });

  it('as Next 3 Bills', () => {
    expect(identifyBillOccurenceOption(new Date('2019-11-1'), new Date('2019-12-2'), new Date('2020-3-1'))).toEqual(
      'next_3_bill'
    );
  });

  it('as Next 1 Bill, when end date is tomorrow', () => {
    expect(identifyBillOccurenceOption(new Date('2019-11-1'), new Date('2020-1-2'), new Date('2020-1-2'))).toEqual(
      'next_1_bill'
    );
  });

  it('as Next 1 Bill, when end date is in past but still in current billing period', () => {
    expect(identifyBillOccurenceOption(new Date('2019-11-1'), new Date('2020-1-3'), new Date('2020-1-2'))).toEqual(
      'next_1_bill'
    );
  });

  // 11-01 - 11-30 is a first interval (but it is in past, so it is not included)
  // 12-01 - 12-31 is a second interval
  // 01-01 - 01-31 is a third interval
  it('as Next 2 Bills, when end date is after next bill', () => {
    expect(
      identifyBillOccurenceOption(
        new Date('2019-11-01T00:00:00.000Z'),
        new Date('2019-12-01T00:00:00.000Z'),
        new Date('2020-01-02T00:00:00.000Z')
      )
    ).toEqual('next_2_bill');
  });

  // dispatchDate is 24
  // 06-02 - 06-23 is a first interval
  // 06-24 - 07-23 is a second interval
  it('as Next 2 Bills, when in the middle of first interval', () => {
    expect(
      identifyBillOccurenceOption(
        new Date('2023-02-24T00:00:00.000Z'),
        new Date('2023-06-13T19:52:27.131Z'),
        new Date('2023-07-23T00:00:00.000Z')
      )
    ).toEqual('next_2_bill');
  });

  it('as Next 0 Bill, when end date is in past and not in current billing period', () => {
    expect(identifyBillOccurenceOption(new Date('2019-11-1'), new Date('2020-1-3'), new Date('2019-12-3'))).toEqual(
      'next_0_bill'
    );
  });
});

describe('Generate Bill Occurence', () => {
  it('should generate Every Bill', () => {
    const result = generateBillOccurenceOption(new Date('2019-12-1'), new Date('2020-01-01T00:00:00.000Z'), undefined);
    expect(result).toEqual({
      key: 'every_bill',
      displayValue: 'Every Bill',
      config: {
        startDate: new Date('2020-01-01T00:00:00.000Z'),
        endDate: null,
      },
    });
    expect(
      identifyBillOccurenceOption(
        new Date('2019-12-1'),
        new Date('2020-01-01T00:00:00.000Z'),
        result.config?.endDate ?? undefined
      )
    ).toEqual(result.key);
  });
  it('should generate Next 1 Bill', () => {
    const result = generateBillOccurenceOption(
      new Date('2019-12-01T00:00:00.000Z'),
      new Date('2020-01-01T00:00:00.000Z'),
      1
    );
    expect(result).toEqual({
      key: 'next_1_bill',
      displayValue: 'Next Bill',
      config: {
        startDate: new Date('2020-01-01T00:00:00.000Z'),
        endDate: new Date('2020-01-31T00:00:00.000Z'),
      },
    });
    expect(
      identifyBillOccurenceOption(
        new Date('2019-12-01T00:00:00.000Z'),
        new Date('2020-01-01T00:00:00.000Z'),
        result.config?.endDate ?? undefined
      )
    ).toEqual(result.key);
  });
  it('should generate Next 2 Bills', () => {
    const result = generateBillOccurenceOption(
      new Date('2019-12-01T00:00:00.000Z'),
      new Date('2020-01-01T00:00:00.000Z'),
      2
    );
    expect(result).toEqual({
      key: 'next_2_bill',
      displayValue: 'Next 2 Bills',
      config: {
        startDate: new Date('2020-01-01T00:00:00.000Z'),
        endDate: new Date('2020-02-29T00:00:00.000Z'),
      },
    });
    expect(
      identifyBillOccurenceOption(
        new Date('2019-12-01T00:00:00.000Z'),
        new Date('2020-01-01T00:00:00.000Z'),
        result.config?.endDate ?? undefined
      )
    ).toEqual(result.key);
  });
  it('should generate Next 3 Bills', () => {
    const result = generateBillOccurenceOption(
      new Date('2019-12-01T00:00:00.000Z'),
      new Date('2020-01-01T00:00:00.000Z'),
      3
    );
    expect(result).toEqual({
      key: 'next_3_bill',
      displayValue: 'Next 3 Bills',
      config: {
        startDate: new Date('2020-01-01T00:00:00.000Z'),
        endDate: new Date('2020-03-31T00:00:00.000Z'),
      },
    });
    expect(
      identifyBillOccurenceOption(
        new Date('2019-12-01T00:00:00.000Z'),
        new Date('2020-01-01T00:00:00.000Z'),
        result.config?.endDate ?? undefined
      )
    ).toEqual(result.key);
  });

  // dispatchDate is 24
  // 06-02 - 06-23 is a first interval
  // 06-24 - 07-23 is a second interval
  it('should generate Next 2 Bills, when in the middle of first interval', () => {
    const startBillingDate = new Date('2023-02-24T00:00:00.000Z');
    const now = new Date('2023-06-13T19:52:27.131Z');

    const next2BillConfig = generateBillOccurenceOption(startBillingDate, now, 2);
    expect(next2BillConfig).toEqual({
      key: 'next_2_bill',
      displayValue: 'Next 2 Bills',
      config: {
        startDate: new Date('2023-06-13T19:52:27.131Z'),
        endDate: new Date('2023-07-23T00:00:00.000Z'),
      },
    });
    expect(identifyBillOccurenceOption(startBillingDate, now, next2BillConfig.config?.endDate ?? undefined)).toEqual(
      next2BillConfig.key
    );

    const nextBillConfig = generateBillOccurenceOption(startBillingDate, now, 1);
    expect(nextBillConfig).toEqual({
      key: 'next_1_bill',
      displayValue: 'Next Bill',
      config: {
        startDate: new Date('2023-06-13T19:52:27.131Z'),
        endDate: new Date('2023-06-23T00:00:00.000Z'),
      },
    });
    expect(identifyBillOccurenceOption(startBillingDate, now, nextBillConfig.config?.endDate ?? undefined)).toEqual(
      nextBillConfig.key
    );
  });
});

describe('Convert Bill Occurence to Label', () => {
  it.each`
    billOccurenceOptionKey | expectedLabel
    ${'every_bill'}        | ${'Every Bill'}
    ${'next_0_bill'}       | ${'Past Bill'}
    ${'next_1_bill'}       | ${'Next Bill'}
    ${'next_2_bill'}       | ${'Next 2 Bills'}
    ${'next_3_bill'}       | ${'Next 3 Bills'}
    ${'next_4_bill'}       | ${'Next 4 Bills'}
  `('should convert $billOccurenceOptionKey to $expectedLabel', ({ billOccurenceOptionKey, expectedLabel }) => {
    expect(convertBillOccurenceKeyToLabel(billOccurenceOptionKey)).toEqual(expectedLabel);
  });
});
