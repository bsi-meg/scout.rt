/*
 * Copyright (c) 2010, 2025 BSI Business Systems Integration AG
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import {
  ArrayDoNodeSerializer, arrays, Constructor, DataObjectDeserializer, DataObjectSerializer, DateDoNodeSerializer, DoEntity, DoNodeSerializer, doValueMetaData, IdDoNodeSerializer, MapDoNodeSerializer, NumberDoNodeSerializer, objects,
  ObjectType, scout, SetDoNodeSerializer
} from '../index';

export const dataObjects = {

  serializers: [
    new DateDoNodeSerializer(),
    new IdDoNodeSerializer(),
    new MapDoNodeSerializer(),
    new SetDoNodeSerializer(),
    new NumberDoNodeSerializer(),
    new ArrayDoNodeSerializer() // must be after Set
  ] as DoNodeSerializer<any>[],

  stringify(dataObject: any): string {
    const serialized = dataObjects.serialize(dataObject);
    if (!serialized) {
      return null;
    }
    return JSON.stringify(serialized);
  },

  serialize(dataObject: any): any {
    if (!dataObject) {
      return null;
    }
    return scout.create(DataObjectSerializer).serialize(dataObject);
  },

  parse<T extends DoEntity | DoEntity[]>(json: string, objectType?: ObjectType<T>): T {
    if (!json) {
      return null;
    }
    const value = JSON.parse(json);
    return dataObjects.deserialize(value, objectType);
  },

  deserialize<T extends DoEntity | DoEntity[]>(obj: any, objectType?: ObjectType<T>): T {
    if (!obj) {
      return null;
    }
    // convert string to constructor if possible as the datatype metadata would be on the constructor
    const metaData = doValueMetaData.resolveFieldMetaData(objectType);

    const deserializer = scout.create(DataObjectDeserializer);
    return deserializer.deserialize(obj, metaData);
  },

  /**
   * @returns the DO entity contribution for the given contribution class or type.
   */
  getContribution<TContributionDo extends DoEntity>(contributionClassOrType: DoContributionClassOrType<TContributionDo>, doEntity: DoEntityWithContributions): TContributionDo {
    if (!doEntity?._contributions?.length) {
      return null;
    }
    scout.assertParameter('contributionClassOrType', contributionClassOrType);
    return doEntity._contributions.find(getContribPredicate(contributionClassOrType)) as TContributionDo;
  },

  /**
   * Adds a new DO entity contribution to the given DO entity.
   * Existing contributions for the same contribution class are replaced. If the contribution is a plain object, existing contributions with the same type are replaced.
   */
  addContribution(contribution: DoEntity, doEntity: DoEntityWithContributions) {
    if (!doEntity) {
      return;
    }
    scout.assertParameter('contribution', contribution);
    if (objects.isPojo(contribution)) {
      scout.assertProperty(contribution, '_type');
      dataObjects.removeContribution(contribution._type, doEntity);
    } else {
      // @ts-expect-error
      dataObjects.removeContribution(contribution.constructor, doEntity);
    }
    doEntity._contributions = arrays.ensure(doEntity._contributions);
    doEntity._contributions.push(contribution);
  },

  /**
   * Removes the DO entity contributions whose class or type matches the given contribution class.
   * @returns true if a contribution was removed.
   */
  removeContribution<TContributionDo extends DoEntity>(contributionClassOrType: DoContributionClassOrType<TContributionDo>, doEntity: DoEntityWithContributions): boolean {
    if (!doEntity) {
      return;
    }
    scout.assertParameter('contributionClassOrType', contributionClassOrType);
    const removed = arrays.removeByPredicate(doEntity._contributions, getContribPredicate(contributionClassOrType));
    if (doEntity._contributions?.length === 0) {
      delete doEntity._contributions;
    }
    return removed;
  }
};

function getContribPredicate(contributionClassOrType: DoContributionClassOrType<DoEntity>): (c: DoEntity) => boolean {
  if (typeof contributionClassOrType === 'string') {
    return contribution => contribution._type === contributionClassOrType;
  }
  return contribution => contribution.constructor === contributionClassOrType;
}

export type DoEntityWithContributions = DoEntity & { _contributions?: DoEntity[] };
export type DoContributionClassOrType<TContributionDo extends DoEntity> = string | Constructor<TContributionDo>;
