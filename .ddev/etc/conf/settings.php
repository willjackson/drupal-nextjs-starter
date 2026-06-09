<?php

/**
 * @file
 * Local development settings, symlinked to settings.local.php by `ddev init-site`.
 *
 * This mirrors .docksal/etc/conf/settings.php. The database connection, host
 * patterns and permissions hardening are provided by DDEV in settings.ddev.php,
 * so only the project-specific local settings live here.
 */

// Use the development services container (verbose errors, no render cache, etc.).
$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/development.services.yml';

// Private filesystem (relative to the Drupal web root => drupal/private).
$settings['file_private_path'] = '../private';
