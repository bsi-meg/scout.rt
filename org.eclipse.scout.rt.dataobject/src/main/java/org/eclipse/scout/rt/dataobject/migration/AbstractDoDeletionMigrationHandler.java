/*
 * Copyright (c) 2010, 2025 BSI Business Systems Integration AG
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 */
package org.eclipse.scout.rt.dataobject.migration;

import org.eclipse.scout.rt.dataobject.IDoEntity;
import org.eclipse.scout.rt.dataobject.ITypeVersion;
import org.eclipse.scout.rt.platform.BEANS;
import org.eclipse.scout.rt.platform.exception.PlatformException;
import org.eclipse.scout.rt.platform.namespace.NamespaceVersion;

/**
 * Abstract implementation of {@link IDoStructureMigrationHandler} to documenting the DO deletion and to ensure that it has already been executed.
 * Also required to ensure that the pre-validation of the config import does not fail
 */
public abstract class AbstractDoDeletionMigrationHandler implements IDoStructureMigrationHandler {

  private final NamespaceVersion m_toTypeVersion;

  protected AbstractDoDeletionMigrationHandler() {
    m_toTypeVersion = BEANS.get(toTypeVersionClass()).getVersion();
  }

  @Override
  public NamespaceVersion toTypeVersion() {
    return m_toTypeVersion;
  }

  public abstract Class<? extends ITypeVersion> toTypeVersionClass();

  @Override
  public boolean applyMigration(DataObjectMigrationContext ctx, IDoEntity doEntity) {
    throw new PlatformException("Unexpected DOs of types %s, all occurrences should have been deleted.", getTypeNames().toString());
  }
}
