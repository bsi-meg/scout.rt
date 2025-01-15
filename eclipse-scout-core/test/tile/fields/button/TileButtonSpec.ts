/*
 * Copyright (c) 2010, 2025 BSI Business Systems Integration AG
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import {icons, Menu, scout, TileButton} from '../../../../src';

describe('TileButton', () => {
  let session: SandboxSession;

  beforeEach(() => {
    setFixtures(sandbox());
    session = sandboxSession();
  });

  describe('labelVisible', () => {

    it('does not render label as $label', () => {
      let button = scout.create(TileButton, {
        parent: session.desktop,
        label: 'Test'
      });
      button.render();

      expect(button.labelVisible).toBe(true);
      expect(button.label).toBe('Test');
      expect(button.$label).toBe(null);
      expect(button.$buttonLabel).toBeVisible();
      expect(button.$buttonLabel.html()).toBe('Test');
    });

    it('shows the $buttonLabel when labelVisible=true, expect if only an icon icon is present', () => {
      let button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: true,
        label: null,
        iconId: null
      });
      button.render();
      expect(button.$buttonLabel).toBeVisible();
      expect(button.$buttonLabel.html()).toBe('&nbsp;');
      expect(button.get$Icon().length).toBe(0);

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: true,
        label: 'Options',
        iconId: null
      });
      button.render();
      expect(button.$buttonLabel).toBeVisible();
      expect(button.$buttonLabel.html()).toBe('Options');
      expect(button.get$Icon().length).toBe(0);

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: true,
        label: null,
        iconId: icons.GEAR
      });
      button.render();
      expect(button.$buttonLabel).toBeHidden();
      expect(button.$buttonLabel.html()).toBe('&nbsp;');
      expect(button.get$Icon()).toBeVisible();
      expect(button.get$Icon().hasClass('with-label')).toBe(false);

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: true,
        label: 'Options',
        iconId: icons.GEAR
      });
      button.render();
      expect(button.$buttonLabel).toBeVisible();
      expect(button.$buttonLabel.html()).toBe('Options');
      expect(button.get$Icon()).toBeVisible();
      expect(button.get$Icon().hasClass('with-label')).toBe(true);

      // Menus should behave like icons

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: true,
        label: null,
        menus: [{objectType: Menu, text: 'Click me'}]
      });
      button.render();
      expect(button.$buttonLabel).toBeHidden();
      expect(button.$buttonLabel.html()).toBe('&nbsp;');
      expect(button.get$Icon().length).toBe(0);
      expect(button.$submenuIcon).toBeTruthy();
      expect(button.$submenuIcon.hasClass('with-label')).toBe(false);

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: true,
        label: 'Options',
        menus: [{objectType: Menu, text: 'Click me'}]
      });
      button.render();
      expect(button.$buttonLabel).toBeVisible();
      expect(button.$buttonLabel.html()).toBe('Options');
      expect(button.get$Icon().length).toBe(0);
      expect(button.$submenuIcon).toBeTruthy();
      expect(button.$submenuIcon.hasClass('with-label')).toBe(true);

      // Icons and menus combined

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: true,
        label: null,
        iconId: icons.GEAR,
        menus: [{objectType: Menu, text: 'Click me'}]
      });
      button.render();
      expect(button.$buttonLabel).toBeHidden();
      expect(button.$buttonLabel.html()).toBe('&nbsp;');
      expect(button.get$Icon()).toBeVisible();
      expect(button.get$Icon().hasClass('with-label')).toBe(false);
      expect(button.$submenuIcon).toBeFalsy(); // no indicator when _only_ the icon is visible

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: true,
        label: 'Options',
        iconId: icons.GEAR,
        menus: [{objectType: Menu, text: 'Click me'}]
      });
      button.render();
      expect(button.$buttonLabel).toBeVisible();
      expect(button.$buttonLabel.html()).toBe('Options');
      expect(button.get$Icon()).toBeVisible();
      expect(button.get$Icon().hasClass('with-label')).toBe(true);
      expect(button.$submenuIcon).toBeTruthy();
      expect(button.$submenuIcon.hasClass('with-label')).toBe(true);
    });

    it('never shows the label if labelVisible=false', () => {
      // Note: This behaves differently from a normal Button widget.

      let button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: false,
        label: null,
        iconId: null
      });
      button.render();
      expect(button.$buttonLabel).toBeHidden(); // <--
      expect(button.$buttonLabel.html()).toBe('&nbsp;');
      expect(button.get$Icon().length).toBe(0);

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: false,
        label: 'Options',
        iconId: null
      });
      button.render();
      expect(button.$buttonLabel).toBeHidden(); // <--
      expect(button.$buttonLabel.html()).toBe('Options');
      expect(button.get$Icon().length).toBe(0);

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: false,
        label: null,
        iconId: icons.GEAR
      });
      button.render();
      expect(button.$buttonLabel).toBeHidden();
      expect(button.$buttonLabel.html()).toBe('&nbsp;');
      expect(button.get$Icon()).toBeVisible();
      expect(button.get$Icon().hasClass('with-label')).toBe(false);

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: false,
        label: 'Options',
        iconId: icons.GEAR
      });
      button.render();
      expect(button.$buttonLabel).toBeHidden(); // <--
      expect(button.$buttonLabel.html()).toBe('Options');
      expect(button.get$Icon()).toBeVisible();
      expect(button.get$Icon().hasClass('with-label')).toBe(false);

      // Menus should behave like icons

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: false,
        label: null,
        menus: [{objectType: Menu, text: 'Click me'}]
      });
      button.render();
      expect(button.$buttonLabel).toBeHidden();
      expect(button.$buttonLabel.html()).toBe('&nbsp;');
      expect(button.get$Icon().length).toBe(0);
      expect(button.$submenuIcon).toBeTruthy();
      expect(button.$submenuIcon.hasClass('with-label')).toBe(false);

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: false,
        label: 'Options',
        menus: [{objectType: Menu, text: 'Click me'}]
      });
      button.render();
      expect(button.$buttonLabel).toBeHidden(); // <--
      expect(button.$buttonLabel.html()).toBe('Options');
      expect(button.get$Icon().length).toBe(0);
      expect(button.$submenuIcon).toBeTruthy();
      expect(button.$submenuIcon.hasClass('with-label')).toBe(false);

      // Icons and menus combined

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: false,
        label: null,
        iconId: icons.GEAR,
        menus: [{objectType: Menu, text: 'Click me'}]
      });
      button.render();
      expect(button.$buttonLabel).toBeHidden(); // <--
      expect(button.$buttonLabel.html()).toBe('&nbsp;');
      expect(button.get$Icon()).toBeVisible();
      expect(button.get$Icon().hasClass('with-label')).toBe(false);
      expect(button.$submenuIcon).toBeFalsy(); // no indicator when _only_ the icon is visible

      button = scout.create(TileButton, {
        parent: session.desktop,
        labelVisible: false,
        label: 'Options',
        iconId: icons.GEAR,
        menus: [{objectType: Menu, text: 'Click me'}]
      });
      button.render();
      expect(button.$buttonLabel).toBeHidden(); // <--
      expect(button.$buttonLabel.html()).toBe('Options');
      expect(button.get$Icon()).toBeVisible();
      expect(button.get$Icon().hasClass('with-label')).toBe(false);
      expect(button.$submenuIcon).toBeTruthy();
      expect(button.$submenuIcon.hasClass('with-label')).toBe(false);
    });

    it('shows or hides the label dynamically when the properties change', () => {
      // Note: This behaves differently from a normal Button widget.

      let button = scout.create(TileButton, {
        parent: session.desktop
      });
      button.render();
      expect(button.$buttonLabel).toBeVisible();
      expect(button.$buttonLabel.html()).toBe('&nbsp;');
      expect(button.get$Icon().length).toBe(0);

      button.setLabel('Options');
      expect(button.$buttonLabel).toBeVisible();
      expect(button.$buttonLabel.html()).toBe('Options');
      expect(button.get$Icon().length).toBe(0);

      button.setIconId(icons.GEAR);
      expect(button.$buttonLabel).toBeVisible();
      expect(button.$buttonLabel.html()).toBe('Options');
      expect(button.get$Icon()).toBeVisible();
      expect(button.get$Icon().hasClass('with-label')).toBe(true);

      button.setLabel(null);
      expect(button.$buttonLabel).toBeHidden();
      expect(button.$buttonLabel.html()).toBe('&nbsp;');
      expect(button.get$Icon()).toBeVisible();
      expect(button.get$Icon().hasClass('with-label')).toBe(false);

      button.setIconId(null);
      expect(button.$buttonLabel).toBeVisible();
      expect(button.$buttonLabel.html()).toBe('&nbsp;');
      expect(button.get$Icon().length).toBe(0);

      button.setLabelVisible(false);
      expect(button.$buttonLabel).toBeHidden();
      expect(button.$buttonLabel.html()).toBe('&nbsp;');
      expect(button.get$Icon().length).toBe(0);

      button.setLabel('Options');
      expect(button.$buttonLabel).toBeHidden();
      expect(button.$buttonLabel.html()).toBe('Options');
      expect(button.get$Icon().length).toBe(0);

      button.setIconId(icons.GEAR);
      expect(button.$buttonLabel).toBeHidden();
      expect(button.$buttonLabel.html()).toBe('Options');
      expect(button.get$Icon()).toBeVisible();
      expect(button.get$Icon().hasClass('with-label')).toBe(false);

      button.setLabelVisible(true);
      expect(button.$buttonLabel).toBeVisible();
      expect(button.$buttonLabel.html()).toBe('Options');
      expect(button.get$Icon()).toBeVisible();
      expect(button.get$Icon().hasClass('with-label')).toBe(true);
    });
  });
});
