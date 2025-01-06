/*
 * Copyright (c) 2010, 2025 BSI Business Systems Integration AG
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import {BaseDoEntity, dates, DoRegistry, ObjectFactory, scout, typeName} from '../../src/index';

describe('BaseDoEntity', () => {
  beforeAll(() => {
    ObjectFactory.get().registerNamespace('scout', {
      BaseDoEntityFixture01Do, BaseDoEntityFixture02Do
    }, {allowedReplacements: ['scout.BaseDoEntityFixture01Do', 'scout.BaseDoEntityFixture02Do']});

    const doRegistry = DoRegistry.get();
    doRegistry.add(BaseDoEntityFixture01Do);
    doRegistry.add(BaseDoEntityFixture02Do);
  });

  afterAll(() => {
    const doRegistry = DoRegistry.get();
    doRegistry.remove(BaseDoEntityFixture01Do);
    doRegistry.remove(BaseDoEntityFixture02Do);
  });

  it('can be deep cloned', () => {
    const fixture = scout.create(BaseDoEntityFixture01Do, {
      propObj: {
        dateProp: dates.parseJsonDate('2025-01-06 11:04:40.708Z')
      }
    });
    const clone = fixture.clone();

    expect(fixture.equals(clone)).toBeTrue();
    expect(clone).not.toBe(fixture);
    expect(clone).toBeInstanceOf(BaseDoEntityFixture01Do);
    expect(clone.propObj).toBeInstanceOf(BaseDoEntityFixture02Do);
    expect(clone.propObj).not.toBe(fixture.propObj);
    expect(clone.propObj.dateProp).toBeInstanceOf(Date);
    expect(clone.propObj.dateProp).toEqual(dates.parseJsonDate('2025-01-06 11:04:40.708Z'));
    // modify clone, expect fixture to be untouched

    clone.propObj.dateProp = dates.parseJsonDate('2025-01-06 14:04:40.708Z');
    expect(fixture.propObj.dateProp).toEqual(dates.parseJsonDate('2025-01-06 11:04:40.708Z'));
    expect(fixture.equals(clone)).toBeFalse();
  });
});

@typeName('scout.BaseDoEntityFixture01')
export class BaseDoEntityFixture01Do extends BaseDoEntity {
  propObj: BaseDoEntityFixture02Do;
}

@typeName('scout.BaseDoEntityFixture02')
export class BaseDoEntityFixture02Do extends BaseDoEntity {
  dateProp: Date;
}
