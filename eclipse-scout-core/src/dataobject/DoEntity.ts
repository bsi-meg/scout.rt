/*
 * Copyright (c) 2010, 2025 BSI Business Systems Integration AG
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import {AbstractConstructor, Constructor, dataObjects, DoContributionClassOrType, InitModelOf, objects, ObjectType} from '../index';

export interface DoEntity {
  _type?: string;
  _typeVersion?: string;

  [property: string]: any; // allow custom properties
}

export class BaseDoEntity implements DoEntity, BaseDoEntityModel {
  declare model: Partial<this> | BaseDoEntityModel;

  _type?: string;

  init(model: InitModelOf<this>) {
    if (objects.isPojo(model)) {
      const tmpInstance = dataObjects.deserialize(model, this.constructor as ObjectType<this>);
      $.extend(this, tmpInstance);
    }
  }

  getContribution<TContributionDo extends DoEntity>(contributionClassOrType: DoContributionClassOrType<TContributionDo>): TContributionDo {
    return dataObjects.getContribution(contributionClassOrType, this);
  }

  addContribution(contribution: DoEntity) {
    dataObjects.addContribution(contribution, this);
  }

  removeContribution<TContributionDo extends DoEntity>(contributionClassOrType: DoContributionClassOrType<TContributionDo>): boolean {
    return dataObjects.removeContribution(contributionClassOrType, this);
  }

  toPojo(): object {
    return dataObjects.serialize(this);
  }

  /**
   * deep
   * note: may be different (e.g. when using maps with equal values)
   */
  clone(): this {
    return dataObjects.deserialize(this.toPojo());
  }

  equals(obj: any) {
    return objects.equalsRecursive2(this, obj, true /* prevent stackoverflow as this is called in equals */);
  }
}

export interface BaseDoEntityModel {
  [property: string]: any; // allow custom properties
}

export function typeName(typeName: string) {
  return <T extends Constructor | AbstractConstructor>(BaseClass: T) => class extends BaseClass {
    constructor(...args: any[]) {
      super(...args);
      Reflect.set(this, '_type', typeName); // instance
    }
  };
}
